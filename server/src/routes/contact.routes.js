const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const {
  submitContact,
  getContacts,
  markAsRead,
  archiveContact,
} = require('../controllers/contact.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');
const { contactValidator, mongoIdValidator } = require('../middleware/validators');

// Rate limit contact form submissions
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: {
    success: false,
    message: 'Too many messages sent. Please try again later.',
  },
});

// Public route
router.post('/', contactLimiter, contactValidator, submitContact);

// Admin routes
router.get('/', protect, adminOnly, getContacts);
router.put('/:id/read', protect, adminOnly, markAsRead);
router.delete('/:id', protect, adminOnly, mongoIdValidator, archiveContact);

module.exports = router;
