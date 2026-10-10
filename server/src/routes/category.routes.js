const express = require('express');
const router = express.Router();
const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/category.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');
const { createCategoryValidator, mongoIdValidator } = require('../middleware/validators');
const { upload } = require('../utils/upload');

// Public routes
router.get('/', getCategories);
router.get('/:id', getCategory);

// Admin routes
router.post('/', protect, adminOnly, upload.single('image'), createCategoryValidator, createCategory);
router.put('/:id', protect, adminOnly, upload.single('image'), updateCategory);
router.delete('/:id', protect, adminOnly, mongoIdValidator, deleteCategory);

module.exports = router;
