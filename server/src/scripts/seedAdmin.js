/**
 * Seed Admin User
 * 
 * Run: npm run seed:admin
 * Creates the admin user using credentials from .env
 */

const dotenv = require('dotenv');
const path = require('path');
const dns = require('dns');

// Override default system DNS to Google Public DNS to fix querySrv ECONNREFUSED on Windows/ISPs
dns.setServers(['8.8.8.8', '8.8.4.4']);

dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

const mongoose = require('mongoose');
const User = require('../models/User');

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: process.env.ADMIN_EMAIL });
    if (existingAdmin) {
      console.log(`⚠️  Admin user already exists: ${existingAdmin.email}`);
      process.exit(0);
    }

    const admin = await User.create({
      name: 'Suyog Admin',
      email: process.env.ADMIN_EMAIL || 'admin@suyogjewelry.com',
      password: process.env.ADMIN_PASSWORD || 'Admin@123456',
      role: 'admin',
    });

    console.log(`✅ Admin user created successfully!`);
    console.log(`   Email: ${admin.email}`);
    console.log(`   Role: ${admin.role}`);
    console.log(`\n⚠️  Change the password after first login!`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed admin error:', error.message);
    process.exit(1);
  }
};

seedAdmin();
