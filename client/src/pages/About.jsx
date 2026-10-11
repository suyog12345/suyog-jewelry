import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { formatDisplayPhone } from '../utils';

const About = () => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 25 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <div className="bg-white min-h-screen">
      <Helmet>
        <title>About Us - Suyog Jewelry</title>
        <meta name="description" content="Learn about Suyog Jewelry, our heritage, craftsmanship, and commitment to purity in every piece we create." />
      </Helmet>

      {/* Hero Header */}
      <section className="relative py-20 md:py-28 lg:py-36 bg-[#0D0D0D] text-white flex items-center justify-center border-b border-[#1F1F1F]">
        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-[11px] md:text-xs uppercase tracking-[0.3em] text-[#9E9E9E] font-medium block mb-3"
          >
            Generational Heritage
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-heading text-4xl md:text-6xl lg:text-7xl text-white font-light tracking-tight mb-4"
          >
            The Maison Story
          </motion.h1>
          <div className="w-12 h-px bg-[#333333] mx-auto mt-6"></div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 md:py-24 lg:py-32 max-w-7xl mx-auto px-5 md:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="space-y-6"
          >
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#6B6B6B] font-medium block">
              Purity & Trust
            </span>
            <h2 className="font-heading text-3xl md:text-5xl text-[#111111] font-light leading-tight">
              A Legacy Built on Purity & Enduring Artistry
            </h2>
            <p className="font-body text-xs md:text-sm text-[#6B6B6B] leading-relaxed">
              Founded with a commitment to honor life's most cherished milestones, Suyog Jewelry stands as an icon of integrity and uncompromising craft. We consider fine jewelry not merely an adornment, but an intimate heirloom passed across generations.
            </p>
            <p className="font-body text-xs md:text-sm text-[#6B6B6B] leading-relaxed">
              Our journey originated in an intimate workshop where master goldsmiths poured passion into every intricate facet. While our reach has flourished, our founding ethos remains steadfast: unwavering gold purity, absolute pricing transparency, and designs marrying ancient Indian heritage with sleek modern luxury.
            </p>
          </motion.div>
          {/* <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative aspect-[4/3] md:aspect-[4/5] border border-[#E5E5E5] bg-[#F7F7F7] overflow-hidden"
          >
            <img src="/placeholder.jpg" alt="Craftsmanship" loading="lazy" className="w-full h-full object-cover grayscale contrast-105" />
          </motion.div> */}
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 md:py-24 lg:py-32 bg-[#F7F7F7] border-y border-[#E5E5E5]">
        <div className="max-w-7xl mx-auto px-5 md:px-8 lg:px-12">
          <div className="text-center mb-14 md:mb-20">
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#6B6B6B] font-medium block mb-2">
              Our Guiding Principles
            </span>
            <h2 className="font-heading text-3xl md:text-5xl text-[#111111] font-light">
              Pillars of Excellence
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {[
              { title: 'Authenticity', desc: '100% BIS hallmark certified gold and conflict-free certified precious gemstones.', icon: '✧' },
              { title: 'Master Craftsmanship', desc: 'Hand-sculpted by veteran artisans preserving centuries-old jewelry techniques.', icon: '✦' },
              { title: 'Transparent Integrity', desc: 'Uncompromised pricing with exact breakdowns of precious metal weight, stones, and making charges.', icon: '✧' }
            ].map((value, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                transition={{ delay: i * 0.15 }}
                className="bg-white p-8 md:p-10 border border-[#E5E5E5] text-center transition-all duration-300 hover:border-[#111111]"
              >
                <div className="text-2xl text-[#111111] mb-5 font-serif">{value.icon}</div>
                <h3 className="font-heading text-xl text-[#111111] mb-3 font-normal">{value.title}</h3>
                <p className="text-[#6B6B6B] text-xs leading-relaxed font-light">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Store Visit Section */}
      <section className="py-16 md:py-24 lg:py-32 max-w-7xl mx-auto px-5 md:px-8 lg:px-12 text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="max-w-2xl mx-auto"
        >
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#6B6B6B] font-medium block mb-2">
            Private Viewings
          </span>
          <h2 className="font-heading text-3xl md:text-5xl text-[#111111] font-light mb-6">
            Experience in Person
          </h2>
          <p className="text-[#6B6B6B] text-xs md:text-sm leading-relaxed mb-10 font-light">
            While our digital archive offers an intimate look at our collections, the true weight of the gold and brilliance of the stones is best appreciated in person. We invite you to visit our Indore boutique.
          </p>

          <div className="bg-[#F7F7F7] p-8 md:p-10 border border-[#E5E5E5] text-left max-w-lg mx-auto">
            <h3 className="font-heading text-xl text-[#111111] mb-4 uppercase tracking-[0.15em] font-light">
              Suyog Jewelry Boutique
            </h3>
            <div className="space-y-3 text-xs text-[#6B6B6B] leading-relaxed">
              <p><strong className="text-[#111111] uppercase tracking-wider block mb-0.5">Address</strong> Tilak Path, near Rajwada
                Indore, Madhya Pradesh -452007</p>
              <p><strong className="text-[#111111] uppercase tracking-wider block mb-0.5">Hours</strong> Mon &ndash; Sat: 10:30 AM &ndash; 8:30 PM (Sunday Closed)</p>
              <p><strong className="text-[#111111] uppercase tracking-wider block mb-0.5">Concierge</strong> {formatDisplayPhone()}</p>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default About;
