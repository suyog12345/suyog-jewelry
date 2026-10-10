const dotenv = require('dotenv');
const path = require('path');
const dns = require('dns');

// Override default system DNS to Google Public DNS to fix querySrv ECONNREFUSED on Windows/ISPs
dns.setServers(['8.8.8.8', '8.8.4.4']);

// Load environment variables FIRST
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');
const categoryRoutes = require('./routes/category.routes');
const contactRoutes = require('./routes/contact.routes');
const bannerRoutes = require('./routes/banner.routes');
const ogRoutes = require('./routes/og.routes');
const { errorHandler, notFound } = require('./middleware/error.middleware');

const app = express();

// --------------- Security Middleware ---------------

// Helmet for secure HTTP headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// CORS
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Rate limiting - general
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  message: { success: false, message: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', generalLimiter);

// --------------- Body Parsing ---------------
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Sanitize data against NoSQL injection
app.use(mongoSanitize());

// --------------- Routes ---------------

// OG meta routes (for WhatsApp link previews) — must be before SPA catch-all
app.use('/products', ogRoutes);

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/banners', bannerRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Suyog Jewelry API is running', timestamp: new Date() });
});

// --------------- Error Handling ---------------
app.use(notFound);
app.use(errorHandler);

// --------------- Database & Server Start ---------------
const PORT = process.env.PORT || 5000;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
});

module.exports = app;
