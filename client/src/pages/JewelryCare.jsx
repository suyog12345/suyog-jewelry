import React from 'react';
import { Helmet } from 'react-helmet-async';
import { FiCheck, FiX, FiAward } from 'react-icons/fi';

const JewelryCare = () => {
  return (
    <div className="bg-white min-h-screen py-16 md:py-24 lg:py-32">
      <Helmet>
        <title>Jewelry Care Guide - Suyog Jewelry</title>
        <meta
          name="description"
          content="Expert tips and best practices for cleaning, preserving, and storing your gold, diamond, kundan, and precious gemstone jewelry."
        />
      </Helmet>

      <div className="max-w-4xl mx-auto px-5 md:px-8">
        {/* Header */}
        <div className="text-center mb-14 md:mb-20">
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#6B6B6B] font-medium block mb-2">
            Preservation & Maintenance
          </span>
          <h1 className="font-heading text-4xl md:text-6xl text-[#111111] font-light mb-4">
            Jewelry Care Guide
          </h1>
          <p className="text-[#6B6B6B] text-xs md:text-sm max-w-lg mx-auto leading-relaxed font-light">
            Fine handcrafted jewelry is an heirloom crafted to endure for generations. Here is how to maintain eternal brilliance.
          </p>
        </div>

        {/* Content */}
        <div className="space-y-12">

          {/* Dos & Don'ts Summary Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            <div className="bg-white border border-[#E5E5E5] p-8 md:p-10">
              <div className="flex items-center gap-2 text-[#111111] font-heading text-xl mb-6 pb-3 border-b border-[#E5E5E5]">
                <FiCheck className="stroke-[2]" size={18} />
                <span className="font-light">The Essentials (Do's)</span>
              </div>
              <ul className="space-y-4 text-xs text-[#6B6B6B] font-light leading-relaxed">
                <li className="flex items-start gap-3">
                  <span className="text-[#111111] font-medium">✦</span>
                  <span>Put your jewelry on <strong>last</strong>, after perfumes, body lotions, hairsprays, and cosmetics have completely dried.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#111111] font-medium">✦</span>
                  <span>Store each piece individually in soft fabric-lined pouches or velvet boxes to avoid mutual scratching.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#111111] font-medium">✦</span>
                  <span>Wipe gently with a lint-free microfiber cloth after every wear to remove natural skin oils and moisture.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#111111] font-medium">✦</span>
                  <span>Bring your jewelry to our boutique annually for complimentary ultrasonic cleaning and prong inspection.</span>
                </li>
              </ul>
            </div>

            <div className="bg-white border border-[#E5E5E5] p-8 md:p-10">
              <div className="flex items-center gap-2 text-[#111111] font-heading text-xl mb-6 pb-3 border-b border-[#E5E5E5]">
                <FiX className="stroke-[2]" size={18} />
                <span className="font-light">What to Avoid (Don'ts)</span>
              </div>
              <ul className="space-y-4 text-xs text-[#6B6B6B] font-light leading-relaxed">
                <li className="flex items-start gap-3">
                  <span className="text-[#111111] font-medium">&times;</span>
                  <span>Never wear jewelry while swimming in chlorinated pools, applying bleaching agents, or doing heavy housework.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#111111] font-medium">&times;</span>
                  <span>Do not immerse Kundan, Polki, or Pearl jewelry in water. Moisture compromises the lacquer (laac) and silver foil backing.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#111111] font-medium">&times;</span>
                  <span>Never use abrasive chemicals, toothpaste, or stiff brushes on high-karat gold or soft gemstones.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#111111] font-medium">&times;</span>
                  <span>Avoid exposing gemstones to extreme temperature shocks or direct prolonged sun heating.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Material Specific Guidance */}
          <div className="border border-[#E5E5E5] p-8 md:p-12 space-y-10">
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#6B6B6B] font-medium block mb-2">
                Precious Materials
              </span>
              <h2 className="font-heading text-2xl md:text-3xl text-[#111111] font-light">
                Material-Specific Care
              </h2>
            </div>

            {/* Gold */}
            <div className="border-l-2 border-[#111111] pl-5 py-1">
              <h3 className="font-heading text-lg font-normal text-[#111111] mb-2">22K & 18K Hallmarked Gold</h3>
              <p className="text-[#6B6B6B] text-xs leading-relaxed font-light">
                Because 22K gold is naturally soft and rich in pure gold content, treat chains and delicate filigree with gentle care. For light cleaning at home, soak in lukewarm water with a drop of mild neutral detergent for 5 minutes, pat gently with a soft cotton cloth, and air-dry thoroughly before storing.
              </p>
            </div>

            {/* Diamonds */}
            <div className="border-l-2 border-[#111111] pl-5 py-1">
              <h3 className="font-heading text-lg font-normal text-[#111111] mb-2">Natural Certified Diamonds</h3>
              <p className="text-[#6B6B6B] text-xs leading-relaxed font-light">
                Diamonds attract natural oils which can dim their brilliance over time. Clean using a soft baby toothbrush dipped in warm soapy water, brushing gently under the pavilion and around the prong setting to remove accumulated lotions or dust.
              </p>
            </div>

            {/* Kundan & Polki */}
            <div className="border-l-2 border-[#111111] pl-5 py-1">
              <h3 className="font-heading text-lg font-normal text-[#111111] mb-2">Kundan, Polki & Antique Enamel (Meenakari)</h3>
              <p className="text-[#6B6B6B] text-xs leading-relaxed font-light">
                Traditional Kundan and Jadau ornaments are crafted with natural lac and pure gold foils that must remain completely dry. Clean only with a dry, clean cosmetic brush or soft microfiber cloth. Store wrapped in acid-free tissue paper or plastic zip pouches with silica gel sachets to prevent moisture oxidation.
              </p>
            </div>
          </div>

          {/* Complimentary Boutique Service */}
          <div className="bg-[#0D0D0D] text-white p-8 md:p-12 border border-[#1F1F1F] text-center">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#9E9E9E] font-medium block mb-2">
              Lifetime Maison Privilege
            </span>
            <h3 className="font-heading text-2xl md:text-3xl font-light text-white mb-3">
              Complimentary Lifetime Cleaning & Inspection
            </h3>
            <p className="text-[#9E9E9E] text-xs max-w-md mx-auto mb-6 font-light leading-relaxed">
              All patrons of Suyog Jewelry are entitled to free lifelong ultrasonic jewelry cleaning, gemstone prong tightening, and polish checks at our boutique.
            </p>
            <span className="inline-block border border-[#333333] px-6 py-2.5 text-[11px] uppercase tracking-[0.2em] text-white">
              Available during boutique hours
            </span>
          </div>

        </div>
      </div>
    </div>
  );
};

export default JewelryCare;
