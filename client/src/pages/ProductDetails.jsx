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
      // Create a modified product object with selected size included in the name for the message
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
      <div className="container mx-auto px-4 py-12 md:py-20 grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="skeleton aspect-square rounded-lg w-full"></div>
        <div className="space-y-6">
          <div className="skeleton h-10 w-3/4 rounded"></div>
          <div className="skeleton h-8 w-1/3 rounded"></div>
          <div className="skeleton h-32 w-full rounded"></div>
          <div className="skeleton h-12 w-full rounded mt-8"></div>
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
    <div className="bg-cream-50 min-h-screen pb-24 lg:pb-20">
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

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4 md:py-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-sm text-gray-warm hover:text-gold-700 transition-colors cursor-pointer"
        >
          <FaChevronLeft className="mr-2" size={12} /> Back
        </button>
      </div>

      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 bg-white p-4 md:p-8 rounded-xl shadow-sm border border-cream-200">

          {/* Left: Image Gallery */}
          <div className="flex flex-col gap-4">
            <div className="border border-cream-200 rounded-lg overflow-hidden bg-cream-50 relative group">
              <Swiper
                style={{
                  '--swiper-navigation-color': '#D4A843',
                  '--swiper-pagination-color': '#D4A843',
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
                      <img src={img.url} alt={img.alt || product.name} className="w-full h-full object-cover" />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
              <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 pointer-events-none">
                {product.isNewArrival && (
                  <span className="bg-maroon-700 text-white text-xs uppercase font-bold tracking-wider py-1 px-3 rounded shadow">
                    New Arrival
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="h-24">
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
                      className="cursor-pointer border-2 border-transparent rounded-md overflow-hidden bg-cream-50 opacity-60 transition-all [&.swiper-slide-thumb-active]:opacity-100 [&.swiper-slide-thumb-active]:border-gold-500"
                    >
                      <img src={img.url} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            )}
          </div>

          {/* Right: Product Info */}
          <div className="flex flex-col">
            {product.category && (
              <Link
                to={`/products?category=${product.category._id || product.category}`}
                className="text-sm text-gold-700 uppercase tracking-widest font-medium mb-2 hover:underline"
              >
                {product.category.name || 'Category'}
              </Link>
            )}

            <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl text-dark mb-4 leading-tight">
              {product.name}
            </h1>

            <div className="flex items-center justify-between mb-6 pb-6 border-b border-cream-200">
              <p className="font-body text-2xl md:text-3xl text-dark-light font-medium">
                {formatPrice(product.price, product.priceOnRequest)}
              </p>

              <button
                onClick={handleShare}
                className="w-10 h-10 rounded-full bg-cream-50 flex items-center justify-center text-gray-warm hover:text-dark hover:bg-cream-200 transition-colors cursor-pointer"
                aria-label="Share product"
                title="Share product"
              >
                <FaShareAlt size={16} />
              </button>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h3 className="font-heading text-lg mb-2">Description</h3>
              <p className="text-gray-warm leading-relaxed whitespace-pre-line">
                {product.description || 'No description available.'}
              </p>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8 bg-cream-50 p-4 rounded-lg">
              <div>
                <span className="block text-xs uppercase tracking-wider text-gray-warm mb-1">Material</span>
                <span className="font-medium text-dark capitalize">{product.material}</span>
              </div>
              {product.purity && (
                <div>
                  <span className="block text-xs uppercase tracking-wider text-gray-warm mb-1">Purity</span>
                  <span className="font-medium text-dark">{product.purity}</span>
                </div>
              )}
              {product.weight && (
                <div>
                  <span className="block text-xs uppercase tracking-wider text-gray-warm mb-1">Weight</span>
                  <span className="font-medium text-dark">{product.weight}</span>
                </div>
              )}
              <div>
                <span className="block text-xs uppercase tracking-wider text-gray-warm mb-1">Availability</span>
                <span
                  className={`font-medium ${
                    product.stockStatus === 'in-stock' ? 'text-green-600' : 'text-gold-700'
                  } capitalize`}
                >
                  {product.stockStatus?.replace('-', ' ') || 'In Stock'}
                </span>
              </div>
            </div>

            {/* Sizes */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-8">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-heading text-lg">Select Size</h3>
                </div>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded border text-sm font-medium transition-colors cursor-pointer ${
                        selectedSize === size
                          ? 'border-gold-500 bg-gold-50 text-gold-900'
                          : 'border-cream-200 bg-white text-dark hover:border-gold-300'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="mt-auto pt-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleWhatsAppClick}
                className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white py-4 rounded-lg flex items-center justify-center gap-3 font-medium uppercase tracking-wider transition-colors shadow-md cursor-pointer"
              >
                <FaWhatsapp size={24} />
                Enquire on WhatsApp
              </motion.button>
              <p className="text-center text-xs text-gray-warm mt-4">
                No online payment required. Chat with us to discuss details, customization, and delivery.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Mobile CTA Bar */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-cream-200 p-3 z-40 lg:hidden shadow-[0_-4px_12px_rgba(0,0,0,0.1)]">
        <button
          onClick={handleWhatsAppClick}
          className="w-full bg-[#25D366] active:bg-[#128C7E] text-white py-3.5 px-4 rounded-lg flex items-center justify-center gap-2 font-medium tracking-wide shadow cursor-pointer transition-colors"
        >
          <FaWhatsapp size={22} />
          <span>Enquire on WhatsApp</span>
        </button>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="container mx-auto px-4 md:px-8 mt-16 md:mt-24">
          <h2 className="font-heading text-3xl text-dark mb-8 text-center md:text-left border-b border-cream-200 pb-4">
            You May Also Like
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
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
