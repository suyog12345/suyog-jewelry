import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';
import { motion } from 'framer-motion';
import { FaInstagram, FaStar, FaQuoteLeft } from 'react-icons/fa';
import { useBanners, useCategories, useProducts } from '../hooks';
import ProductCard, { ProductCardSkeleton } from '../components/ProductCard';

// Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

const testimonials = [
  {
    id: 1,
    name: 'Ananya Deshmukh',
    city: 'Pune',
    review: 'I ordered my bridal choker set through their WhatsApp concierge. The craftsmanship exceeded my expectations, and the hallmark certification gave me total peace of mind!',
    rating: 5,
    tag: 'Bridal Heritage Collection',
  },
  {
    id: 2,
    name: 'Priya Sharma',
    city: 'Mumbai',
    review: 'The finishing on the temple jewelry necklace is sheer perfection. The team guided me patiently with video calls and customized the chain length exactly as requested.',
    rating: 5,
    tag: 'Antique Gold Necklace',
  },
  {
    id: 3,
    name: 'Meera Patel',
    city: 'Ahmedabad',
    review: 'Suyog Jewelry combines traditional purity with transparent pricing. Truly an exceptional bespoke jewelry buying experience from the comfort of home.',
    rating: 5,
    tag: 'Diamond Polki Earrings',
  },
  {
    id: 4,
    name: 'Ritu Kapoor',
    city: 'Delhi',
    review: 'Spectacular diamond studs! The sparkle and setting are world-class. Safe doorstep delivery and beautiful luxury velvet box packaging.',
    rating: 5,
    tag: 'Solitaire Studs',
  },
];

const instagramPosts = [
  {
    id: 1,
    imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80',
    alt: 'Handcrafted Gold Bangles',
    caption: 'Pure 22K handcrafted perfection #SuyogJewelry',
  },
  {
    id: 2,
    imageUrl: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=600&q=80',
    alt: 'Diamond Solitaire Ring',
    caption: 'Eternity captured in certified diamonds #BridalGleam',
  },
  {
    id: 3,
    imageUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80',
    alt: 'Emerald & Kundan Bridal Set',
    caption: 'Royal heirloom pieces reimagined for modern brides #HeritageGold',
  },
  {
    id: 4,
    imageUrl: 'https://images.unsplash.com/photo-1611591475817-48f804918e7e?auto=format&fit=crop&w=600&q=80',
    alt: 'Gold Jhumkas',
    caption: 'Every detail engraved with timeless devotion #HandcraftedJewelry',
  },
  {
    id: 5,
    imageUrl: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=600&q=80',
    alt: 'Traditional Temple Jewelry',
    caption: 'Celebrating sacred traditions in gold #FestiveJewelry',
  },
  {
    id: 6,
    imageUrl: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80',
    alt: 'Polki Diamond Choker',
    caption: 'A touch of shimmer for life’s grandest celebrations #SuyogElegance',
  },
];

const Home = () => {
  const { banners, loading: bannersLoading } = useBanners();
  const { categories, loading: categoriesLoading } = useCategories();
  const { products: featured, loading: featuredLoading } = useProducts({ featured: true, limit: 8 });
  const { products: newArrivals, loading: newLoading } = useProducts({ newArrivals: true, limit: 8 });

  const instagramUrl = import.meta.env.VITE_INSTAGRAM_URL || 'https://instagram.com';

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
  };

  return (
    <div className="bg-cream-50">
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
      <section className="relative w-full h-[60vh] md:h-[85vh] bg-dark">
        {bannersLoading && banners.length === 0 ? (
          <div className="w-full h-full skeleton"></div>
        ) : banners.length > 0 ? (
          <Swiper
            modules={[Autoplay, Pagination, Navigation, EffectFade]}
            effect="fade"
            speed={1000}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            navigation
            className="w-full h-full"
          >
            {banners.map((banner) => (
              <SwiperSlide key={banner._id}>
                <div className="relative w-full h-full">
                  <img
                    src={banner.image.url}
                    alt={banner.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40"></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                    <motion.h2
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className="font-heading text-4xl md:text-6xl lg:text-7xl text-white font-bold mb-4 drop-shadow-md"
                    >
                      {banner.title}
                    </motion.h2>
                    {banner.subtitle && (
                      <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="font-body text-lg md:text-xl text-cream-100 mb-8 max-w-2xl drop-shadow-md"
                      >
                        {banner.subtitle}
                      </motion.p>
                    )}
                    {banner.link && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                      >
                        <Link
                          to={banner.link}
                          className="bg-gold-500 text-dark font-medium uppercase tracking-wider px-8 py-3 rounded hover:bg-white transition-colors"
                        >
                          {banner.buttonText || 'Explore Collection'}
                        </Link>
                      </motion.div>
                    )}
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-white bg-dark">
            <h2 className="font-heading text-4xl md:text-6xl text-gold-400 mb-4">Welcome to Suyog Jewelry</h2>
            <Link to="/products" className="bg-gold-500 text-dark px-8 py-3 mt-4 rounded uppercase font-medium">
              Shop Now
            </Link>
          </div>
        )}
      </section>

      {/* Categories */}
      <section className="py-16 md:py-24 container mx-auto px-4 md:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={fadeInUp}
          className="text-center mb-12"
        >
          <h2 className="font-heading text-3xl md:text-4xl text-dark mb-4">Shop by Category</h2>
          <div className="w-24 h-1 bg-gold-400 mx-auto"></div>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {categoriesLoading && categories.length === 0 ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="aspect-square skeleton rounded-full md:rounded-lg"></div>
            ))
          ) : (
            categories.map((cat, index) => (
              <motion.div
                key={cat._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link to={`/products?category=${cat._id}`} className="group block text-center">
                  <div className="overflow-hidden rounded-full md:rounded-lg aspect-square mb-4 bg-cream-100 shadow-sm transition-transform duration-300 group-hover:-translate-y-2 group-hover:shadow-md">
                    <img
                      src={cat.image?.url || '/placeholder.jpg'}
                      alt={cat.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                  </div>
                  <h3 className="font-heading text-lg md:text-xl text-dark group-hover:text-gold-700 transition-colors">
                    {cat.name}
                  </h3>
                </Link>
              </motion.div>
            ))
          )}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white border-y border-cream-200">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="flex justify-between items-end mb-10"
          >
            <div>
              <h2 className="font-heading text-3xl md:text-4xl text-dark mb-4">Featured Masterpieces</h2>
              <div className="w-24 h-1 bg-gold-400"></div>
            </div>
            <Link
              to="/products?featured=true"
              className="hidden md:inline-block text-gold-700 font-medium hover:text-dark uppercase tracking-wide text-sm underline underline-offset-4"
            >
              View All
            </Link>
          </motion.div>

          {featuredLoading && featured.length === 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : featured.length > 0 ? (
            <>
              <div className="hidden md:grid grid-cols-3 lg:grid-cols-4 gap-6">
                {featured.slice(0, 4).map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
              <div className="md:hidden">
                <Swiper slidesPerView={1.2} spaceBetween={16}>
                  {featured.map((product) => (
                    <SwiperSlide key={product._id}>
                      <ProductCard product={product} />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </>
          ) : (
            <p className="text-center text-gray-warm py-8">No featured products currently available.</p>
          )}

          <div className="mt-8 text-center md:hidden">
            <Link
              to="/products?featured=true"
              className="inline-block border border-gold-500 text-gold-700 px-6 py-2 rounded font-medium hover:bg-gold-500 hover:text-white transition-colors"
            >
              View All Featured
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us Strip */}
      <section className="py-12 bg-maroon-900 text-cream-50">
        <div className="container mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
            <div className="text-gold-400 text-4xl mb-4 flex justify-center">✧</div>
            <h3 className="font-heading text-xl mb-2">Authentic Craftsmanship</h3>
            <p className="font-body text-sm text-cream-200">
              Every piece is handcrafted by master artisans with decades of experience.
            </p>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ delay: 0.2 }}
          >
            <div className="text-gold-400 text-4xl mb-4 flex justify-center">✦</div>
            <h3 className="font-heading text-xl mb-2">Certified Purity</h3>
            <p className="font-body text-sm text-cream-200">
              100% hallmarked gold and certified diamonds for your peace of mind.
            </p>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ delay: 0.4 }}
          >
            <div className="text-gold-400 text-4xl mb-4 flex justify-center">✧</div>
            <h3 className="font-heading text-xl mb-2">Personalized Service</h3>
            <p className="font-body text-sm text-cream-200">
              Custom designs and dedicated assistance via WhatsApp to help you choose perfectly.
            </p>
          </motion.div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-16 md:py-24 container mx-auto px-4 md:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="flex justify-between items-end mb-10"
        >
          <div>
            <h2 className="font-heading text-3xl md:text-4xl text-dark mb-4">New Arrivals</h2>
            <div className="w-24 h-1 bg-gold-400"></div>
          </div>
          <Link
            to="/products?newArrivals=true"
            className="hidden md:inline-block text-gold-700 font-medium hover:text-dark uppercase tracking-wide text-sm underline underline-offset-4"
          >
            View All
          </Link>
        </motion.div>

        {newLoading && newArrivals.length === 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : newArrivals.length > 0 ? (
          <>
            <div className="hidden md:grid grid-cols-3 lg:grid-cols-4 gap-6">
              {newArrivals.slice(0, 4).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
            <div className="md:hidden">
              <Swiper slidesPerView={1.2} spaceBetween={16}>
                {newArrivals.map((product) => (
                  <SwiperSlide key={product._id}>
                    <ProductCard product={product} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </>
        ) : (
          <p className="text-center text-gray-warm py-8">No new arrivals currently available.</p>
        )}
      </section>

      {/* Testimonials Slider */}
      <section className="py-16 md:py-24 bg-cream-100 border-t border-cream-200 overflow-hidden">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-12"
          >
            <span className="text-gold-700 uppercase tracking-widest text-xs font-semibold">Kind Words</span>
            <h2 className="font-heading text-3xl md:text-4xl text-dark mt-2 mb-4">What Our Clients Say</h2>
            <div className="w-24 h-1 bg-gold-400 mx-auto"></div>
          </motion.div>

          <Swiper
            modules={[Autoplay, Pagination]}
            autoplay={{ delay: 6000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            spaceBetween={24}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="pb-12"
          >
            {testimonials.map((item) => (
              <SwiperSlide key={item.id} className="h-auto">
                <div className="bg-white p-8 rounded-xl border border-cream-200 shadow-sm flex flex-col justify-between h-full hover:shadow-md transition-shadow">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex text-gold-500 gap-1">
                        {Array.from({ length: item.rating }).map((_, i) => (
                          <FaStar key={i} size={14} />
                        ))}
                      </div>
                      <FaQuoteLeft className="text-gold-300" size={20} />
                    </div>
                    <p className="font-body text-gray-warm text-sm leading-relaxed mb-6 italic">
                      "{item.review}"
                    </p>
                  </div>
                  <div className="border-t border-cream-100 pt-4 mt-auto">
                    <h4 className="font-heading text-base font-semibold text-dark">{item.name}</h4>
                    <p className="text-xs text-gray-warm flex items-center justify-between mt-1">
                      <span>{item.city}</span>
                      <span className="text-gold-700 font-medium">{item.tag}</span>
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* Instagram Gallery Grid */}
      <section className="py-16 md:py-24 bg-white border-t border-cream-200">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-2 text-gold-700 mb-2">
              <FaInstagram size={20} />
              <span className="uppercase tracking-widest text-xs font-semibold">@suyogjewelry</span>
            </div>
            <h2 className="font-heading text-3xl md:text-4xl text-dark mb-4">Follow Our Journey</h2>
            <p className="text-gray-warm max-w-lg mx-auto text-sm">
              Discover everyday bridal inspiration, behind-the-scenes artistry, and new handcrafted arrivals on our official Instagram.
            </p>
            <div className="w-24 h-1 bg-gold-400 mx-auto mt-4"></div>
          </motion.div>

          {/* 6-Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
            {instagramPosts.map((post) => (
              <a
                key={post.id}
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative aspect-square overflow-hidden rounded-lg bg-cream-100 block"
              >
                <img
                  src={post.imageUrl}
                  alt={post.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-dark/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-3 text-center text-white">
                  <FaInstagram size={24} className="text-gold-400 mb-2 transform -translate-y-2 group-hover:translate-y-0 transition-transform duration-300" />
                  <span className="text-[11px] text-cream-100 line-clamp-2 leading-snug">
                    {post.caption}
                  </span>
                </div>
              </a>
            ))}
          </div>

          <div className="text-center mt-10">
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-dark hover:bg-gold-600 text-white px-8 py-3 rounded-full text-xs uppercase tracking-widest font-medium transition-colors shadow-sm"
            >
              <FaInstagram size={16} />
              <span>Follow on Instagram</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
