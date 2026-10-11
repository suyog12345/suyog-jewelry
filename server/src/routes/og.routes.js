const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

/**
 * OG Meta Tag Route for Social & Messenger Link Previews
 * 
 * When WhatsApp, Facebook, Twitter, Telegram, etc. request /products/:id,
 * this route serves full HTML with Open Graph and Twitter Card tags.
 * Normal browsers are redirected to the frontend SPA.
 * Crawlers are NEVER redirected.
 */

const CRAWLER_USER_AGENTS = [
  'whatsapp',
  'facebookexternalhit',
  'twitterbot',
  'linkedinbot',
  'telegrambot',
  'slackbot',
  'googlebot',
  'bingbot',
  'discordbot',
  'pinterest',
  'applebot',
];

const isCrawler = (userAgent) => {
  if (!userAgent) return false;
  const ua = userAgent.toLowerCase();
  return CRAWLER_USER_AGENTS.some((bot) => ua.includes(bot));
};

/**
 * Helper to escape HTML characters in meta attributes and body text
 * Prevents attribute breakout if a product name has quotes, ampersands, etc.
 */
const escapeHtml = (str) => {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
};

router.get('/:id', async (req, res, next) => {
  const userAgent = req.get('User-Agent') || '';
  const siteUrl = (process.env.SITE_URL || process.env.CLIENT_URL || 'https://www.suyogjewelry.com')
    .split(',')[0]
    .trim()
    .replace(/\/$/, '');

  // Normal browsers are redirected (302) to the SPA storefront
  if (!isCrawler(userAgent)) {
    return res.redirect(302, `${siteUrl}/products/${encodeURIComponent(req.params.id)}`);
  }

  // Crawlers receive static HTML with Open Graph meta tags (no redirect)
  try {
    const { id } = req.params;
    let product;

    // Look up by ObjectId if valid 24-hex string, otherwise by slug
    if (id && id.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(id).populate('category', 'name');
    }
    if (!product && id) {
      product = await Product.findOne({ slug: id }).populate('category', 'name');
    }

    if (!product) {
      res.set('Content-Type', 'text/html; charset=utf-8');
      return res.status(404).send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Product Not Found - Suyog Jewelry</title>
  <meta name="robots" content="noindex">
</head>
<body>
  <h1>404 - Product Not Found</h1>
  <p>The requested jewelry piece could not be found.</p>
</body>
</html>`);
    }

    const productSlug = product.slug || product._id;
    const productUrl = `${siteUrl}/products/${productSlug}`;
    const rawTitle = product.seoTitle || `${product.name} - Suyog Jewelry`;
    const priceText = product.priceOnRequest
      ? 'Price on Request'
      : product.price
      ? `₹${Number(product.price).toLocaleString('en-IN')}`
      : '';
    const rawDescription =
      product.seoDescription ||
      product.description ||
      `Exquisite handcrafted ${product.name} from Suyog Jewelry. ${priceText}. Enquire now on WhatsApp!`;

    // Ensure image is an absolute HTTPS URL
    let rawImage =
      product.primaryImage ||
      (product.images && product.images.length > 0 && product.images[0].url) ||
      '/og-default.jpg';

    // If relative path, prepend siteUrl
    if (!/^https?:\/\//i.test(rawImage)) {
      rawImage = `${siteUrl}/${rawImage.replace(/^\//, '')}`;
    }

    // Force HTTPS for image URLs (WhatsApp / Facebook requirement for rich cards)
    // Keep http://localhost during local dev if siteUrl is localhost
    if (!siteUrl.includes('localhost')) {
      rawImage = rawImage.replace(/^http:\/\//i, 'https://');
    }

    const title = escapeHtml(rawTitle);
    const description = escapeHtml(rawDescription);
    const image = escapeHtml(rawImage);
    const escapedUrl = escapeHtml(productUrl);
    const productName = escapeHtml(product.name);
    const categoryName = escapeHtml(product.category?.name || 'Jewelry');
    const priceAmount = escapeHtml(product.price || '');
    const availability = product.stockStatus === 'in-stock' ? 'in stock' : 'preorder';

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <meta name="description" content="${description}">
  
  <!-- Open Graph / WhatsApp / Facebook -->
  <meta property="og:type" content="product">
  <meta property="og:url" content="${escapedUrl}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${image}">
  <meta property="og:image:secure_url" content="${image}">
  <meta property="og:image:alt" content="${productName}">
  <meta property="og:image:type" content="image/jpeg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="1200">
  <meta property="og:site_name" content="Suyog Jewelry">
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${image}">
  <meta name="twitter:image:alt" content="${productName}">
  
  <!-- Product Details -->
  <meta property="product:price:amount" content="${priceAmount}">
  <meta property="product:price:currency" content="INR">
  <meta property="product:availability" content="${availability}">
  <meta property="product:category" content="${categoryName}">
</head>
<body>
  <h1>${productName}</h1>
  <img src="${image}" alt="${productName}">
  <p>${description}</p>
  <p>${escapeHtml(priceText)}</p>
</body>
</html>`;

    res.set('Content-Type', 'text/html; charset=utf-8');
    res.set('Cache-Control', 'public, max-age=3600');
    return res.status(200).send(html);
  } catch (error) {
    console.error('OG preview generation error:', error);
    return res.status(500).send('Error generating preview');
  }
});

module.exports = router;
