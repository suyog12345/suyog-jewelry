const mongoose = require('mongoose');
const slugify = require('slugify');

const productImageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  publicId: { type: String, required: true },
  alt: { type: String, default: '' },
  order: { type: Number, default: 0 },
}, { _id: true });

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [200, 'Product name cannot exceed 200 characters'],
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
  },
  description: {
    type: String,
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters'],
  },
  price: {
    type: Number,
    min: [0, 'Price cannot be negative'],
    default: null, // null = "Price on request"
  },
  priceOnRequest: {
    type: Boolean,
    default: false,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required'],
  },
  material: {
    type: String,
    enum: ['gold', 'silver', 'diamond', 'platinum', 'artificial', 'imitation', 'kundan', 'polki', 'meenakari', 'other'],
    required: [true, 'Material is required'],
  },
  weight: {
    type: String, // e.g., "12.5g", "2 tola"
    trim: true,
  },
  purity: {
    type: String, // e.g., "22K", "92.5 Sterling"
    trim: true,
  },
  sizes: {
    type: [String], // e.g., ["16 inch", "18 inch"] or ring sizes
    default: [],
  },
  images: {
    type: [productImageSchema],
    validate: {
      validator: function (v) {
        return v.length <= 10;
      },
      message: 'A product can have a maximum of 10 images',
    },
  },
  tags: {
    type: [String],
    default: [],
  },
  occasion: {
    type: [String], // e.g., ["wedding", "engagement", "daily-wear", "festive"]
    default: [],
  },
  stockStatus: {
    type: String,
    enum: ['in-stock', 'made-to-order', 'out-of-stock'],
    default: 'in-stock',
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  isNewArrival: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true, // false = draft/hidden
  },
  whatsappClicks: {
    type: Number,
    default: 0,
  },
  viewCount: {
    type: Number,
    default: 0,
  },
  seoTitle: {
    type: String,
    trim: true,
    maxlength: [70, 'SEO title cannot exceed 70 characters'],
  },
  seoDescription: {
    type: String,
    trim: true,
    maxlength: [160, 'SEO description cannot exceed 160 characters'],
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Indexes for search and filtering
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ material: 1 });
productSchema.index({ price: 1 });
productSchema.index({ isFeatured: 1 });
productSchema.index({ isNewArrival: 1 });
productSchema.index({ isActive: 1 });
productSchema.index({ createdAt: -1 });

// Generate slug before saving
productSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true }) + '-' + Date.now().toString(36);
  }
  next();
});

// Virtual: primary image (first image)
productSchema.virtual('primaryImage').get(function () {
  if (this.images && this.images.length > 0) {
    const sorted = [...this.images].sort((a, b) => a.order - b.order);
    return sorted[0].url;
  }
  return null;
});

// Virtual: formatted price
productSchema.virtual('displayPrice').get(function () {
  if (this.priceOnRequest || this.price === null) {
    return 'Price on Request';
  }
  return `₹${this.price.toLocaleString('en-IN')}`;
});

module.exports = mongoose.model('Product', productSchema);
