import React from 'react';
import { Helmet } from 'react-helmet-async';
import { FiRefreshCw, FiShield, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { formatDisplayPhone } from '../utils';

const ReturnPolicy = () => {
  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '';

  return (
    <div className="bg-cream-50 min-h-screen py-12 md:py-20">
      <Helmet>
        <title>Return & Exchange Policy - Suyog Jewelry</title>
        <meta
          name="description"
          content="Learn about Suyog Jewelry's transparent Return, Lifetime Exchange, and Buyback policies for gold and certified diamond jewelry."
        />
        <meta property="og:title" content="Return & Exchange Policy - Suyog Jewelry" />
        <meta
          property="og:description"
          content="Learn about Suyog Jewelry's transparent Return, Lifetime Exchange, and Buyback policies."
        />
      </Helmet>

      <div className="container mx-auto px-4 md:px-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gold-100 text-gold-700 mb-4">
            <FiRefreshCw size={24} />
          </div>
          <h1 className="font-heading text-3xl md:text-5xl text-dark mb-4">Return & Exchange Policy</h1>
          <div className="w-24 h-1 bg-gold-400 mx-auto mb-4"></div>
          <p className="text-gray-warm text-sm md:text-base max-w-xl mx-auto">
            Our commitment to purity, trust, and transparency is at the core of everything we create.
          </p>
        </div>

        {/* Content Container */}
        <div className="bg-white rounded-xl shadow-sm border border-cream-200 p-6 md:p-10 space-y-8 text-gray-warm leading-relaxed">

          {/* Section 1 */}
          <section>
            <div className="flex items-center gap-3 mb-3 text-dark">
              <FiCheckCircle className="text-gold-600" size={22} />
              <h2 className="font-heading text-xl md:text-2xl font-bold">7-Day In-Store / Delivery Inspection</h2>
            </div>
            <p className="text-sm md:text-base mb-3">
              We take pride in our master craftsmanship. Upon receiving your jewelry, if you notice any manufacturing defect or variance from your agreed order specifications, please notify us within <strong>7 calendar days</strong>.
            </p>
            <p className="text-sm md:text-base">
              The item must be in its original, unworn condition with the security tag intact, along with the original tax invoice, certificate of authenticity, and luxury presentation box.
            </p>
          </section>

          <hr className="border-cream-200" />

          {/* Section 2 */}
          <section>
            <div className="flex items-center gap-3 mb-3 text-dark">
              <FiShield className="text-gold-600" size={22} />
              <h2 className="font-heading text-xl md:text-2xl font-bold">Lifetime Exchange & Upgrade Guarantee</h2>
            </div>
            <p className="text-sm md:text-base mb-4">
              We stand behind every piece of precious jewelry we craft for life. Patrons may exchange or upgrade their Suyog Jewelry pieces at any time:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-cream-50 p-5 rounded-lg border border-cream-200">
                <h3 className="font-heading text-base font-semibold text-dark mb-2">Plain Gold Jewelry</h3>
                <p className="text-xs md:text-sm">
                  100% value of the net gold weight calculated at the prevailing gold market rate on the day of exchange (making charges and GST are non-refundable).
                </p>
              </div>
              <div className="bg-cream-50 p-5 rounded-lg border border-cream-200">
                <h3 className="font-heading text-base font-semibold text-dark mb-2">Diamond & Precious Stones</h3>
                <p className="text-xs md:text-sm">
                  100% of the gold value plus up to 90% of the prevailing diamond value on the day of exchange upon inspection and certificate verification.
                </p>
              </div>
            </div>
          </section>

          <hr className="border-cream-200" />

          {/* Section 3 */}
          <section>
            <div className="flex items-center gap-3 mb-3 text-dark">
              <FiAlertCircle className="text-gold-600" size={22} />
              <h2 className="font-heading text-xl md:text-2xl font-bold">Custom & Bespoke Orders</h2>
            </div>
            <p className="text-sm md:text-base mb-3">
              Custom designs crafted to specific sizes, engraved with personal initials, or tailored to bespoke requests are created exclusively for you.
            </p>
            <p className="text-sm md:text-base">
              While custom orders are not eligible for direct cash cancellation, they remain fully covered under our <strong>Lifetime Exchange Policy</strong> and our complimentary repair and resizing warranty.
            </p>
          </section>

          <hr className="border-cream-200" />

          {/* Section 4 */}
          <section>
            <h2 className="font-heading text-xl md:text-2xl text-dark font-bold mb-3">How to Initiate an Exchange</h2>
            <ol className="list-decimal list-inside space-y-2 text-sm md:text-base pl-2">
              <li>Contact our team on WhatsApp at <strong>{formatDisplayPhone(whatsappNumber)}</strong> with your original invoice copy and photo of the item.</li>
              <li>Our team will guide you to securely ship the package via our insured courier or schedule a visit to our Mumbai boutique.</li>
              <li>Our gemologists will examine the hallmark and gemstone setting in your presence or via live video inspection.</li>
              <li>Your exchange value will be credited immediately toward your chosen new design.</li>
            </ol>
          </section>

        </div>
      </div>
    </div>
  );
};

export default ReturnPolicy;
