const dotenv = require('dotenv');
const path = require('path');
const dns = require('dns');

// Override default system DNS to Google Public DNS to fix querySrv ECONNREFUSED on Windows/ISPs
dns.setServers(['8.8.8.8', '8.8.4.4']);

// Load environment variables FIRST
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Refuse to start if JWT_SECRET is missing
if (!process.env.JWT_SECRET) {
  console.error('❌ FATAL: JWT_SECRET environment variable is missing. Server refusing to start.');
  process.exit(1);
}

// In production, print a console warning (do not block startup) if admin password looks weak
if (process.env.NODE_ENV === 'production') {
  const pwd = process.env.ADMIN_PASSWORD;
  if (!pwd || pwd.length < 8 || pwd.toLowerCase().includes('admin') || pwd.toLowerCase().includes('password') || pwd === '12345678') {
    console.warn('⚠️  SECURITY WARNING: ADMIN_PASSWORD appears weak or default in production! Ensure a strong password is used.');
  }
}

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
const seoRoutes = require('./routes/seo.routes');
const { errorHandler, notFound } = require('./middleware/error.middleware');

const app = express();

// --------------- Security Middleware ---------------

// Helmet for secure HTTP headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// CORS: allowed origins read from env (comma separated)
const rawOrigins = process.env.ALLOWED_ORIGINS || process.env.CLIENT_URL || 'http://localhost:5173';
const allowedOrigins = rawOrigins
  .split(',')
  .map((origin) => origin.trim().replace(/\/$/, ''))
  .filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    const normalized = origin.replace(/\/$/, '');
    if (allowedOrigins.includes(normalized) || allowedOrigins.includes('*')) {
      return callback(null, true);
    }
    if (process.env.NODE_ENV !== 'production' && normalized.includes('localhost')) {
      return callback(null, true);
    }
    return callback(new Error(`Origin ${origin} not allowed by CORS`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
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

// Sitemap and robots.txt
app.use('/', seoRoutes);

// OG meta routes (for WhatsApp / social link previews)
app.use('/products', ogRoutes);
app.use('/api/og', ogRoutes);

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api', seoRoutes);

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
