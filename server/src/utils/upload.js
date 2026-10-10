const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

/**
 * Multer configuration - store in memory for Cloudinary upload
 */
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, PNG, WebP, and GIF images are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB per file
    files: 10,
  },
});

/**
 * Upload a single buffer to Cloudinary
 * @param {Buffer} buffer - Image file buffer
 * @param {string} folder - Cloudinary folder path
 * @param {object} options - Additional Cloudinary options
 * @returns {Promise<{url: string, publicId: string}>}
 */
const uploadToCloudinary = (buffer, folder = 'suyog-jewelry/products', options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        transformation: [
          { width: 1200, height: 1200, crop: 'limit', quality: 'auto:good', fetch_format: 'auto' },
        ],
        ...options,
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
          });
        }
      }
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

/**
 * Upload multiple files to Cloudinary
 * @param {Array} files - Array of multer file objects
 * @param {string} folder - Cloudinary folder path
 * @returns {Promise<Array<{url: string, publicId: string}>>}
 */
const uploadMultipleToCloudinary = async (files, folder = 'suyog-jewelry/products') => {
  const uploadPromises = files.map((file, index) =>
    uploadToCloudinary(file.buffer, folder).then((result) => ({
      ...result,
      alt: file.originalname.replace(/\.[^/.]+$/, ''), // filename without extension as alt
      order: index,
    }))
  );
  return Promise.all(uploadPromises);
};

/**
 * Delete an image from Cloudinary
 * @param {string} publicId - Cloudinary public ID
 * @returns {Promise}
 */
const deleteFromCloudinary = async (publicId) => {
  try {
    if (publicId) {
      await cloudinary.uploader.destroy(publicId);
    }
  } catch (error) {
    console.error(`Failed to delete image from Cloudinary: ${publicId}`, error.message);
  }
};

/**
 * Delete multiple images from Cloudinary
 * @param {Array<string>} publicIds - Array of Cloudinary public IDs
 * @returns {Promise}
 */
const deleteMultipleFromCloudinary = async (publicIds) => {
  const validIds = publicIds.filter(Boolean);
  if (validIds.length > 0) {
    try {
      await cloudinary.api.delete_resources(validIds);
    } catch (error) {
      console.error('Failed to delete images from Cloudinary:', error.message);
    }
  }
};

module.exports = {
  upload,
  uploadToCloudinary,
  uploadMultipleToCloudinary,
  deleteFromCloudinary,
  deleteMultipleFromCloudinary,
};
