import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';
import { motion } from 'framer-motion';
import { FaInstagram, FaQuoteLeft, FaStar } from 'react-icons/fa';
import { useBanners, useCategories, useProducts } from '../hooks';
import ProductCard, { ProductCardSkeleton } from '../components/ProductCard';
import { optimizeCloudinaryUrl } from '../utils/cloudinary';

// Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

const testimonials = [
  {
    id: 1,
    name: 'Priyanka Sharma',
    city: 'Mumbai',
    review: 'The craftsmanship on my bridal kundan necklace was beyond breathtaking. The purity and finish are unmatched. Truly heirloom quality.',
    rating: 5,
    tag: 'Bespoke Bridal Suite',
  },
  {
    id: 2,
    name: 'Ananya Deshmukh',
    city: 'Pune',
    review: 'Purchasing fine gold jewelry online felt daunting, but the team at Suyog guided me patiently on WhatsApp with video previews and certificates.',
    rating: 5,
    tag: '22K Gold Bangles',
  },
  {
    id: 3,
    name: 'Meera Patel',
    city: 'Ahmedabad',
    review: 'The Polki choker set arrived in pristine insured packaging. The sheer weight and artisanal nuance speak volumes about their legacy.',
    rating: 5,
    tag: 'Polki Choker Set',
  },
];

const instagramPosts = [
  {
    id: 1,
    imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop',
    alt: 'Bridal Diamond Necklace Set',
    caption: 'Pure craftsmanship in every curve #BridalElegance #SuyogJewelry',
  },
  {
    id: 2,
    imageUrl: 'https://images.unsplash.com/photo-1611591475152-4735d387c982?q=80&w=800&auto=format&fit=crop',
    alt: 'Handcrafted Gold Bangles',
    caption: '22K Hallmarked artisanal bangles designed for timeless celebration',
  },
  {
    id: 3,
    imageUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800&auto=format&fit=crop',
    alt: 'Solitaire Diamond Ring',
    caption: 'Precision-cut solitaire brilliance crafted to treasure for generations',
  },
  {
    id: 4,
    imageUrl: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop',
    alt: 'Polki Emerald Necklace',
    caption: 'Royal heirloom pieces reimagined for modern brides #HeritageGold',
  },
  {
    id: 5,
    imageUrl: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=800&auto=format&fit=crop',
    alt: 'Gold Jhumkas',
    caption: 'Classic Indian motifs crafted in lightweight 22K gold #EverydayElegance',
  },
  {
    id: 6,
    imageUrl: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=800&auto=format&fit=crop',
    alt: 'Gemstone Setting Atelier',
    caption: 'Behind the scenes: every single gemstone hand-selected by master jewelers #Craftsmanship',
  },
];

const Home = () => {
  const { banners, loading: bannersLoading } = useBanners();
  const { categories, loading: categoriesLoading } = useCategories();
  const { products: featured, loading: featuredLoading } = useProducts({ featured: true, limit: 4 });
  const { products: newArrivals, loading: newLoading } = useProducts({ newArrivals: true, limit: 4 });
  const instagramUrl = import.meta.env.VITE_INSTAGRAM_URL || 'https://instagram.com';

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <div className="bg-white">
      <Helmet>
        <title>Suyog Jewelry - Exquisite Handcrafted Jewelry</title>
        <meta
          name="description"
          content="Discover exquisite handcrafted jewelry at Suyog Jewelry. Explore our collections of 22K gold, certified diamonds, and bespoke bridal sets."
        />
        <meta property="og:title" content="Suyog Jewelry - Exquisite Handcrafted Jewelry" />
        <meta
          property="og:description"
          content="Discover exquisite handcrafted jewelry at Suyog Jewelry. Explore our collections of 22K gold, certified diamonds, and bespoke bridal sets."
        />
        <meta property="og:type" content="website" />
      </Helmet>

      {/* Hero Banners */}
      <section className="relative w-full h-[65vh] md:h-[88vh] bg-[#111111] overflow-hidden">
        {bannersLoading && banners.length === 0 ? (
          <div className="w-full h-full skeleton"></div>
        ) : banners.length > 0 ? (
          <Swiper
            modules={[Autoplay, Pagination, Navigation, EffectFade]}
            effect="fade"
            speed={1200}
            autoplay={{ delay: 6000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            navigation
            className="w-full h-full"
          >
            {banners.map((banner) => (
              <SwiperSlide key={banner._id}>
                <div className="relative w-full h-full">
                  <img
                    src={optimizeCloudinaryUrl(banner.image?.url, { width: 1920, height: 950, crop: 'fill' })}
                    alt={banner.title || 'Suyog Jewelry Hero Banner'}
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-black/45 backdrop-brightness-95"></div>

                  {/* Full-width & Full-height Centered Content Stage */}
                  <div className="absolute inset-0 z-10 flex items-center justify-center px-6 md:px-12 pointer-events-none">
                    <div className="w-full max-w-4xl flex flex-col items-center justify-center text-center pointer-events-auto">
                      <motion.span
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-white/80 text-[11px] md:text-xs uppercase tracking-[0.3em] font-medium mb-3 text-center indent-[0.3em]"
                      >
                        Haute Joaillerie
                      </motion.span>
                      <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="w-full font-heading text-4xl md:text-6xl lg:text-7xl text-white font-light mb-5 tracking-tight text-center"
                      >
                        {banner.title}
                      </motion.h2>
                      {banner.subtitle && (
                        <motion.p
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.8, delay: 0.4 }}
                          className="w-full max-w-xl mx-auto font-body text-sm md:text-base text-white/85 mb-8 font-light leading-relaxed text-center"
                        >
                          {banner.subtitle}
                        </motion.p>
                      )}
                      {banner.link && (
                        <motion.div
                          initial={{ opacity: 0, y: 15 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.6 }}
                          className="w-full flex justify-center"
                        >
                          <Link
                            to={banner.link}
                            className="inline-block bg-white text-[#111111] hover:bg-transparent hover:text-white hover:border-white border border-white font-medium uppercase tracking-[0.2em] text-xs px-9 py-4 transition-all duration-300 shadow-sm"
                          >
                            {banner.buttonText || 'Discover Collection'}
                          </Link>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-center text-white bg-[#111111] px-6">
            <span className="text-white/70 text-xs uppercase tracking-[0.3em] mb-3 text-center indent-[0.3em]">
              Maison Suyog
            </span>
            <h2 className="w-full font-heading text-4xl md:text-6xl text-white font-light mb-6 text-center">
              Timeless Indian Artistry
            </h2>
            <div className="flex justify-center w-full">
              <Link
                to="/products"
                className="bg-white text-[#111111] border border-white hover:bg-transparent hover:text-white px-9 py-4 uppercase font-medium text-xs tracking-[0.2em] transition-all"
              >
                Explore Catalog
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* Categories Section */}
      <section className="py-20 md:py-28 lg:py-36 max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={fadeInUp}
          className="text-center mb-16 md:mb-24 max-w-3xl mx-auto"
        >
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#6B6B6B] font-medium block mb-2.5">
            Curated Categories
          </span>
          <h2 className="font-heading text-3xl md:text-5xl lg:text-6xl text-[#111111] font-light mb-4">
            Shop by Category
          </h2>
          <div className="w-12 h-px bg-[#111111] mx-auto"></div>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8 lg:gap-10">
          {categoriesLoading && categories.length === 0 ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="aspect-[4/5] skeleton border border-[#E5E5E5] rounded-xl"></div>
            ))
          ) : (
            categories.map((cat, index) => (
              <motion.div
                key={cat._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
              >
                <Link to={`/products?category=${cat._id}`} className="group block text-center">
                  <div className="relative aspect-[4/5] overflow-hidden bg-[#F7F7F7] border border-[#E5E5E5] mb-4 transition-all duration-300 group-hover:border-[#111111]">
                    <img
                      src={optimizeCloudinaryUrl(cat.image?.url, { width: 500, height: 625, crop: 'fill' })}
                      alt={cat.name}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <h3 className="font-heading text-base md:text-lg text-[#111111] font-normal transition-opacity group-hover:opacity-60">
                    {cat.name}
                  </h3>
                  <span className="text-[10px] text-[#6B6B6B] uppercase tracking-[0.2em] block mt-0.5">
                    Explore
                  </span>
                </Link>
              </motion.div>
            ))
          )}
        </div>
      </section>

      {/* Featured Masterpieces */}
      <section className="py-20 md:py-28 lg:py-36 bg-[#F7F7F7] border-y border-[#E5E5E5]">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-16 md:mb-24 max-w-3xl mx-auto"
          >
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#6B6B6B] font-medium block mb-2.5">
              Signature Showcase
            </span>
            <h2 className="font-heading text-3xl md:text-5xl lg:text-6xl text-[#111111] font-light mb-4">
              Featured Creations
            </h2>
            <div className="w-12 h-px bg-[#111111] mx-auto mb-6"></div>
            <Link
              to="/products?featured=true"
              className="inline-block text-xs font-medium uppercase tracking-[0.22em] text-[#111111] border-b border-[#111111] pb-1 hover:opacity-60 transition-opacity"
            >
              View Full Gallery &rarr;
            </Link>
          </motion.div>

          {featuredLoading && featured.length === 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-10">
              {Array.from({ length: 4 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : featured.length > 0 ? (
            <>
              <div className="hidden md:grid grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-10">
                {featured.slice(0, 4).map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
              <div className="md:hidden">
                <Swiper slidesPerView={1.15} spaceBetween={16}>
                  {featured.map((product) => (
                    <SwiperSlide key={product._id}>
                      <ProductCard product={product} />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </>
          ) : (
            <p className="text-center text-[#6B6B6B] py-12 text-xs uppercase tracking-widest">
              No featured pieces currently available.
            </p>
          )}
        </div>
      </section>

      {/* Maison Pillars / Full Black Strip */}
      <section className="my-16 md:my-28 py-24 md:py-32 bg-[#0D0D0D] text-white border-y border-[#1F1F1F]">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="bg-[#141414] rounded-2xl md:rounded-3xl p-8 md:p-12 border border-[#222222] hover:border-[#383838] transition-all flex flex-col items-center"
          >
            <div className="text-white text-3xl mb-5 flex justify-center font-serif">✧</div>
            <h3 className="font-heading text-xl md:text-2xl font-light mb-3 text-white tracking-wide">
              Master Craftsmanship
            </h3>
            <p className="font-body text-xs md:text-sm text-[#9E9E9E] leading-relaxed max-w-xs mx-auto font-light">
              Every creation is meticulously sculpted by veteran artisans with decades of goldsmithing mastery.
            </p>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ delay: 0.15 }}
            className="bg-[#141414] rounded-2xl md:rounded-3xl p-8 md:p-12 border border-[#222222] hover:border-[#383838] transition-all flex flex-col items-center"
          >
            <div className="text-white text-3xl mb-5 flex justify-center font-serif">✦</div>
            <h3 className="font-heading text-xl md:text-2xl font-light mb-3 text-white tracking-wide">
              Certified Authenticity
            </h3>
            <p className="font-body text-xs md:text-sm text-[#9E9E9E] leading-relaxed max-w-xs mx-auto font-light">
              100% BIS hallmarked 22K/18K gold and conflict-free lab/natural certified diamonds.
            </p>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ delay: 0.3 }}
            className="bg-[#141414] rounded-2xl md:rounded-3xl p-8 md:p-12 border border-[#222222] hover:border-[#383838] transition-all flex flex-col items-center"
          >
            <div className="text-white text-3xl mb-5 flex justify-center font-serif">✧</div>
            <h3 className="font-heading text-xl md:text-2xl font-light mb-3 text-white tracking-wide">
              Bespoke Consultation
            </h3>
            <p className="font-body text-xs md:text-sm text-[#9E9E9E] leading-relaxed max-w-xs mx-auto font-light">
              Personalized private appointments and instantaneous high-definition video previews via WhatsApp.
            </p>
          </motion.div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-20 md:py-32 max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center mb-16 md:mb-24 max-w-3xl mx-auto"
        >
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#6B6B6B] font-medium block mb-2.5">
            Fresh from the Atelier
          </span>
          <h2 className="font-heading text-3xl md:text-5xl lg:text-6xl text-[#111111] font-light mb-4">
            New Arrivals
          </h2>
          <div className="w-12 h-px bg-[#111111] mx-auto mb-6"></div>
          <Link
            to="/products?newArrivals=true"
            className="inline-block text-xs font-medium uppercase tracking-[0.22em] text-[#111111] border-b border-[#111111] pb-1 hover:opacity-60 transition-opacity"
          >
            View All Arrivals &rarr;
          </Link>
        </motion.div>

        {newLoading && newArrivals.length === 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-10">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : newArrivals.length > 0 ? (
          <>
            <div className="hidden md:grid grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-10">
              {newArrivals.slice(0, 4).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
            <div className="md:hidden">
              <Swiper slidesPerView={1.15} spaceBetween={16}>
                {newArrivals.map((product) => (
                  <SwiperSlide key={product._id}>
                    <ProductCard product={product} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </>
        ) : (
          <p className="text-center text-[#6B6B6B] py-12 text-xs uppercase tracking-widest">
            No new arrivals currently available.
          </p>
        )}
      </section>

      {/* Client Testimonials */}
      <section
        className="my-24 md:my-32 py-24 md:py-32 bg-[#FAFAFA] border-y border-[#E5E5E5]"
        style={{ marginTop: '100px', marginBottom: '100px' }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-16 md:mb-20 max-w-3xl mx-auto"
          >
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#6B6B6B] font-medium block mb-2.5">
              Client Testimonials
            </span>
            <h2 className="font-heading text-3xl md:text-5xl lg:text-6xl text-[#111111] font-light mb-4">
              Voices of Trust
            </h2>
            <div className="w-12 h-px bg-[#111111] mx-auto"></div>
          </motion.div>

          <Swiper
            modules={[Autoplay, Pagination]}
            autoplay={{ delay: 6500, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            spaceBetween={36}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="py-4 pb-20"
          >
            {testimonials.map((item) => (
              <SwiperSlide key={item.id} className="h-auto pb-2">
                <div
                  className="testimonial-card flex flex-col justify-between h-full p-8 md:p-12 lg:p-14 rounded-3xl md:rounded-[32px] bg-white border border-[#E5E5E5] shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_48px_rgba(0,0,0,0.08)] transition-all duration-300"
                  style={{ borderRadius: '28px' }}
                >
                  <div>
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex text-[#111111] gap-1.5">
                        {Array.from({ length: item.rating }).map((_, i) => (
                          <FaStar key={i} size={13} />
                        ))}
                      </div>
                      <FaQuoteLeft className="text-[#D4D4D4] hover:text-[#111111] transition-colors" size={20} />
                    </div>
                    <p className="font-heading text-base md:text-lg text-[#222222] font-normal leading-relaxed italic mb-8">
                      "{item.review}"
                    </p>
                  </div>
                  <div className="border-t border-[#F0F0F0] pt-6 mt-auto">
                    <h4 className="font-heading text-lg font-medium text-[#111111]">{item.name}</h4>
                    <p className="text-[11px] text-[#6B6B6B] flex items-center justify-between mt-1 tracking-wider uppercase">
                      <span>{item.city}</span>
                      <span className="text-[#111111] font-medium">{item.tag}</span>
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* Instagram Gallery Grid */}
      <section className="py-20 md:py-32 bg-white border-t border-[#E5E5E5]">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-16 md:mb-24 max-w-3xl mx-auto"
          >
            <div className="flex items-center justify-center gap-2 text-[#111111] mb-2.5">
              <FaInstagram size={16} />
              <span className="uppercase tracking-[0.25em] text-xs font-medium">@jewelry.by.suyog</span>
            </div>
            <h2 className="font-heading text-3xl md:text-5xl lg:text-6xl text-[#111111] font-light mb-4">
              Follow Our Atelier
            </h2>
            <div className="w-12 h-px bg-[#111111] mx-auto mb-4"></div>
            <p className="text-[#6B6B6B] max-w-md mx-auto text-xs leading-relaxed">
              Daily bridal inspirations, raw atelier moments, and bespoke jewelry reveals.
            </p>
          </motion.div>

          {/* 6-Grid with thin borders */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-5 lg:gap-6">
            {instagramPosts.map((post) => (
              <a
                key={post.id}
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative aspect-square overflow-hidden bg-[#F7F7F7] border border-[#E5E5E5] block hover:border-[#111111] transition-all"
              >
                <img
                  src={post.imageUrl}
                  alt={post.alt}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4 text-center text-white">
                  <FaInstagram size={20} className="text-white mb-2" />
                  <span className="text-[10px] text-white/90 line-clamp-2 leading-relaxed tracking-wider uppercase font-light">
                    {post.caption}
                  </span>
                </div>
              </a>
            ))}
          </div>

          <div className="text-center mt-16 md:mt-20">
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-[#111111] text-white border border-[#111111] hover:bg-white hover:text-[#111111] px-9 py-4 text-xs uppercase tracking-[0.2em] font-medium transition-all duration-300"
            >
              Follow on Instagram
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
