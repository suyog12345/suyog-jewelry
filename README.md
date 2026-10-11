# Suyog Jewelry - Production Deployment Guide & Documentation

Full-stack luxury jewelry catalogue application built with Node.js/Express, MongoDB Atlas, Cloudinary, and React (Vite + Tailwind CSS + PWA).

---

## 🏛️ Architecture & Custom Domains

| Component | Platform | Production Domain | Repository Directory |
|-----------|----------|-------------------|----------------------|
| **Frontend & Admin** | Vercel | `https://www.suyogjewelry.com` | `/client` |
| **Backend API** | Render | `https://api.suyogjewelry.com` | `/server` |
| **Database** | MongoDB Atlas | Cloud Cluster | — |
| **Media Assets** | Cloudinary | Cloud Storage | — |

---

## 🚀 Pre-Launch & Production Checklist

Follow this checklist step-by-step to deploy Suyog Jewelry safely to production.

### Step 1: MongoDB Atlas Configuration
1. Log in to [MongoDB Atlas](https://cloud.mongodb.com/).
2. Navigate to **Network Access** → **IP Access List**:
   - Add IP Address `0.0.0.0/0` (Allow Access from Anywhere) so that dynamic cloud hosting providers (Render) can connect seamlessly.
3. Navigate to **Database Access**:
   - Create a database user with `readWriteAnyDatabase` or scoped to `suyog_jewelry`.
4. Obtain the connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxx.mongodb.net/suyog_jewelry?retryWrites=true&w=majority
   ```

---

### Step 2: Cloudinary Asset Storage
1. Log in to [Cloudinary Console](https://cloudinary.com/).
2. Retrieve your **Cloud Name**, **API Key**, and **API Secret**.
3. All image uploads automatically use the `suyog-jewelry` asset folder.
4. Automatic transformations (`f_auto`, `q_auto`, dynamic width/crop resizing) are applied on the frontend to deliver sub-second luxury image loads.

---

### Step 3: Backend Deployment (Render)
1. In [Render Dashboard](https://dashboard.render.com/), click **New** → **Web Service**.
2. Connect your GitHub repository.
3. Service Settings:
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Add the following **Environment Variables** in Render:

| Variable | Recommended Production Value | Description |
|----------|------------------------------|-------------|
| `NODE_ENV` | `production` | Enables production security & logging mode |
| `PORT` | `5000` | Server listening port |
| `MONGODB_URI` | `mongodb+srv://.../suyog_jewelry` | Atlas connection string |
| `JWT_SECRET` | *(Random 64-char string)* | **Mandatory**; server refuses to start if missing |
| `JWT_EXPIRES_IN` | `7d` | Admin session cookie lifespan |
| `CLIENT_URL` | `https://www.suyogjewelry.com` | Frontend primary domain |
| `ALLOWED_ORIGINS` | `https://www.suyogjewelry.com,https://suyogjewelry.com` | Comma-separated CORS origins |
| `SITE_URL` | `https://www.suyogjewelry.com` | Used for dynamic sitemap and robots.txt URLs |
| `COOKIE_SAMESITE` | `lax` | Set to `lax` when frontend & API share `suyogjewelry.com` domain; `none` for separate vercel/render testing URLs |
| `COOKIE_SECURE` | `true` | Requires HTTPS for httpOnly auth cookies |
| `CLOUDINARY_CLOUD_NAME` | *(Your Cloudinary cloud name)* | Cloudinary credentials |
| `CLOUDINARY_API_KEY` | *(Your Cloudinary API key)* | Cloudinary credentials |
| `CLOUDINARY_API_SECRET` | *(Your Cloudinary API secret)* | Cloudinary credentials |
| `ADMIN_EMAIL` | `admin@suyogjewelry.com` | Admin login email |
| `ADMIN_PASSWORD` | *(Strong custom password)* | Admin login password (warning shown if weak) |

5. **Custom Domain in Render**:
   - Go to **Settings** → **Custom Domains** → Add `api.suyogjewelry.com`.
   - In your DNS provider (Cloudflare, GoDaddy, Namecheap), add a **CNAME** record:
     - Host / Name: `api`
     - Target: Render provided service domain (e.g. `suyog-api.onrender.com`)

---

### Step 4: Frontend Deployment (Vercel)
1. In [Vercel Dashboard](https://vercel.com/dashboard), click **Add New...** → **Project**.
2. Import the repository and select **Root Directory**: `client`.
3. Framework Preset will auto-detect as **Vite**.
4. Configure **Environment Variables** in Vercel:

| Variable | Production Value | Description |
|----------|------------------|-------------|
| `VITE_API_URL` | `https://api.suyogjewelry.com/api` | Full URL to backend API |
| `VITE_SITE_URL` | `https://www.suyogjewelry.com` | Canonical site URL |
| `VITE_WHATSAPP_NUMBER` | `+919876543210` | Store WhatsApp number with country code |
| `VITE_INSTAGRAM_URL` | `https://www.instagram.com/suyogjewelry` | Official Instagram profile |

5. **Custom Domain in Vercel**:
   - Go to **Project Settings** → **Domains** → Add `www.suyogjewelry.com` and `suyogjewelry.com`.
   - Set up DNS records as instructed by Vercel:
     - `A` record for `@` pointing to `76.76.21.21`
     - `CNAME` record for `www` pointing to `cname.vercel-dns.com`

---

### Step 5: Creating the Admin User
To provision the initial admin user safely:
1. Ensure `ADMIN_EMAIL` and `ADMIN_PASSWORD` are defined in your environment.
2. In the Render Shell (or locally with the production `.env`):
   ```bash
   npm run seed:admin
   ```
3. The script hashes the password with bcrypt (salt rounds: 12) and creates the admin record.
4. **Security Notice**: No default or plaintext passwords are ever committed to source control or README files.

---

### Step 6: Removing Dummy Seed Products Before Launch
Before going live to real customers, purge all seed placeholder products:
1. In Render Shell or terminal:
   ```bash
   npm run clear:dummy
   ```
2. This safely removes seed products (matching placeholder image URLs and seed tags) while keeping categories, banners, and your admin user intact.
3. Alternatively, remove or edit products individually from the **Admin Panel** (`/admin/products`).

---

## 🔒 Security & Performance Features Implemented

1. **Dynamic Sitemap & Robots**:
   - Backend dynamically generates `/sitemap.xml` with active products by slug, product images, categories, and static pages.
   - Serves `/robots.txt` pointing to `Sitemap: https://www.suyogjewelry.com/sitemap.xml` and disallowing `/admin` and `/api`.
2. **PWA with Offline Fallback**:
   - Full web app manifest with branding icons (`192x192`, `512x512`, `apple-touch-icon`).
   - Service worker precaches application shell and serves a luxury-styled `offline.html` when network connectivity is lost.
   - Strictly excludes `/admin` and `/api` from caching and navigation fallback.
3. **Cloudinary Transformations & Lazy Loading**:
   - Dynamic `f_auto,q_auto,w_{width},c_fill` URL optimization helper.
   - `loading="lazy"` on all public images with blurred placeholder previews.
4. **Social Crawler Link Previews**:
   - `vercel.json` rewrites crawler User-Agents (`WhatsApp`, `facebookexternalhit`, `Twitterbot`, `TelegramBot`, etc.) for `/products/:slug` to the backend OG route.
   - Backend OG route generates complete Open Graph meta tags and **never** redirects crawlers, while normal browsers are redirected (302) to the SPA storefront.
5. **Noindex Protection**:
   - Admin routes include `<meta name="robots" content="noindex, nofollow" />` via React Helmet to prevent indexing of internal management pages.
6. **Configurable Cookies & CORS**:
   - `COOKIE_SAMESITE` (`lax` or `none`) and `COOKIE_SECURE` (`true`) controlled via env variables.
   - Dynamic CORS origin list parsed from comma-separated `ALLOWED_ORIGINS`.

---

## 🧪 Verify Crawler Preview After Deploy

Once deployed to Vercel and Render, verify that link previews (WhatsApp, Facebook, Twitter, Telegram) work properly using `curl`:

### 1. Test Social Crawler (e.g. WhatsApp)
Run `curl` with a WhatsApp User-Agent pointing to your Vercel frontend URL:
```bash
curl -i -A "WhatsApp/2.23" https://www.suyogjewelry.com/products/<product-slug>
```
**Expected Output:**
- HTTP status `200 OK` (no redirect)
- Full HTML document containing Open Graph and Twitter Card tags:
  - `<meta property="og:type" content="product">`
  - `<meta property="og:url" content="https://www.suyogjewelry.com/products/<product-slug>">`
  - `<meta property="og:title" content="<Product Name> - Suyog Jewelry">`
  - `<meta property="og:description" content="...">`
  - `<meta property="og:image" content="https://...">` (must be an absolute HTTPS URL)
  - `<meta property="og:image:secure_url" content="https://...">`
  - `<meta name="twitter:card" content="summary_large_image">`
  - `<meta name="twitter:image" content="https://...">`

### 2. Test Normal Browser
Run `curl` with a standard browser User-Agent:
```bash
curl -i -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" https://www.suyogjewelry.com/products/<product-slug>
```
**Expected Output:**
- Handled directly by Vercel SPA routing (returns `index.html` with HTTP `200 OK` or redirects to frontend app shell).

### 3. Test Unknown Product Slug with Crawler
Run `curl` with a WhatsApp User-Agent for a non-existent slug:
```bash
curl -i -A "WhatsApp/2.23" https://www.suyogjewelry.com/products/non-existent-product-slug
```
**Expected Output:**
- HTTP status `404 Not Found`
- Clean HTML page with `<meta name="robots" content="noindex">` and message "Product Not Found" (server does not crash).

