const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  bulkAction,
  trackClick,
  getStats,
} = require('../controllers/product.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');
const { createProductValidator, updateProductValidator, mongoIdValidator } = require('../middleware/validators');
const { upload } = require('../utils/upload');

// Public routes
router.get('/', getProducts);
router.get('/stats', protect, adminOnly, getStats); // Must be before /:id
router.get('/:id', getProduct);
router.post('/:id/click', trackClick);

// Admin routes
router.post('/', protect, adminOnly, upload.array('images', 10), createProductValidator, createProduct);
router.put('/:id', protect, adminOnly, upload.array('images', 10), updateProductValidator, updateProduct);
router.delete('/:id', protect, adminOnly, mongoIdValidator, deleteProduct);
router.post('/bulk', protect, adminOnly, bulkAction);

module.exports = router;
