/**
 * Seed Admin User
 * 
 * Run: npm run seed:admin
 * Creates the admin user strictly using credentials from .env
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
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.error('❌ Error: ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log(`⚠️  Admin user already exists: ${existingAdmin.email}`);
      process.exit(0);
    }

    const admin = await User.create({
      name: 'Suyog Admin',
      email: adminEmail,
      password: adminPassword,
      role: 'admin',
    });

    console.log(`✅ Admin user created successfully!`);
    console.log(`   Email: ${admin.email}`);
    console.log(`   Role: ${admin.role}`);
    console.log(`\n⚠️  Keep credentials secure and change passwords regularly.`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed admin error:', error.message);
    process.exit(1);
  }
};

seedAdmin();
