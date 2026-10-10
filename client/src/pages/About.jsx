import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { formatDisplayPhone } from '../utils';

const About = () => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="bg-cream-50 min-h-screen">
      <Helmet>
        <title>About Us - Suyog Jewelry</title>
        <meta name="description" content="Learn about Suyog Jewelry, our heritage, craftsmanship, and commitment to purity in every piece we create." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative h-[40vh] md:h-[50vh] bg-dark flex items-center justify-center">
        <div className="absolute inset-0 bg-[url('/placeholder.jpg')] bg-cover bg-center opacity-40"></div>
        <div className="absolute inset-0 bg-dark/60"></div>
        <div className="relative z-10 text-center px-4">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-heading text-4xl md:text-6xl text-gold-400 font-bold mb-4 tracking-wide"
          >
            Our Heritage
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="w-24 h-1 bg-gold-500 mx-auto"
          ></motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 md:py-24 container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="space-y-6"
          >
            <h2 className="font-heading text-3xl md:text-4xl text-dark">A Legacy of Purity & Trust</h2>
            <p className="font-body text-gray-warm leading-relaxed">
              Founded with a vision to celebrate life's most precious moments, Suyog Jewelry has been a symbol of trust and exceptional craftsmanship. We believe that jewelry is more than just an accessory; it is an emotion, a heritage passed down through generations.
            </p>
            <p className="font-body text-gray-warm leading-relaxed">
              Our journey began in a small workshop where master artisans poured their soul into every design. Today, while we have grown, our commitment remains the same: offering unparalleled purity, transparent pricing, and designs that blend traditional Indian artistry with contemporary aesthetics.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative h-96 rounded-xl overflow-hidden shadow-xl"
          >
            <img src="/placeholder.jpg" alt="Craftsmanship" className="w-full h-full object-cover" />
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-white border-y border-cream-200">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl text-dark mb-4">Our Values</h2>
            <div className="w-16 h-1 bg-gold-400 mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Authenticity', desc: '100% hallmark certified gold and conflict-free certified diamonds.', icon: '✧' },
              { title: 'Craftsmanship', desc: 'Handcrafted by artisans preserving centuries-old jewelry making techniques.', icon: '✦' },
              { title: 'Transparency', desc: 'Clear pricing with complete breakdown of gold rate, making charges, and taxes.', icon: '✧' }
            ].map((value, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                transition={{ delay: i * 0.2 }}
                className="bg-cream-50 p-8 rounded-xl text-center border border-cream-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-4xl text-gold-500 mb-4">{value.icon}</div>
                <h3 className="font-heading text-xl text-dark mb-3">{value.title}</h3>
                <p className="text-gray-warm text-sm">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Store Visit Section */}
      <section className="py-16 md:py-24 container mx-auto px-4 md:px-8 text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="max-w-3xl mx-auto"
        >
          <h2 className="font-heading text-3xl md:text-4xl text-dark mb-6">Experience it in Person</h2>
          <p className="text-gray-warm mb-8">
            While our digital catalog offers a glimpse into our collection, the true beauty of our jewelry is best experienced in person. Visit our store to feel the weight of the gold, the brilliance of the diamonds, and the warmth of our hospitality.
          </p>

          <div className="bg-white p-8 rounded-xl shadow-sm inline-block text-left border border-cream-200">
            <h3 className="font-heading text-xl text-gold-700 mb-4 uppercase tracking-wider">Suyog Jewelry Boutique</h3>
            <p className="text-dark mb-2"><strong>Address:</strong> 123 Main Bazaar Road, Jewelry District, Mumbai 400002</p>
            <p className="text-dark mb-2"><strong>Hours:</strong> Mon - Sat: 10:30 AM - 8:30 PM (Sunday Closed)</p>
            <p className="text-dark"><strong>Phone:</strong> {formatDisplayPhone()}</p>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default About;
