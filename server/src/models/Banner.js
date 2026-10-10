const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters'],
  },
  subtitle: {
    type: String,
    trim: true,
    maxlength: [200, 'Subtitle cannot exceed 200 characters'],
  },
  image: {
    url: { type: String, required: [true, 'Banner image is required'] },
    publicId: { type: String, required: true },
  },
  link: {
    type: String,
    trim: true,
  },
  buttonText: {
    type: String,
    trim: true,
    default: 'Explore Collection',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  displayOrder: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

bannerSchema.index({ isActive: 1, displayOrder: 1 });

module.exports = mongoose.model('Banner', bannerSchema);
