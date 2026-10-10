const Banner = require('../models/Banner');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/upload');

/**
 * @desc    Get all active banners (public)
 * @route   GET /api/banners
 * @access  Public
 */
const getBanners = async (req, res) => {
  try {
    const query = {};

    // Public users only see active banners
    if (!req.user || req.user.role !== 'admin') {
      query.isActive = true;
    }

    const banners = await Banner.find(query)
      .sort({ displayOrder: 1 })
      .lean();

    res.json({
      success: true,
      data: banners,
    });
  } catch (error) {
    console.error('Get banners error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch banners',
    });
  }
};

/**
 * @desc    Create a banner
 * @route   POST /api/banners
 * @access  Private/Admin
 */
const createBanner = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Banner image is required',
      });
    }

    const result = await uploadToCloudinary(req.file.buffer, 'suyog-jewelry/banners', {
      transformation: [
        { width: 1920, height: 800, crop: 'fill', quality: 'auto:good', fetch_format: 'auto' },
      ],
    });

    const bannerData = {
      ...req.body,
      image: result,
    };

    if (typeof bannerData.isActive === 'string') {
      bannerData.isActive = bannerData.isActive === 'true';
    }

    const banner = await Banner.create(bannerData);

    res.status(201).json({
      success: true,
      message: 'Banner created successfully',
      data: banner,
    });
  } catch (error) {
    console.error('Create banner error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create banner',
    });
  }
};

/**
 * @desc    Update a banner
 * @route   PUT /api/banners/:id
 * @access  Private/Admin
 */
const updateBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) {
      return res.status(404).json({
        success: false,
        message: 'Banner not found',
      });
    }

    const updateData = { ...req.body };

    if (typeof updateData.isActive === 'string') {
      updateData.isActive = updateData.isActive === 'true';
    }

    // Upload new image if present
    if (req.file) {
      if (banner.image && banner.image.publicId) {
        await deleteFromCloudinary(banner.image.publicId);
      }
      const result = await uploadToCloudinary(req.file.buffer, 'suyog-jewelry/banners', {
        transformation: [
          { width: 1920, height: 800, crop: 'fill', quality: 'auto:good', fetch_format: 'auto' },
        ],
      });
      updateData.image = result;
    }

    Object.assign(banner, updateData);
    await banner.save();

    res.json({
      success: true,
      message: 'Banner updated successfully',
      data: banner,
    });
  } catch (error) {
    console.error('Update banner error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update banner',
    });
  }
};

/**
 * @desc    Delete a banner
 * @route   DELETE /api/banners/:id
 * @access  Private/Admin
 */
const deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) {
      return res.status(404).json({
        success: false,
        message: 'Banner not found',
      });
    }

    if (banner.image && banner.image.publicId) {
      await deleteFromCloudinary(banner.image.publicId);
    }

    await banner.deleteOne();

    res.json({
      success: true,
      message: 'Banner deleted successfully',
    });
  } catch (error) {
    console.error('Delete banner error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete banner',
    });
  }
};

module.exports = {
  getBanners,
  createBanner,
  updateBanner,
  deleteBanner,
};
