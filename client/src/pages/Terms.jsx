import React from 'react';
import { Helmet } from 'react-helmet-async';
import { FiFileText } from 'react-icons/fi';

const Terms = () => {
  return (
    <div className="bg-cream-50 min-h-screen py-12 md:py-20">
      <Helmet>
        <title>Terms of Service - Suyog Jewelry</title>
        <meta
          name="description"
          content="Review the terms and conditions governing purchases, pricing, and custom orders with Suyog Jewelry."
        />
        <meta property="og:title" content="Terms of Service - Suyog Jewelry" />
        <meta
          property="og:description"
          content="Terms and conditions for Suyog Jewelry catalog and services."
        />
      </Helmet>

      <div className="container mx-auto px-4 md:px-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gold-100 text-gold-700 mb-4">
            <FiFileText size={24} />
          </div>
          <h1 className="font-heading text-3xl md:text-5xl text-dark mb-4">Terms of Service</h1>
          <div className="w-24 h-1 bg-gold-400 mx-auto mb-4"></div>
          <p className="text-gray-warm text-sm md:text-base max-w-xl mx-auto">
            Please review our business terms for purchasing fine jewelry, custom orders, and gold rate confirmations.
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-sm border border-cream-200 p-6 md:p-10 space-y-8 text-gray-warm leading-relaxed">
          
          <section>
            <h2 className="font-heading text-xl md:text-2xl text-dark font-bold mb-3">1. Bullion Pricing & Fluctuations</h2>
            <p className="text-sm md:text-base mb-3">
              Due to daily market fluctuations in gold and precious metal spot prices, catalog prices are indicative and will be locked in upon formal proforma invoice confirmation on WhatsApp or in-store.
            </p>
            <p className="text-sm md:text-base">
              The final price is determined based on the exact net gold weight of the finished handcrafted piece, prevailing bullion market rates on the booking date, making charges, and applicable statutory taxes (GST).
            </p>
          </section>

          <hr className="border-cream-200" />

          <section>
            <h2 className="font-heading text-xl md:text-2xl text-dark font-bold mb-3">2. Handcrafted Variations</h2>
            <p className="text-sm md:text-base">
              Each piece of artisanal jewelry is handcrafted by master artisans. Subtle nuances in stone settings, hand engraving, and minor weight differences (±3% to 5%) are inherent characteristics of handmade jewelry that give each heirloom its individual uniqueness.
            </p>
          </section>

          <hr className="border-cream-200" />

          <section>
            <h2 className="font-heading text-xl md:text-2xl text-dark font-bold mb-3">3. Intellectual Property</h2>
            <p className="text-sm md:text-base">
              All jewelry designs, photographs, brand logos, and written descriptions on this website are the proprietary intellectual property of Suyog Jewelry. Unauthorized reproduction or commercial use is strictly prohibited.
            </p>
          </section>

          <hr className="border-cream-200" />

          <section>
            <h2 className="font-heading text-xl md:text-2xl text-dark font-bold mb-3">4. Governing Law & Jurisdiction</h2>
            <p className="text-sm md:text-base">
              These terms shall be governed by and construed in accordance with the laws of the Republic of India. Any disputes arising from transactions with Suyog Jewelry are subject to the exclusive jurisdiction of the competent courts in Mumbai, Maharashtra.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
};

export default Terms;
