/**
 * Seed Script - Categories & Products
 * 
 * Run: npm run seed
 * Creates 5 categories and 12 sample products with placeholder images
 */

const dotenv = require('dotenv');
const path = require('path');
const dns = require('dns');

// Override default system DNS to Google Public DNS to fix querySrv ECONNREFUSED on Windows/ISPs
dns.setServers(['8.8.8.8', '8.8.4.4']);

dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

const mongoose = require('mongoose');
const Category = require('../models/Category');
const Product = require('../models/Product');
const User = require('../models/User');

// Placeholder images from picsum (reliable placeholder service)
const placeholderImg = (seed, w = 800, h = 800) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;

const categories = [
  {
    name: 'Necklaces',
    description: 'Elegant necklaces crafted with precision, from delicate chains to statement pendants.',
    image: { url: placeholderImg('necklace-cat', 600, 400), publicId: 'seed/necklace-cat' },
    displayOrder: 1,
  },
  {
    name: 'Earrings',
    description: 'Beautiful earrings for every occasion – studs, jhumkas, hoops, and chandeliers.',
    image: { url: placeholderImg('earring-cat', 600, 400), publicId: 'seed/earring-cat' },
    displayOrder: 2,
  },
  {
    name: 'Rings',
    description: 'Stunning rings from engagement bands to cocktail rings, crafted to perfection.',
    image: { url: placeholderImg('ring-cat', 600, 400), publicId: 'seed/ring-cat' },
    displayOrder: 3,
  },
  {
    name: 'Bangles & Bracelets',
    description: 'Traditional bangles and modern bracelets in gold, silver, and kundan designs.',
    image: { url: placeholderImg('bangle-cat', 600, 400), publicId: 'seed/bangle-cat' },
    displayOrder: 4,
  },
  {
    name: 'Bridal Sets',
    description: 'Complete bridal jewelry sets designed to make your special day unforgettable.',
    image: { url: placeholderImg('bridal-cat', 600, 400), publicId: 'seed/bridal-cat' },
    displayOrder: 5,
  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Seed admin if not exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (!existingAdmin) {
      if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
        console.warn('⚠️  ADMIN_EMAIL or ADMIN_PASSWORD not set in .env. Skipping admin creation in seed.');
      } else {
        await User.create({
          name: 'Suyog Admin',
          email: process.env.ADMIN_EMAIL,
          password: process.env.ADMIN_PASSWORD,
          role: 'admin',
        });
        console.log('✅ Admin user created');
      }
    }

    // Clear existing data
    await Category.deleteMany({});
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing categories & products');

    // Generate slugs for categories since insertMany bypasses save middleware
    const slugify = require('slugify');
    const categoriesWithSlugs = categories.map((c) => ({
      ...c,
      slug: slugify(c.name, { lower: true, strict: true }),
    }));

    // Seed categories
    const createdCategories = await Category.insertMany(categoriesWithSlugs);
    console.log(`✅ Created ${createdCategories.length} categories`);

    const catMap = {};
    createdCategories.forEach((c) => {
      catMap[c.name] = c._id;
    });

    // Seed products
    const products = [
      {
        name: 'Royal Kundan Necklace Set',
        description: 'A magnificent kundan necklace set featuring intricate hand-set stones in 22K gold. This timeless piece includes a matching pair of earrings. Perfect for weddings and grand celebrations.',
        price: 185000,
        priceOnRequest: false,
        category: catMap['Necklaces'],
        material: 'kundan',
        weight: '45g',
        purity: '22K Gold',
        sizes: ['16 inch', '18 inch', '20 inch'],
        images: [
          { url: placeholderImg('kundan-necklace-1'), publicId: 'seed/kundan-necklace-1', alt: 'Royal Kundan Necklace Front View', order: 0 },
          { url: placeholderImg('kundan-necklace-2'), publicId: 'seed/kundan-necklace-2', alt: 'Royal Kundan Necklace Side View', order: 1 },
        ],
        tags: ['kundan', 'wedding', 'bridal', 'traditional'],
        occasion: ['wedding', 'festive'],
        stockStatus: 'made-to-order',
        isFeatured: true,
        isNewArrival: false,
        isActive: true,
      },
      {
        name: 'Diamond Solitaire Pendant',
        description: 'A stunning solitaire diamond pendant set in 18K white gold. The brilliant-cut diamond catches light from every angle, making it a perfect everyday luxury piece.',
        price: 95000,
        priceOnRequest: false,
        category: catMap['Necklaces'],
        material: 'diamond',
        weight: '8g',
        purity: '18K White Gold',
        sizes: ['16 inch', '18 inch'],
        images: [
          { url: placeholderImg('diamond-pendant-1'), publicId: 'seed/diamond-pendant-1', alt: 'Diamond Solitaire Pendant', order: 0 },
        ],
        tags: ['diamond', 'solitaire', 'elegant', 'daily-wear'],
        occasion: ['daily-wear', 'engagement'],
        stockStatus: 'in-stock',
        isFeatured: true,
        isNewArrival: true,
        isActive: true,
      },
      {
        name: 'Traditional Gold Jhumka Earrings',
        description: 'Handcrafted traditional jhumka earrings in 22K gold with intricate filigree work and small hanging bells. A staple piece for Indian ethnic wear.',
        price: 42000,
        priceOnRequest: false,
        category: catMap['Earrings'],
        material: 'gold',
        weight: '18g',
        purity: '22K Gold',
        images: [
          { url: placeholderImg('gold-jhumka-1'), publicId: 'seed/gold-jhumka-1', alt: 'Gold Jhumka Earrings', order: 0 },
          { url: placeholderImg('gold-jhumka-2'), publicId: 'seed/gold-jhumka-2', alt: 'Gold Jhumka Earrings Detail', order: 1 },
        ],
        tags: ['jhumka', 'traditional', 'ethnic', 'gold'],
        occasion: ['festive', 'wedding', 'daily-wear'],
        stockStatus: 'in-stock',
        isFeatured: true,
        isNewArrival: false,
        isActive: true,
      },
      {
        name: 'Polki Diamond Chandbali',
        description: 'Exquisite polki diamond chandbali earrings with meenakari work on the reverse side. Handcrafted by master artisans using traditional techniques.',
        price: null,
        priceOnRequest: true,
        category: catMap['Earrings'],
        material: 'polki',
        weight: '22g',
        purity: '22K Gold + Polki',
        images: [
          { url: placeholderImg('polki-chandbali-1'), publicId: 'seed/polki-chandbali-1', alt: 'Polki Diamond Chandbali', order: 0 },
        ],
        tags: ['polki', 'chandbali', 'bridal', 'meenakari'],
        occasion: ['wedding'],
        stockStatus: 'made-to-order',
        isFeatured: false,
        isNewArrival: true,
        isActive: true,
      },
      {
        name: 'Platinum Engagement Ring',
        description: 'A classic platinum engagement ring with a center round-cut diamond of 0.5 carats, surrounded by a halo of smaller diamonds. Symbolizing eternal love.',
        price: 125000,
        priceOnRequest: false,
        category: catMap['Rings'],
        material: 'platinum',
        weight: '6g',
        purity: '950 Platinum',
        sizes: ['6', '7', '8', '9', '10', '11', '12'],
        images: [
          { url: placeholderImg('platinum-ring-1'), publicId: 'seed/platinum-ring-1', alt: 'Platinum Engagement Ring', order: 0 },
          { url: placeholderImg('platinum-ring-2'), publicId: 'seed/platinum-ring-2', alt: 'Platinum Ring Side View', order: 1 },
        ],
        tags: ['engagement', 'platinum', 'diamond', 'halo'],
        occasion: ['engagement'],
        stockStatus: 'in-stock',
        isFeatured: true,
        isNewArrival: true,
        isActive: true,
      },
      {
        name: 'Gold Cocktail Ring with Ruby',
        description: 'A bold and glamorous cocktail ring featuring a genuine ruby center stone set in 18K yellow gold with diamond accents. Statement piece for evening events.',
        price: 68000,
        priceOnRequest: false,
        category: catMap['Rings'],
        material: 'gold',
        weight: '12g',
        purity: '18K Gold',
        sizes: ['7', '8', '9', '10'],
        images: [
          { url: placeholderImg('ruby-ring-1'), publicId: 'seed/ruby-ring-1', alt: 'Gold Ruby Cocktail Ring', order: 0 },
        ],
        tags: ['cocktail', 'ruby', 'gold', 'statement'],
        occasion: ['party', 'festive'],
        stockStatus: 'in-stock',
        isFeatured: false,
        isNewArrival: false,
        isActive: true,
      },
      {
        name: 'Gold Bangle Set (Set of 4)',
        description: 'A set of four 22K gold bangles with intricate laser-cut patterns. Lightweight yet sturdy, perfect for daily wear or special occasions.',
        price: 156000,
        priceOnRequest: false,
        category: catMap['Bangles & Bracelets'],
        material: 'gold',
        weight: '40g (total)',
        purity: '22K Gold',
        sizes: ['2.4', '2.6', '2.8'],
        images: [
          { url: placeholderImg('gold-bangle-set-1'), publicId: 'seed/gold-bangle-set-1', alt: 'Gold Bangle Set', order: 0 },
          { url: placeholderImg('gold-bangle-set-2'), publicId: 'seed/gold-bangle-set-2', alt: 'Gold Bangle Set Detail', order: 1 },
        ],
        tags: ['bangle', 'gold', 'set', 'laser-cut'],
        occasion: ['daily-wear', 'festive'],
        stockStatus: 'in-stock',
        isFeatured: true,
        isNewArrival: false,
        isActive: true,
      },
      {
        name: 'Silver Charm Bracelet',
        description: 'A delicate 92.5 sterling silver charm bracelet with heart, star, and moon charms. Adjustable chain length. An affordable luxury for everyday elegance.',
        price: 3500,
        priceOnRequest: false,
        category: catMap['Bangles & Bracelets'],
        material: 'silver',
        weight: '15g',
        purity: '92.5 Sterling Silver',
        sizes: ['Adjustable'],
        images: [
          { url: placeholderImg('silver-bracelet-1'), publicId: 'seed/silver-bracelet-1', alt: 'Silver Charm Bracelet', order: 0 },
        ],
        tags: ['silver', 'charm', 'bracelet', 'daily-wear'],
        occasion: ['daily-wear'],
        stockStatus: 'in-stock',
        isFeatured: false,
        isNewArrival: true,
        isActive: true,
      },
      {
        name: 'Complete Bridal Kundan Set',
        description: 'A complete bridal set featuring a kundan necklace, matching earrings, maang tikka, and haath phool. Handcrafted with meenakari work on the reverse. A complete bridal look in one set.',
        price: null,
        priceOnRequest: true,
        category: catMap['Bridal Sets'],
        material: 'kundan',
        weight: '120g (approx)',
        purity: '22K Gold + Kundan',
        images: [
          { url: placeholderImg('bridal-kundan-set-1'), publicId: 'seed/bridal-kundan-set-1', alt: 'Complete Bridal Kundan Set', order: 0 },
          { url: placeholderImg('bridal-kundan-set-2'), publicId: 'seed/bridal-kundan-set-2', alt: 'Bridal Set Earrings Detail', order: 1 },
          { url: placeholderImg('bridal-kundan-set-3'), publicId: 'seed/bridal-kundan-set-3', alt: 'Bridal Set Maang Tikka', order: 2 },
        ],
        tags: ['bridal', 'kundan', 'complete-set', 'wedding', 'meenakari'],
        occasion: ['wedding'],
        stockStatus: 'made-to-order',
        isFeatured: true,
        isNewArrival: true,
        isActive: true,
      },
      {
        name: 'Diamond Bridal Choker Set',
        description: 'An opulent diamond choker set in 18K white gold, featuring a cascading design with matching earrings. For the modern bride who wants timeless elegance.',
        price: 450000,
        priceOnRequest: false,
        category: catMap['Bridal Sets'],
        material: 'diamond',
        weight: '65g',
        purity: '18K White Gold',
        sizes: ['14 inch', '16 inch'],
        images: [
          { url: placeholderImg('diamond-bridal-1'), publicId: 'seed/diamond-bridal-1', alt: 'Diamond Bridal Choker', order: 0 },
          { url: placeholderImg('diamond-bridal-2'), publicId: 'seed/diamond-bridal-2', alt: 'Diamond Bridal Earrings', order: 1 },
        ],
        tags: ['diamond', 'bridal', 'choker', 'white-gold'],
        occasion: ['wedding', 'engagement'],
        stockStatus: 'made-to-order',
        isFeatured: false,
        isNewArrival: false,
        isActive: true,
      },
      {
        name: 'Imitation Kundan Necklace',
        description: 'A beautifully crafted imitation kundan necklace with matching earrings. High-quality CZ stones that look just like the real thing. Perfect for occasions where you want the look without the worry.',
        price: 2800,
        priceOnRequest: false,
        category: catMap['Necklaces'],
        material: 'imitation',
        weight: '85g',
        purity: 'Gold-plated Brass',
        sizes: ['18 inch'],
        images: [
          { url: placeholderImg('imitation-kundan-1'), publicId: 'seed/imitation-kundan-1', alt: 'Imitation Kundan Necklace', order: 0 },
        ],
        tags: ['imitation', 'kundan', 'affordable', 'fashion'],
        occasion: ['festive', 'party'],
        stockStatus: 'in-stock',
        isFeatured: false,
        isNewArrival: true,
        isActive: true,
      },
      {
        name: 'Meenakari Peacock Pendant',
        description: 'A vibrant meenakari peacock pendant in 22K gold with traditional Rajasthani enamel work in blue, green, and red. Comes with a matching gold chain. A wearable work of art.',
        price: 55000,
        priceOnRequest: false,
        category: catMap['Necklaces'],
        material: 'meenakari',
        weight: '20g',
        purity: '22K Gold',
        sizes: ['18 inch', '20 inch'],
        images: [
          { url: placeholderImg('meenakari-pendant-1'), publicId: 'seed/meenakari-pendant-1', alt: 'Meenakari Peacock Pendant', order: 0 },
          { url: placeholderImg('meenakari-pendant-2'), publicId: 'seed/meenakari-pendant-2', alt: 'Meenakari Pendant Back Detail', order: 1 },
        ],
        tags: ['meenakari', 'peacock', 'rajasthani', 'traditional', 'enamel'],
        occasion: ['festive', 'daily-wear'],
        stockStatus: 'in-stock',
        isFeatured: false,
        isNewArrival: false,
        isActive: true,
      },
    ];

    const productsWithSlugs = products.map((p, idx) => ({
      ...p,
      slug: `${slugify(p.name, { lower: true, strict: true })}-${Date.now().toString(36)}${idx}`,
    }));

    const createdProducts = await Product.insertMany(productsWithSlugs);
    console.log(`✅ Created ${createdProducts.length} products`);

    console.log('\n🎉 Seed completed successfully!');
    console.log('\nSummary:');
    console.log(`  Categories: ${createdCategories.length}`);
    console.log(`  Products: ${createdProducts.length}`);
    console.log(`  Featured: ${products.filter((p) => p.isFeatured).length}`);
    console.log(`  New Arrivals: ${products.filter((p) => p.isNewArrival).length}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    process.exit(1);
  }
};

seed();
