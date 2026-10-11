import React from 'react';
import { Helmet } from 'react-helmet-async';
import { FiFileText } from 'react-icons/fi';

const Terms = () => {
  return (
    <div className="bg-white min-h-screen py-16 md:py-24 lg:py-28">
      <Helmet>
        <title>Terms of Service - Suyog Jewelry</title>
        <meta
          name="description"
          content="Review the terms and conditions governing purchases, bullion pricing, and custom orders with Suyog Jewelry."
        />
        <meta property="og:title" content="Terms of Service - Suyog Jewelry" />
        <meta
          property="og:description"
          content="Terms and conditions for Suyog Jewelry catalog and services."
        />
      </Helmet>

      <div className="max-w-4xl mx-auto px-5 md:px-8">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center justify-center w-12 h-12 border border-[#E5E5E5] bg-[#F7F7F7] text-[#111111] mb-5">
            <FiFileText size={20} />
          </div>
          <span className="block text-[11px] font-medium uppercase tracking-[0.25em] text-[#6B6B6B] mb-2">
            Client Agreement
          </span>
          <h1 className="font-heading text-3xl md:text-5xl font-normal text-[#111111] tracking-tight mb-4">
            Terms of Service
          </h1>
          <div className="w-12 h-px bg-[#111111] mx-auto mb-4"></div>
          <p className="text-sm md:text-base text-[#6B6B6B] font-light max-w-xl mx-auto">
            Please review our business terms for purchasing fine jewelry, custom commissions, and precious metal rates.
          </p>
        </div>

        {/* Content Box */}
        <div className="bg-[#F7F7F7] border border-[#E5E5E5] p-6 md:p-12 space-y-10 text-[#6B6B6B] leading-relaxed">
          
          <section>
            <h2 className="font-heading text-xl md:text-2xl text-[#111111] font-normal tracking-tight mb-4">
              1. Precious Metal Pricing & Daily Bullion Rates
            </h2>
            <p className="text-sm md:text-base mb-4 font-light text-[#111111]">
              Due to daily market variations in gold and precious metal spot prices, catalog figures represent indicative reference pricing and will be formally locked in upon proforma confirmation on WhatsApp or in our boutique.
            </p>
            <p className="text-sm md:text-base font-light">
              Final invoiced amounts are calculated transparently using exact finished net gold weight, live bullion rate at booking time, artisanal making charges, and statutory GST.
            </p>
          </section>

          <hr className="border-[#E5E5E5]" />

          <section>
            <h2 className="font-heading text-xl md:text-2xl text-[#111111] font-normal tracking-tight mb-4">
              2. Handcrafted Variations & Artisanal Nuances
            </h2>
            <p className="text-sm md:text-base font-light">
              Each piece of heirloom jewelry is individually handcrafted by master karigars. Micro-nuances in prong settings, hand engraving, and minor weight variances (±3% to 5%) are natural hallmarks of bespoke hand craftsmanship that lend each creation singular character.
            </p>
          </section>

          <hr className="border-[#E5E5E5]" />

          <section>
            <h2 className="font-heading text-xl md:text-2xl text-[#111111] font-normal tracking-tight mb-4">
              3. Intellectual Property Rights
            </h2>
            <p className="text-sm md:text-base font-light">
              All bespoke jewelry silhouettes, CAD renders, photography, editorial imagery, brand trademarks, and textual content on this website are the sole property of Suyog Jewelry. Unauthorized commercial reproduction or publication is strictly prohibited.
            </p>
          </section>

          <hr className="border-[#E5E5E5]" />

          <section>
            <h2 className="font-heading text-xl md:text-2xl text-[#111111] font-normal tracking-tight mb-4">
              4. Governing Law & Legal Jurisdiction
            </h2>
            <p className="text-sm md:text-base font-light">
              These terms are governed by and construed under the legal statutes of the Republic of India. Any claims or proceedings arising out of transactions with Suyog Jewelry are subject to the exclusive jurisdiction of the competent courts in Mumbai, Maharashtra.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
};

export default Terms;
