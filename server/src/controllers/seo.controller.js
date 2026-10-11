const Product = require('../models/Product');
const Category = require('../models/Category');

/**
 * Generate XML sitemap
 * @route GET /sitemap.xml
 */
const getSitemap = async (req, res) => {
  try {
    const siteUrl = (process.env.CLIENT_URL || 'https://www.suyogjewelry.com').split(',')[0].trim().replace(/\/$/, '');

    const [products, categories] = await Promise.all([
      Product.find({ isActive: true }).select('slug updatedAt images name').lean(),
      Category.find({ isActive: true }).select('slug _id updatedAt name').lean(),
    ]);

    const staticRoutes = [
      { path: '/', changefreq: 'daily', priority: '1.0' },
      { path: '/products', changefreq: 'daily', priority: '0.9' },
      { path: '/about', changefreq: 'monthly', priority: '0.7' },
      { path: '/contact', changefreq: 'monthly', priority: '0.7' },
      { path: '/faq', changefreq: 'monthly', priority: '0.6' },
      { path: '/return-policy', changefreq: 'yearly', priority: '0.5' },
      { path: '/jewelry-care', changefreq: 'yearly', priority: '0.5' },
      { path: '/privacy-policy', changefreq: 'yearly', priority: '0.3' },
      { path: '/terms', changefreq: 'yearly', priority: '0.3' },
    ];

    const now = new Date().toISOString().split('T')[0];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n`;

    // Static pages
    for (const route of staticRoutes) {
      xml += `  <url>\n`;
      xml += `    <loc>${siteUrl}${route.path}</loc>\n`;
      xml += `    <lastmod>${now}</lastmod>\n`;
      xml += `    <changefreq>${route.changefreq}</changefreq>\n`;
      xml += `    <priority>${route.priority}</priority>\n`;
      xml += `  </url>\n`;
    }

    // Categories
    for (const cat of categories) {
      const catDate = cat.updatedAt ? new Date(cat.updatedAt).toISOString().split('T')[0] : now;
      xml += `  <url>\n`;
      xml += `    <loc>${siteUrl}/products?category=${cat._id}</loc>\n`;
      xml += `    <lastmod>${catDate}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.8</priority>\n`;
      xml += `  </url>\n`;
    }

    // Active Products
    for (const prod of products) {
      const prodSlug = prod.slug || prod._id;
      const prodDate = prod.updatedAt ? new Date(prod.updatedAt).toISOString().split('T')[0] : now;
      xml += `  <url>\n`;
      xml += `    <loc>${siteUrl}/products/${prodSlug}</loc>\n`;
      xml += `    <lastmod>${prodDate}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.8</priority>\n`;

      if (prod.images && prod.images.length > 0 && prod.images[0].url) {
        xml += `    <image:image>\n`;
        xml += `      <image:loc>${prod.images[0].url.replace(/&/g, '&amp;')}</image:loc>\n`;
        xml += `      <image:title>${(prod.name || 'Suyog Jewelry').replace(/[<>&'"]/g, '')}</image:title>\n`;
        xml += `    </image:image>\n`;
      }

      xml += `  </url>\n`;
    }

    xml += `</urlset>`;

    res.header('Content-Type', 'application/xml');
    res.header('Cache-Control', 'public, max-age=86400');
    return res.status(200).send(xml);
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return res.status(500).send('Error generating sitemap');
  }
};

/**
 * Serve robots.txt
 * @route GET /robots.txt
 */
const getRobots = (req, res) => {
  const siteUrl = (process.env.CLIENT_URL || 'https://www.suyogjewelry.com').split(',')[0].trim().replace(/\/$/, '');

  const content = [
    'User-agent: *',
    'Allow: /',
    'Disallow: /admin',
    'Disallow: /admin/*',
    'Disallow: /api/',
    '',
    `Sitemap: ${siteUrl}/sitemap.xml`,
  ].join('\n');

  res.header('Content-Type', 'text/plain');
  res.header('Cache-Control', 'public, max-age=86400');
  return res.status(200).send(content);
};

module.exports = {
  getSitemap,
  getRobots,
};
