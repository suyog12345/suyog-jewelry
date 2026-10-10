import React from 'react';
import { Helmet } from 'react-helmet-async';
import { FiCheck, FiX, FiAward, FiSun, FiDroplet } from 'react-icons/fi';

const JewelryCare = () => {
  return (
    <div className="bg-cream-50 min-h-screen py-12 md:py-20">
      <Helmet>
        <title>Jewelry Care Guide - Suyog Jewelry</title>
        <meta
          name="description"
          content="Expert tips and best practices for cleaning, preserving, and storing your gold, diamond, kundan, and precious gemstone jewelry."
        />
        <meta property="og:title" content="Jewelry Care Guide - Suyog Jewelry" />
        <meta
          property="og:description"
          content="Expert tips and best practices for cleaning, preserving, and storing fine jewelry from Suyog Jewelry."
        />
      </Helmet>

      <div className="container mx-auto px-4 md:px-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gold-100 text-gold-700 mb-4">
            <FiAward size={24} />
          </div>
          <h1 className="font-heading text-3xl md:text-5xl text-dark mb-4">Jewelry Care Guide</h1>
          <div className="w-24 h-1 bg-gold-400 mx-auto mb-4"></div>
          <p className="text-gray-warm text-sm md:text-base max-w-xl mx-auto">
            Fine handcrafted jewelry is an heirloom meant to be cherished for generations. Here is how to keep your pieces radiant.
          </p>
        </div>

        {/* Content */}
        <div className="space-y-8">

          {/* Dos & Don'ts Summary Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-emerald-100 p-6 md:p-8">
              <div className="flex items-center gap-2 text-emerald-700 font-heading text-xl mb-4">
                <FiCheck className="stroke-[3]" size={22} />
                <span>The Essentials (Do's)</span>
              </div>
              <ul className="space-y-3 text-sm text-gray-warm">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Put your jewelry on <strong>last</strong>, after perfumes, body lotions, hairsprays, and cosmetics have completely dried.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Store each piece individually in soft fabric-lined pouches or velvet boxes to avoid mutual scratching.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Wipe gently with a lint-free microfiber cloth after every wear to remove natural skin oils and moisture.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Bring your jewelry to our boutique once a year for complimentary ultrasonic cleaning and prong inspection.</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-rose-100 p-6 md:p-8">
              <div className="flex items-center gap-2 text-rose-700 font-heading text-xl mb-4">
                <FiX className="stroke-[3]" size={22} />
                <span>What to Avoid (Don'ts)</span>
              </div>
              <ul className="space-y-3 text-sm text-gray-warm">
                <li className="flex items-start gap-2">
                  <span className="text-rose-600 font-bold">✕</span>
                  <span>Never wear jewelry while swimming in chlorinated pools, applying bleaching agents, or doing heavy housework.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-600 font-bold">✕</span>
                  <span>Do not immerse Kundan, Polki, or Pearl jewelry in water. Moisture compromises the lacquer (laac) and silver foil backing.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-600 font-bold">✕</span>
                  <span>Never use abrasive chemicals, toothpaste, or stiff brushes on high-karat gold or soft gemstones.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-600 font-bold">✕</span>
                  <span>Avoid exposing gemstones to extreme temperature shocks or direct prolonged sun heating.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Material Specific Guidance */}
          <div className="bg-white rounded-xl shadow-sm border border-cream-200 p-6 md:p-10 space-y-8">
            <h2 className="font-heading text-2xl md:text-3xl text-dark">Material-Specific Care</h2>

            {/* Gold */}
            <div className="border-l-4 border-gold-500 pl-4 py-1">
              <h3 className="font-heading text-lg font-semibold text-dark mb-1">22K & 18K Hallmarked Gold</h3>
              <p className="text-gray-warm text-sm leading-relaxed">
                Because 22K gold is naturally soft and rich in pure gold content, treat chains and delicate filigree with gentle care. For light cleaning at home, soak in lukewarm water with a drop of mild neutral detergent for 5 minutes, pat gently with a soft cotton cloth, and air-dry thoroughly before storing.
              </p>
            </div>

            {/* Diamonds */}
            <div className="border-l-4 border-cyan-500 pl-4 py-1">
              <h3 className="font-heading text-lg font-semibold text-dark mb-1">Natural Certified Diamonds</h3>
              <p className="text-gray-warm text-sm leading-relaxed">
                Diamonds attract natural oils which can dim their brilliance over time. Clean using a soft baby toothbrush dipped in warm soapy water, brushing gently under the pavilion and around the prong setting to remove accumulated lotions or dust.
              </p>
            </div>

            {/* Kundan & Polki */}
            <div className="border-l-4 border-maroon-700 pl-4 py-1">
              <h3 className="font-heading text-lg font-semibold text-dark mb-1">Kundan, Polki & Antique Enamel (Meenakari)</h3>
              <p className="text-gray-warm text-sm leading-relaxed">
                Traditional Kundan and Jadau ornaments are crafted with natural lac and pure gold foils that must remain completely dry. Clean only with a dry, clean cosmetic brush or soft microfiber cloth. Store wrapped in acid-free tissue paper or plastic zip pouches with silica gel sachets to prevent moisture oxidation.
              </p>
            </div>
          </div>

          {/* Complimentary Boutique Service */}
          <div className="bg-cream-100 rounded-xl p-8 border border-cream-200 text-center">
            <h3 className="font-heading text-xl md:text-2xl text-dark mb-2">Complimentary Lifetime Cleaning & Inspection</h3>
            <p className="text-gray-warm text-sm max-w-lg mx-auto mb-4">
              All patrons of Suyog Jewelry are entitled to free lifelong ultrasonic jewelry cleaning, gemstone prong tightening, and polish checks at our boutique.
            </p>
            <span className="text-xs uppercase tracking-widest text-gold-700 font-semibold">
              Visit our boutique anytime during business hours
            </span>
          </div>

        </div>
      </div>
    </div>
  );
};

export default JewelryCare;
