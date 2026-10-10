const { body, param, query } = require('express-validator');

/**
 * Validation result handler - use after validation chains
 */
const { validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

// --------------- Auth Validators ---------------

const loginValidator = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  validate,
];

// --------------- Product Validators ---------------

const createProductValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Product name is required')
    .isLength({ max: 200 })
    .withMessage('Name cannot exceed 200 characters'),
  body('category')
    .notEmpty()
    .withMessage('Category is required')
    .isMongoId()
    .withMessage('Invalid category ID'),
  body('material')
    .notEmpty()
    .withMessage('Material is required')
    .isIn(['gold', 'silver', 'diamond', 'platinum', 'artificial', 'imitation', 'kundan', 'polki', 'meenakari', 'other'])
    .withMessage('Invalid material type'),
  body('price')
    .optional({ nullable: true })
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Description cannot exceed 2000 characters'),
  body('weight')
    .optional()
    .trim(),
  body('purity')
    .optional()
    .trim(),
  body('stockStatus')
    .optional()
    .isIn(['in-stock', 'made-to-order', 'out-of-stock'])
    .withMessage('Invalid stock status'),
  body('isFeatured')
    .optional()
    .isBoolean()
    .withMessage('isFeatured must be a boolean'),
  body('isNewArrival')
    .optional()
    .isBoolean()
    .withMessage('isNewArrival must be a boolean'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean'),
  validate,
];

const updateProductValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid product ID'),
  body('name')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Name cannot exceed 200 characters'),
  body('category')
    .optional()
    .isMongoId()
    .withMessage('Invalid category ID'),
  body('material')
    .optional()
    .isIn(['gold', 'silver', 'diamond', 'platinum', 'artificial', 'imitation', 'kundan', 'polki', 'meenakari', 'other'])
    .withMessage('Invalid material type'),
  body('price')
    .optional({ nullable: true })
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  validate,
];

// --------------- Category Validators ---------------

const createCategoryValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Category name is required')
    .isLength({ max: 100 })
    .withMessage('Name cannot exceed 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  validate,
];

// --------------- Contact Validators ---------------

const contactValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 100 })
    .withMessage('Name cannot exceed 100 characters'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('phone')
    .optional()
    .trim()
    .isLength({ max: 15 })
    .withMessage('Phone number cannot exceed 15 digits'),
  body('message')
    .trim()
    .notEmpty()
    .withMessage('Message is required')
    .isLength({ max: 2000 })
    .withMessage('Message cannot exceed 2000 characters'),
  body('type')
    .optional()
    .isIn(['general', 'custom-order', 'enquiry', 'complaint', 'other'])
    .withMessage('Invalid message type'),
  validate,
];

// --------------- Param Validators ---------------

const mongoIdValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid ID format'),
  validate,
];

module.exports = {
  loginValidator,
  createProductValidator,
  updateProductValidator,
  createCategoryValidator,
  contactValidator,
  mongoIdValidator,
};
