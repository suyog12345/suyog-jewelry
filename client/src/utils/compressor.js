/**
 * Client-side image compression utility using HTML5 Canvas.
 * Compresses images before uploading to reduce upload time and bandwidth,
 * especially useful for mobile uploads where camera photos are 5-15MB.
 *
 * @param {File} file - Original file from input
 * @param {Object} options - Compression options
 * @returns {Promise<File>} Compressed File object
 */
export const compressImage = async (file, options = {}) => {
  const {
    maxWidth = 1920,
    maxHeight = 1920,
    quality = 0.82,
    mimeType = 'image/jpeg',
  } = options;

  // Don't compress non-image files or SVG
  if (!file.type.startsWith('image/') || file.type === 'image/svg+xml') {
    return file;
  }

  // If file is already smaller than 350KB, no need to compress
  if (file.size < 350 * 1024) {
    return file;
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;

      img.onload = () => {
        let { width, height } = img;

        // Calculate aspect-ratio preserved dimensions
        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return resolve(file); // Fallback to original
        }

        // Draw image onto canvas
        ctx.drawImage(img, 0, 0, width, height);

        // Convert canvas to Blob
        canvas.toBlob(
          (blob) => {
            if (!blob || blob.size >= file.size) {
              // If compressed blob is somehow larger or null, return original file
              return resolve(file);
            }

            const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, '.jpg'), {
              type: mimeType,
              lastModified: Date.now(),
            });

            resolve(compressedFile);
          },
          mimeType,
          quality
        );
      };

      img.onerror = () => {
        resolve(file); // Fallback to original on error
      };
    };

    reader.onerror = () => {
      resolve(file); // Fallback to original on error
    };
  });
};

/**
 * Batch compress an array of files.
 */
export const compressMultipleImages = async (files, options = {}) => {
  return Promise.all(files.map((file) => compressImage(file, options)));
};
