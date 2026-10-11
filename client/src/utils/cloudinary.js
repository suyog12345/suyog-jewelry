/**
 * Optimizes Cloudinary image URLs with automatic format (f_auto),
 * automatic quality (q_auto), and responsive width/height/crop parameters.
 * If the image is not on Cloudinary, returns the URL unchanged.
 *
 * @param {string} url - Image URL
 * @param {Object} [options] - Transformation options
 * @param {number} [options.width] - Desired width in pixels
 * @param {number} [options.height] - Desired height in pixels
 * @param {string} [options.crop='fill'] - Crop mode (e.g. 'fill', 'scale', 'limit')
 * @param {string} [options.quality='auto'] - Quality setting ('auto', 'good', 'eco')
 * @param {string} [options.format='auto'] - Format conversion ('auto', 'webp')
 * @returns {string} Optimized URL
 */
export const optimizeCloudinaryUrl = (url, options = {}) => {
  if (!url || typeof url !== 'string') return '/placeholder.jpg';
  if (!url.includes('cloudinary.com') || !url.includes('/upload/')) {
    return url;
  }

  const {
    width,
    height,
    crop = 'fill',
    quality = 'auto',
    format = 'auto',
  } = options;

  // Prevent double-transforming if already transformed
  if (url.includes('/upload/w_') || url.includes('/upload/f_auto') || url.includes('/upload/q_auto')) {
    return url;
  }

  const parts = [`f_${format}`, `q_${quality}`];
  if (width) parts.push(`w_${width}`);
  if (height) parts.push(`h_${height}`);
  if (crop && (width || height)) parts.push(`c_${crop}`);

  const transformString = parts.join(',');

  return url.replace('/upload/', `/upload/${transformString}/`);
};

export default optimizeCloudinaryUrl;
