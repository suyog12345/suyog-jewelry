# Suyog Jewelry - Backend API

Production-ready REST API for Suyog Jewelry catalogue website.

## 🛠️ Tech Stack

- **Runtime**: Node.js + Express
- **Database**: MongoDB Atlas (Mongoose ODM)
- **Image Storage**: Cloudinary
- **Auth**: JWT (httpOnly cookies) + bcrypt
- **Security**: Helmet, CORS, rate limiting, mongo-sanitize, express-validator

## 📁 Project Structure

```
server/
├── src/
│   ├── config/
│   │   ├── cloudinary.js    # Cloudinary SDK config
│   │   └── db.js            # MongoDB connection
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── banner.controller.js
│   │   ├── category.controller.js
│   │   ├── contact.controller.js
│   │   └── product.controller.js
│   ├── middleware/
│   │   ├── auth.middleware.js     # JWT verify + admin guard
│   │   ├── error.middleware.js    # Centralized error handling
│   │   └── validators.js         # express-validator chains
│   ├── models/
│   │   ├── Banner.js
│   │   ├── Category.js
│   │   ├── Contact.js
│   │   ├── Product.js
│   │   └── User.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── banner.routes.js
│   │   ├── category.routes.js
│   │   ├── contact.routes.js
│   │   ├── og.routes.js         # OG meta tags for WhatsApp previews
│   │   └── product.routes.js
│   ├── scripts/
│   │   ├── seed.js              # Seed 5 categories + 12 products
│   │   └── seedAdmin.js         # Create admin user
│   ├── utils/
│   │   └── upload.js            # Cloudinary upload helpers
│   └── index.js                 # Express app entry point
├── .env.example
├── .gitignore
└── package.json
```

## 🚀 Setup Instructions

### 1. MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/) and create a free account
2. Create a new **Shared Cluster** (free tier M0)
3. Set up a **Database User** (username/password)
4. Go to **Network Access** → Add IP Address → Allow from Anywhere (`0.0.0.0/0`) for development
5. Go to **Database** → **Connect** → **Connect your application**
6. Copy the connection string: `mongodb+srv://<username>:<password>@<cluster>.mongodb.net/suyog-jewelry?retryWrites=true&w=majority`
7. Replace `<username>` and `<password>` with your database user credentials

### 2. Cloudinary Setup

1. Go to [Cloudinary](https://cloudinary.com/) and create a free account
2. After login, go to the **Dashboard**
3. Copy your:
   - **Cloud Name**
   - **API Key**
   - **API Secret**

### 3. Environment Variables

```bash
# Copy the example env file
cp .env.example .env
```

Edit `.env` and fill in your values:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://your-user:your-password@cluster0.xxxxx.mongodb.net/suyog-jewelry?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
ADMIN_EMAIL=admin@suyogjewelry.com
ADMIN_PASSWORD=your_strong_admin_password_here
CLIENT_URL=http://localhost:5173
ALLOWED_ORIGINS=http://localhost:5173
SITE_URL=http://localhost:5173
COOKIE_SAMESITE=lax
COOKIE_SECURE=false
```

### 4. Install & Run

```bash
# Install dependencies
npm install

# Seed admin user (reads strictly from .env)
npm run seed:admin

# Seed sample data (categories + products)
npm run seed

# Remove dummy seed products before production launch
npm run clear:dummy

# Start development server
npm run dev
```

Server starts at: `http://localhost:5000`

## 📡 API Endpoints

### Auth
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/login` | Public | Admin login (rate-limited: 10/15min) |
| POST | `/api/auth/logout` | Admin | Clear auth cookie |
| GET | `/api/auth/me` | Admin | Get current user |

### Products
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/products` | Public | List products (filters, search, pagination) |
| GET | `/api/products/:id` | Public | Get product by ID or slug |
| POST | `/api/products` | Admin | Create product (multipart/form-data) |
| PUT | `/api/products/:id` | Admin | Update product |
| DELETE | `/api/products/:id` | Admin | Delete product |
| POST | `/api/products/bulk` | Admin | Bulk actions (delete/hide/show/feature) |
| POST | `/api/products/:id/click` | Public | Track WhatsApp enquiry click |
| GET | `/api/products/stats` | Admin | Dashboard statistics |

### Categories
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/categories` | Public | List all categories |
| GET | `/api/categories/:id` | Public | Get category by ID or slug |
| POST | `/api/categories` | Admin | Create category |
| PUT | `/api/categories/:id` | Admin | Update category |
| DELETE | `/api/categories/:id` | Admin | Delete category (if no products) |

### Contact
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/contact` | Public | Submit contact form (rate-limited: 5/hr) |
| GET | `/api/contact` | Admin | List submissions |
| PUT | `/api/contact/:id/read` | Admin | Mark as read |
| DELETE | `/api/contact/:id` | Admin | Archive submission |

### Banners
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/banners` | Public | Get active banners |
| POST | `/api/banners` | Admin | Create banner |
| PUT | `/api/banners/:id` | Admin | Update banner |
| DELETE | `/api/banners/:id` | Admin | Delete banner |

### Other
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/products/:id` | OG meta tags (crawlers only, for WhatsApp previews) |

## 🔍 Query Parameters (Products)

```
GET /api/products?page=1&limit=12&category=ID&material=gold,silver&minPrice=1000&maxPrice=50000&search=kundan&sort=price_asc&featured=true&newArrivals=true
```

| Parameter | Type | Description |
|-----------|------|-------------|
| page | number | Page number (default: 1) |
| limit | number | Items per page (default: 12, max: 50) |
| category | ObjectId | Filter by category |
| material | string | Comma-separated materials |
| occasion | string | Comma-separated occasions |
| minPrice | number | Minimum price |
| maxPrice | number | Maximum price |
| search | string | Text search (name, description, tags) |
| sort | string | newest, price_asc, price_desc, popular |
| featured | boolean | Featured products only |
| newArrivals | boolean | New arrivals only |
| status | string | active/draft (admin only) |

## 🔐 Security Features

- JWT tokens stored in **httpOnly cookies** (not localStorage)
- Login **rate limiting** (10 attempts per 15 minutes)
- **bcrypt** password hashing with salt rounds of 12
- **Helmet** for secure HTTP headers
- **CORS** configured for frontend origin only
- **mongo-sanitize** to prevent NoSQL injection
- All inputs validated with **express-validator**
- Centralized error handling (no stack traces in production)

## 🚀 Production Deployment

For the complete end-to-end production deployment guide covering Render, Vercel, MongoDB Atlas IP allowlist, Cloudinary setup, custom domains (`www.suyogjewelry.com`, `api.suyogjewelry.com`), PWA configuration, and pre-launch cleanup checklist, see the root [README.md](../README.md).
