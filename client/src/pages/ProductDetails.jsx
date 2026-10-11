import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation, Thumbs, Zoom } from 'swiper/modules';
import { FaWhatsapp, FaShareAlt, FaChevronLeft } from 'react-icons/fa';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useProduct } from '../hooks';
import { trackClick } from '../services/api';
import { formatPrice, generateWhatsAppLink } from '../utils';
import { optimizeCloudinaryUrl } from '../utils/cloudinary';
import ProductCard from '../components/ProductCard';

// Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import 'swiper/css/zoom';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { product, related, loading, error } = useProduct(id);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    if (product?.sizes?.length > 0) {
      setSelectedSize(product.sizes[0]);
    }
  }, [product]);

  useEffect(() => {
    if (error && !loading) {
      navigate('/404', { replace: true });
    }
  }, [error, loading, navigate]);

  const handleWhatsAppClick = () => {
    if (!product) return;
    try {
      const productForMessage = {
        ...product,
        name: selectedSize ? `${product.name} (Size: ${selectedSize})` : product.name,
      };

      const link = generateWhatsAppLink(productForMessage);
      window.open(link, '_blank');

      // Fire and forget, never block opening WhatsApp
      trackClick(product._id).catch((err) => {
        console.warn('Track click request failed silently:', err);
      });
    } catch (err) {
      console.error('Error opening WhatsApp:', err);
    }
  };

  const handleShare = async () => {
    if (!product) return;
    const shareUrl = window.location.href;
    const shareData = {
      title: `${product.name} - Suyog Jewelry`,
      text: product.description || `Explore ${product.name} at Suyog Jewelry`,
      url: shareUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Error sharing:', err);
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        toast.success('Product link copied to clipboard!');
      } catch (err) {
        toast.error('Unable to copy link to clipboard');
      }
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-5 md:px-8 lg:px-12 py-16 md:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7 aspect-square skeleton border border-[#E5E5E5]"></div>
        <div className="lg:col-span-5 space-y-6 pt-4">
          <div className="skeleton h-4 w-1/4"></div>
          <div className="skeleton h-10 w-3/4"></div>
          <div className="skeleton h-8 w-1/3"></div>
          <div className="skeleton h-24 w-full"></div>
          <div className="skeleton h-14 w-full mt-8"></div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const images = product.images?.length > 0 ? product.images : [{ url: '/placeholder.jpg', alt: 'Placeholder' }];
  const seoTitle = product.seoTitle || `${product.name} - Suyog Jewelry`;
  const seoDesc = product.seoDescription || product.description || `Exquisite handcrafted ${product.name} at Suyog Jewelry.`;
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const primaryImageUrl = images[0]?.url || '';

  // Schema.org Product JSON-LD
  const schemaJsonLd = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.name,
    image: images.map((img) => img.url),
    description: seoDesc,
    sku: product._id,
    material: product.material,
    offers: {
      '@type': 'Offer',
      url: currentUrl,
      priceCurrency: 'INR',
      price: product.price ? product.price.toString() : '0',
      priceValidUntil: '2028-12-31',
      itemCondition: 'https://schema.org/NewCondition',
      availability: product.stockStatus === 'in-stock'
        ? 'https://schema.org/InStock'
        : 'https://schema.org/PreOrder',
      seller: {
        '@type': 'Organization',
        name: 'Suyog Jewelry',
      },
    },
  };

  return (
    <div className="bg-white min-h-screen pb-28 lg:pb-32">
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDesc} />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDesc} />
        <meta property="og:type" content="product" />
        <meta property="og:url" content={currentUrl} />
        {primaryImageUrl && <meta property="og:image" content={primaryImageUrl} />}
        <script type="application/ld+json">
          {JSON.stringify(schemaJsonLd)}
        </script>
      </Helmet>

      {/* Breadcrumb Navigation */}
      <div className="max-w-7xl mx-auto px-5 md:px-8 lg:px-12 py-6 border-b border-[#E5E5E5]">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-xs uppercase tracking-[0.2em] text-[#6B6B6B] hover:text-[#111111] transition-colors cursor-pointer"
        >
          <FaChevronLeft className="mr-2" size={10} />
          <span>Back to Collection</span>
        </button>
      </div>

      {/* Main Product Stage */}
      <div className="max-w-7xl mx-auto px-5 md:px-8 lg:px-12 pt-10 md:pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="border border-[#E5E5E5] bg-[#F7F7F7] relative group overflow-hidden">
              <Swiper
                style={{
                  '--swiper-navigation-color': '#111111',
                  '--swiper-pagination-color': '#111111',
                }}
                zoom={true}
                navigation={true}
                thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                modules={[FreeMode, Navigation, Thumbs, Zoom]}
                className="aspect-square w-full"
              >
                {images.map((img, idx) => (
                  <SwiperSlide key={idx}>
                    <div className="swiper-zoom-container cursor-crosshair">
                      <img
                        src={optimizeCloudinaryUrl(img.url, { width: 1200, height: 1200, crop: 'fill' })}
                        alt={img.alt || product.name}
                        className="w-full h-full object-cover"
                        loading={idx === 0 ? 'eager' : 'lazy'}
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
              
              {/* Minimal Badges */}
              <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 pointer-events-none">
                {product.isNewArrival && (
                  <span className="bg-[#111111] text-white text-[9px] uppercase tracking-[0.2em] font-medium py-1.5 px-3">
                    New Arrival
                  </span>
                )}
                {product.stockStatus === 'made-to-order' && (
                  <span className="bg-white text-[#111111] border border-[#E5E5E5] text-[9px] uppercase tracking-[0.2em] font-medium py-1.5 px-3">
                    Made to Order
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnail Navigation */}
            {images.length > 1 && (
              <div className="h-24 pt-2">
                <Swiper
                  onSwiper={setThumbsSwiper}
                  spaceBetween={12}
                  slidesPerView={4}
                  freeMode={true}
                  watchSlidesProgress={true}
                  modules={[FreeMode, Navigation, Thumbs]}
                  className="w-full h-full product-thumbs"
                >
                  {images.map((img, idx) => (
                    <SwiperSlide
                      key={idx}
                      className="cursor-pointer border border-[#E5E5E5] overflow-hidden bg-[#F7F7F7] opacity-50 transition-all [&.swiper-slide-thumb-active]:opacity-100 [&.swiper-slide-thumb-active]:border-[#111111]"
                    >
                      <img
                        src={optimizeCloudinaryUrl(img.url, { width: 250, height: 250, crop: 'fill' })}
                        alt={`Thumbnail ${idx}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            )}
          </div>

          {/* Right Column: Information & Enquiry */}
          <div className="lg:col-span-5 flex flex-col pt-2 lg:sticky lg:top-28">
            {product.category && (
              <Link
                to={`/products?category=${product.category._id || product.category}`}
                className="text-[10px] uppercase tracking-[0.25em] text-[#6B6B6B] font-medium mb-3 hover:text-[#111111] transition-colors"
              >
                {product.category.name || 'Fine Jewelry'}
              </Link>
            )}

            <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl text-[#111111] font-light mb-4 leading-tight">
              {product.name}
            </h1>

            <div className="flex items-center justify-between mb-8 pb-6 border-b border-[#E5E5E5]">
              <p className="font-body text-xl md:text-2xl font-normal tracking-wide text-[#111111]">
                {formatPrice(product.price, product.priceOnRequest)}
              </p>

              <button
                onClick={handleShare}
                className="w-9 h-9 border border-[#E5E5E5] flex items-center justify-center text-[#111111] hover:border-[#111111] transition-colors cursor-pointer"
                aria-label="Share piece"
                title="Share piece"
              >
                <FaShareAlt size={13} />
              </button>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h3 className="font-body text-xs uppercase tracking-[0.2em] font-medium text-[#111111] mb-3">
                Piece Overview
              </h3>
              <p className="text-[#6B6B6B] text-xs leading-relaxed whitespace-pre-line font-light">
                {product.description || 'Handcrafted fine jewelry made with certified precious materials.'}
              </p>
            </div>

            {/* Specifications Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8 bg-[#F7F7F7] border border-[#E5E5E5] p-5">
              <div>
                <span className="block text-[10px] uppercase tracking-[0.2em] text-[#6B6B6B] mb-1">Material</span>
                <span className="font-body text-xs font-medium text-[#111111] capitalize">{product.material}</span>
              </div>
              {product.purity && (
                <div>
                  <span className="block text-[10px] uppercase tracking-[0.2em] text-[#6B6B6B] mb-1">Purity</span>
                  <span className="font-body text-xs font-medium text-[#111111]">{product.purity}</span>
                </div>
              )}
              {product.weight && (
                <div>
                  <span className="block text-[10px] uppercase tracking-[0.2em] text-[#6B6B6B] mb-1">Weight</span>
                  <span className="font-body text-xs font-medium text-[#111111]">{product.weight}</span>
                </div>
              )}
              <div>
                <span className="block text-[10px] uppercase tracking-[0.2em] text-[#6B6B6B] mb-1">Availability</span>
                <span className="font-body text-xs font-medium text-[#111111] capitalize">
                  {product.stockStatus?.replace('-', ' ') || 'In Stock'}
                </span>
              </div>
            </div>

            {/* Size Selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-8">
                <h3 className="font-body text-xs uppercase tracking-[0.2em] font-medium text-[#111111] mb-3">
                  Select Size
                </h3>
                <div className="flex flex-wrap gap-2.5">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 text-xs uppercase tracking-wider font-medium transition-all cursor-pointer ${
                        selectedSize === size
                          ? 'border border-[#111111] bg-[#111111] text-white'
                          : 'border border-[#E5E5E5] bg-white text-[#111111] hover:border-[#111111]'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Primary Action Button (Desktop) */}
            <div className="mt-2">
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={handleWhatsAppClick}
                className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white py-4 px-6 flex items-center justify-center gap-3 font-medium text-xs uppercase tracking-[0.2em] transition-colors shadow-sm cursor-pointer"
              >
                <FaWhatsapp size={20} />
                <span>Enquire on WhatsApp</span>
              </motion.button>
              <p className="text-center text-[11px] text-[#6B6B6B] mt-3 font-light leading-relaxed">
                Connect directly with our master jeweler to confirm customizations, sizing, and expedited shipping.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Action Bar */}
      <div className="fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-md border-t border-[#E5E5E5] p-3.5 z-40 lg:hidden shadow-[0_-2px_10px_rgba(0,0,0,0.06)]">
        <button
          onClick={handleWhatsAppClick}
          className="w-full bg-[#25D366] active:bg-[#1eb055] text-white py-3.5 px-4 flex items-center justify-center gap-2.5 font-medium text-xs uppercase tracking-[0.2em] cursor-pointer"
        >
          <FaWhatsapp size={18} />
          <span>Enquire on WhatsApp</span>
        </button>
      </div>

      {/* Related Creations Section */}
      {related.length > 0 && (
        <section className="max-w-7xl mx-auto px-5 md:px-8 lg:px-12 mt-24 md:mt-32 pt-16 border-t border-[#E5E5E5]">
          <div className="text-center mb-12 md:mb-16">
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#6B6B6B] font-medium block mb-2">
              Complementary Pieces
            </span>
            <h2 className="font-heading text-3xl md:text-4xl text-[#111111] font-light">
              You May Also Admire
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
            {related.map((item) => (
              <ProductCard key={item._id} product={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetails;
