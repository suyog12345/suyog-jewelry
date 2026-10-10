const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

/**
 * OG Meta Tag Route for WhatsApp Link Previews
 * 
 * When WhatsApp (or any crawler) fetches /products/:id, this middleware
 * detects crawlers and serves an HTML page with proper OG tags so the
 * product image, title, and description appear in the WhatsApp chat.
 * 
 * For regular browser requests, it falls through (handled by React SPA).
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
];

const isCrawler = (userAgent) => {
  if (!userAgent) return false;
  const ua = userAgent.toLowerCase();
  return CRAWLER_USER_AGENTS.some((bot) => ua.includes(bot));
};

router.get('/:id', async (req, res, next) => {
  const userAgent = req.get('User-Agent');

  // Only serve OG HTML to crawlers
  if (!isCrawler(userAgent)) {
    return next();
  }

  try {
    const { id } = req.params;
    let product;

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(id).populate('category', 'name');
    }
    if (!product) {
      product = await Product.findOne({ slug: id }).populate('category', 'name');
    }

    if (!product) {
      return next();
    }

    const siteUrl = process.env.CLIENT_URL || 'https://suyogjewelry.com';
    const productUrl = `${siteUrl}/products/${product.slug || product._id}`;
    const title = product.seoTitle || `${product.name} - Suyog Jewelry`;
    const description = product.seoDescription || product.description || `Beautiful ${product.name} from Suyog Jewelry. ${product.displayPrice}. Enquire now on WhatsApp!`;
    const image = product.primaryImage || `${siteUrl}/og-default.jpg`;

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <meta name="description" content="${description}">
  
  <!-- Open Graph / WhatsApp -->
  <meta property="og:type" content="product">
  <meta property="og:url" content="${productUrl}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${image}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="1200">
  <meta property="og:site_name" content="Suyog Jewelry">
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${image}">
  
  <!-- Product Schema -->
  <meta property="product:price:amount" content="${product.price || ''}">
  <meta property="product:price:currency" content="INR">
  <meta property="product:availability" content="${product.stockStatus === 'in-stock' ? 'in stock' : 'preorder'}">
  <meta property="product:category" content="${product.category?.name || 'Jewelry'}">
  
  <!-- Redirect browsers to the SPA -->
  <meta http-equiv="refresh" content="0;url=${productUrl}">
</head>
<body>
  <h1>${product.name}</h1>
  <img src="${image}" alt="${product.name}">
  <p>${description}</p>
  <p>Price: ${product.displayPrice}</p>
  <a href="${productUrl}">View Product</a>
</body>
</html>`;

    res.set('Content-Type', 'text/html');
    res.send(html);
  } catch (error) {
    console.error('OG route error:', error);
    next();
  }
});

module.exports = router;
