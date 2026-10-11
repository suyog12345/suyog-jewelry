import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import About from './pages/About';
import Contact from './pages/Contact';

// Public Lazy Pages
const Products = lazy(() => import('./pages/Products'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));
const FAQ = lazy(() => import('./pages/FAQ'));
const ReturnPolicy = lazy(() => import('./pages/ReturnPolicy'));
const JewelryCare = lazy(() => import('./pages/JewelryCare'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const Terms = lazy(() => import('./pages/Terms'));

// Admin Lazy Pages & Layout
const AdminLogin = lazy(() => import('./admin/pages/AdminLogin'));
const ProtectedRoute = lazy(() => import('./admin/components/ProtectedRoute'));
const AdminLayout = lazy(() => import('./admin/components/AdminLayout'));
const Dashboard = lazy(() => import('./admin/pages/Dashboard'));
const ProductsList = lazy(() => import('./admin/pages/ProductsList'));
const ProductEdit = lazy(() => import('./admin/pages/ProductEdit'));
const CategoriesList = lazy(() => import('./admin/pages/CategoriesList'));
const BannersList = lazy(() => import('./admin/pages/BannersList'));
const ContactsList = lazy(() => import('./admin/pages/ContactsList'));

const App = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full flex items-center justify-center bg-white">
          <div className="flex flex-col items-center gap-4">
            <span className="text-2xl font-serif text-[#111111] animate-pulse">✧</span>
            <span className="font-sans text-[11px] font-medium text-[#6B6B6B] tracking-[0.25em] uppercase">Loading...</span>
          </div>
        </div>
      }
    >
      <Routes>
        {/* ── Public Storefront Routes ── */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="products" element={<Products />} />
          <Route path="products/:id" element={<ProductDetails />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="faq" element={<FAQ />} />
          <Route path="return-policy" element={<ReturnPolicy />} />
          <Route path="jewelry-care" element={<JewelryCare />} />
          <Route path="privacy-policy" element={<PrivacyPolicy />} />
          <Route path="terms" element={<Terms />} />
        </Route>

        {/* ── Admin Login Route (Unprotected, no public links) ── */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* ── Protected Admin Routes ── */}
        <Route path="/admin" element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="products" element={<ProductsList />} />
            <Route path="products/new" element={<ProductEdit />} />
            <Route path="products/:id/edit" element={<ProductEdit />} />
            <Route path="categories" element={<CategoriesList />} />
            <Route path="banners" element={<BannersList />} />
            <Route path="contacts" element={<ContactsList />} />
          </Route>
        </Route>

        {/* ── 404 Fallback ── */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default App;
