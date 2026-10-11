/**
 * Clear Dummy Seed Products
 * 
 * Run: npm run clear:dummy
 * Removes all placeholder/dummy seed products (e.g., products with seed/picsum images or test slugs)
 * before production launch, while keeping categories, banners, and admin users intact.
 */

const dotenv = require('dotenv');
const path = require('path');
const dns = require('dns');

// Override default system DNS to Google Public DNS
dns.setServers(['8.8.8.8', '8.8.4.4']);

dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

const mongoose = require('mongoose');
const Product = require('../models/Product');

const clearDummyProducts = async () => {
  if (!process.env.MONGODB_URI) {
    console.error('❌ MONGODB_URI not found in .env');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Query for dummy/seed products:
    // 1. Image URLs containing 'picsum.photos' or 'placeholder'
    // 2. Slugs ending with seed pattern '-mv25tk9'
    const query = {
      $or: [
        { 'images.url': { $regex: /picsum\.photos|placeholder/i } },
        { slug: { $regex: /-mv25tk9/i } },
        { tags: 'seed' },
      ],
    };

    const count = await Product.countDocuments(query);
    console.log(`🔍 Found ${count} dummy seed products.`);

    if (count === 0) {
      console.log('✨ No dummy products found in database.');
      process.exit(0);
    }

    const result = await Product.deleteMany(query);
    console.log(`🗑️  Successfully removed ${result.deletedCount} dummy seed products!`);
    console.log(`💎 Real products, categories, and admin accounts remain untouched.`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error clearing dummy products:', error.message);
    process.exit(1);
  }
};

clearDummyProducts();
