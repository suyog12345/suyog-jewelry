const express = require('express');
const router = express.Router();
const {
  getBanners,
  createBanner,
  updateBanner,
  deleteBanner,
} = require('../controllers/banner.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');
const { upload } = require('../utils/upload');

// Public route
router.get('/', getBanners);

// Admin routes
router.post('/', protect, adminOnly, upload.single('image'), createBanner);
router.put('/:id', protect, adminOnly, upload.single('image'), updateBanner);
router.delete('/:id', protect, adminOnly, deleteBanner);

module.exports = router;
