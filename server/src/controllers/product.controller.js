const Product = require('../models/Product');
const { uploadMultipleToCloudinary, deleteFromCloudinary, deleteMultipleFromCloudinary } = require('../utils/upload');

/**
 * @desc    Get all products (public, with filters/search/pagination)
 * @route   GET /api/products
 * @access  Public
 */
const getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      material,
      occasion,
      minPrice,
      maxPrice,
      search,
      sort = '-createdAt',
      featured,
      newArrivals,
      status, // admin filter
    } = req.query;

    const query = {};

    // Public users only see active products
    if (!req.user || req.user.role !== 'admin') {
      query.isActive = true;
    } else if (status === 'active') {
      query.isActive = true;
    } else if (status === 'draft') {
      query.isActive = false;
    }

    // Category filter
    if (category) {
      query.category = category;
    }

    // Material filter (can be comma-separated)
    if (material) {
      const materials = material.split(',');
      query.material = { $in: materials };
    }

    // Occasion filter
    if (occasion) {
      const occasions = occasion.split(',');
      query.occasion = { $in: occasions };
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Featured filter
    if (featured === 'true') {
      query.isFeatured = true;
    }

    // New arrivals filter
    if (newArrivals === 'true') {
      query.isNewArrival = true;
    }

    // Text search
    if (search) {
      query.$text = { $search: search };
    }

    // Sort options
    let sortOption = {};
    switch (sort) {
      case 'price_asc':
        sortOption = { price: 1 };
        break;
      case 'price_desc':
        sortOption = { price: -1 };
        break;
      case 'name_asc':
        sortOption = { name: 1 };
        break;
      case 'name_desc':
        sortOption = { name: -1 };
        break;
      case 'popular':
        sortOption = { whatsappClicks: -1 };
        break;
      case 'newest':
      default:
        sortOption = { createdAt: -1 };
        break;
    }

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      Product.find(query)
        .populate('category', 'name slug')
        .sort(sortOption)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Product.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: products,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
        hasMore: pageNum * limitNum < total,
      },
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
    });
  }
};

/**
 * @desc    Get single product by ID or slug
 * @route   GET /api/products/:id
 * @access  Public
 */
const getProduct = async (req, res) => {
  try {
    const { id } = req.params;

    let product;
    // Try finding by MongoDB ID first, then by slug
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(id).populate('category', 'name slug');
    }
    if (!product) {
      product = await Product.findOne({ slug: id }).populate('category', 'name slug');
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Increment view count (non-blocking)
    Product.findByIdAndUpdate(product._id, { $inc: { viewCount: 1 } }).exec();

    // Get related products (same category, exclude current)
    const related = await Product.find({
      category: product.category._id,
      _id: { $ne: product._id },
      isActive: true,
    })
      .limit(4)
      .select('name slug images price priceOnRequest category')
      .populate('category', 'name slug')
      .lean();

    res.json({
      success: true,
      data: product,
      related,
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product',
    });
  }
};

/**
 * @desc    Create a new product
 * @route   POST /api/products
 * @access  Private/Admin
 */
const createProduct = async (req, res) => {
  try {
    const productData = { ...req.body };

    // Parse JSON fields if sent as strings (from form-data)
    if (typeof productData.tags === 'string') {
      try { productData.tags = JSON.parse(productData.tags); } catch { productData.tags = []; }
    }
    if (typeof productData.sizes === 'string') {
      try { productData.sizes = JSON.parse(productData.sizes); } catch { productData.sizes = []; }
    }
    if (typeof productData.occasion === 'string') {
      try { productData.occasion = JSON.parse(productData.occasion); } catch { productData.occasion = []; }
    }

    // Handle boolean fields from form-data
    if (typeof productData.priceOnRequest === 'string') {
      productData.priceOnRequest = productData.priceOnRequest === 'true';
    }
    if (typeof productData.isFeatured === 'string') {
      productData.isFeatured = productData.isFeatured === 'true';
    }
    if (typeof productData.isNewArrival === 'string') {
      productData.isNewArrival = productData.isNewArrival === 'true';
    }
    if (typeof productData.isActive === 'string') {
      productData.isActive = productData.isActive === 'true';
    }

    // Upload images to Cloudinary if files are present
    if (req.files && req.files.length > 0) {
      const uploadedImages = await uploadMultipleToCloudinary(req.files);
      productData.images = uploadedImages;
    }

    const product = await Product.create(productData);
    await product.populate('category', 'name slug');

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product,
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create product',
    });
  }
};

/**
 * @desc    Update a product
 * @route   PUT /api/products/:id
 * @access  Private/Admin
 */
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    const updateData = { ...req.body };

    // Parse JSON fields
    if (typeof updateData.tags === 'string') {
      try { updateData.tags = JSON.parse(updateData.tags); } catch { /* keep as is */ }
    }
    if (typeof updateData.sizes === 'string') {
      try { updateData.sizes = JSON.parse(updateData.sizes); } catch { /* keep as is */ }
    }
    if (typeof updateData.occasion === 'string') {
      try { updateData.occasion = JSON.parse(updateData.occasion); } catch { /* keep as is */ }
    }

    // Handle boolean fields
    ['priceOnRequest', 'isFeatured', 'isNewArrival', 'isActive'].forEach((field) => {
      if (typeof updateData[field] === 'string') {
        updateData[field] = updateData[field] === 'true';
      }
    });

    // Handle image deletions (sent as array of publicIds to remove)
    if (updateData.deleteImages) {
      let imagesToDelete = updateData.deleteImages;
      if (typeof imagesToDelete === 'string') {
        try { imagesToDelete = JSON.parse(imagesToDelete); } catch { imagesToDelete = [imagesToDelete]; }
      }
      // Remove from Cloudinary
      await deleteMultipleFromCloudinary(imagesToDelete);
      // Remove from product images array
      product.images = product.images.filter(
        (img) => !imagesToDelete.includes(img.publicId)
      );
      delete updateData.deleteImages;
    }

    // Upload new images
    if (req.files && req.files.length > 0) {
      const uploadedImages = await uploadMultipleToCloudinary(req.files);
      const currentMaxOrder = product.images.length > 0
        ? Math.max(...product.images.map((img) => img.order))
        : -1;
      uploadedImages.forEach((img, i) => {
        img.order = currentMaxOrder + 1 + i;
      });
      product.images.push(...uploadedImages);
    }

    // Handle image reordering
    if (updateData.imageOrder) {
      let order = updateData.imageOrder;
      if (typeof order === 'string') {
        try { order = JSON.parse(order); } catch { order = []; }
      }
      // order is array of { imageId, order }
      order.forEach(({ imageId, order: newOrder }) => {
        const img = product.images.id(imageId);
        if (img) img.order = newOrder;
      });
      delete updateData.imageOrder;
    }

    // Update product fields
    Object.keys(updateData).forEach((key) => {
      if (key !== 'images') {
        product[key] = updateData[key];
      }
    });

    // Save images separately since we modified the array directly
    await product.save();
    await product.populate('category', 'name slug');

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: product,
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update product',
    });
  }
};

/**
 * @desc    Delete a product
 * @route   DELETE /api/products/:id
 * @access  Private/Admin
 */
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Delete all images from Cloudinary
    const publicIds = product.images.map((img) => img.publicId).filter(Boolean);
    if (publicIds.length > 0) {
      await deleteMultipleFromCloudinary(publicIds);
    }

    await product.deleteOne();

    res.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete product',
    });
  }
};

/**
 * @desc    Bulk actions on products
 * @route   POST /api/products/bulk
 * @access  Private/Admin
 */
const bulkAction = async (req, res) => {
  try {
    const { ids, action } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide product IDs',
      });
    }

    let result;
    switch (action) {
      case 'delete':
        // Get products to delete their Cloudinary images
        const products = await Product.find({ _id: { $in: ids } });
        const allPublicIds = products.flatMap((p) =>
          p.images.map((img) => img.publicId).filter(Boolean)
        );
        if (allPublicIds.length > 0) {
          await deleteMultipleFromCloudinary(allPublicIds);
        }
        result = await Product.deleteMany({ _id: { $in: ids } });
        break;
      case 'hide':
        result = await Product.updateMany({ _id: { $in: ids } }, { isActive: false });
        break;
      case 'show':
        result = await Product.updateMany({ _id: { $in: ids } }, { isActive: true });
        break;
      case 'feature':
        result = await Product.updateMany({ _id: { $in: ids } }, { isFeatured: true });
        break;
      case 'unfeature':
        result = await Product.updateMany({ _id: { $in: ids } }, { isFeatured: false });
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid action. Use: delete, hide, show, feature, unfeature',
        });
    }

    res.json({
      success: true,
      message: `Bulk ${action} completed`,
      data: { modifiedCount: result.modifiedCount || result.deletedCount },
    });
  } catch (error) {
    console.error('Bulk action error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to perform bulk action',
    });
  }
};

/**
 * @desc    Track WhatsApp click on product
 * @route   POST /api/products/:id/click
 * @access  Public
 */
const trackClick = async (req, res) => {
  try {
    await Product.findByIdAndUpdate(req.params.id, {
      $inc: { whatsappClicks: 1 },
    });

    res.json({
      success: true,
      message: 'Click tracked',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to track click',
    });
  }
};

/**
 * @desc    Get admin dashboard stats
 * @route   GET /api/products/stats
 * @access  Private/Admin
 */
const getStats = async (req, res) => {
  try {
    const [
      totalProducts,
      activeProducts,
      draftProducts,
      featuredProducts,
      topEnquired,
      topViewed,
      recentProducts,
    ] = await Promise.all([
      Product.countDocuments(),
      Product.countDocuments({ isActive: true }),
      Product.countDocuments({ isActive: false }),
      Product.countDocuments({ isFeatured: true }),
      Product.find({ whatsappClicks: { $gt: 0 } })
        .sort({ whatsappClicks: -1 })
        .limit(5)
        .select('name slug images whatsappClicks price')
        .lean(),
      Product.find()
        .sort({ viewCount: -1 })
        .limit(5)
        .select('name slug images viewCount price')
        .lean(),
      Product.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select('name slug images createdAt isActive')
        .lean(),
    ]);

    res.json({
      success: true,
      data: {
        totalProducts,
        activeProducts,
        draftProducts,
        featuredProducts,
        topEnquired,
        topViewed,
        recentProducts,
      },
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch stats',
    });
  }
};

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  bulkAction,
  trackClick,
  getStats,
};
