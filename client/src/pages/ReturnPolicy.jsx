import React from 'react';
import { Helmet } from 'react-helmet-async';
import { FiCheckCircle, FiShield, FiAlertCircle } from 'react-icons/fi';
import { formatDisplayPhone } from '../utils';

const ReturnPolicy = () => {
  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '';

  return (
    <div className="bg-white min-h-screen py-16 md:py-24 lg:py-32">
      <Helmet>
        <title>Return & Exchange Policy - Suyog Jewelry</title>
        <meta
          name="description"
          content="Learn about Suyog Jewelry's transparent Return, Lifetime Exchange, and Buyback policies for gold and certified diamond jewelry."
        />
      </Helmet>

      <div className="max-w-4xl mx-auto px-5 md:px-8">
        {/* Header */}
        <div className="text-center mb-14 md:mb-20">
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#6B6B6B] font-medium block mb-2">
            Client Assurance & Terms
          </span>
          <h1 className="font-heading text-4xl md:text-6xl text-[#111111] font-light mb-4">
            Exchange & Guarantee
          </h1>
          <p className="text-[#6B6B6B] text-xs md:text-sm max-w-lg mx-auto leading-relaxed font-light">
            Our commitment to purity, trust, and complete transparency is at the core of every creation we craft.
          </p>
        </div>

        {/* Content Container */}
        <div className="border border-[#E5E5E5] p-8 md:p-14 space-y-12 text-[#6B6B6B] text-xs leading-relaxed font-light">

          {/* Section 1 */}
          <section>
            <div className="flex items-center gap-3 mb-3 text-[#111111]">
              <FiCheckCircle size={18} />
              <h2 className="font-heading text-xl md:text-2xl font-normal">
                7-Day In-Store / Delivery Inspection
              </h2>
            </div>
            <p className="mb-3">
              We take pride in our master craftsmanship. Upon receiving your jewelry, if you notice any manufacturing defect or variance from your agreed order specifications, please notify us within <strong>7 calendar days</strong>.
            </p>
            <p>
              The item must be in its original, unworn condition with the security tag intact, along with the original tax invoice, certificate of authenticity, and luxury presentation box.
            </p>
          </section>

          <hr className="border-[#E5E5E5]" />

          {/* Section 2 */}
          <section>
            <div className="flex items-center gap-3 mb-3 text-[#111111]">
              <FiShield size={18} />
              <h2 className="font-heading text-xl md:text-2xl font-normal">
                Lifetime Exchange & Upgrade Guarantee
              </h2>
            </div>
            <p className="mb-6">
              We stand behind every piece of precious jewelry we craft for life. Patrons may exchange or upgrade their Suyog Jewelry pieces at any time:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="bg-[#F7F7F7] p-6 border border-[#E5E5E5]">
                <h3 className="font-heading text-base font-normal text-[#111111] mb-2">Plain Gold Jewelry</h3>
                <p className="text-xs text-[#6B6B6B]">
                  100% value of the net gold weight calculated at the prevailing gold market rate on the day of exchange (making charges and GST are non-refundable).
                </p>
              </div>
              <div className="bg-[#F7F7F7] p-6 border border-[#E5E5E5]">
                <h3 className="font-heading text-base font-normal text-[#111111] mb-2">Diamond & Precious Stones</h3>
                <p className="text-xs text-[#6B6B6B]">
                  100% of the gold value plus up to 90% of the prevailing diamond value on the day of exchange upon inspection and certificate verification.
                </p>
              </div>
            </div>
          </section>

          <hr className="border-[#E5E5E5]" />

          {/* Section 3 */}
          <section>
            <div className="flex items-center gap-3 mb-3 text-[#111111]">
              <FiAlertCircle size={18} />
              <h2 className="font-heading text-xl md:text-2xl font-normal">
                Custom & Bespoke Commissions
              </h2>
            </div>
            <p className="mb-3">
              Custom designs crafted to specific sizes, engraved with personal initials, or tailored to bespoke requests are created exclusively for you.
            </p>
            <p>
              While custom orders are not eligible for direct cash cancellation, they remain fully covered under our <strong>Lifetime Exchange Policy</strong> and our complimentary repair and resizing warranty.
            </p>
          </section>

          <hr className="border-[#E5E5E5]" />

          {/* Section 4 */}
          <section>
            <h2 className="font-heading text-xl md:text-2xl text-[#111111] font-normal mb-4">
              How to Initiate an Exchange
            </h2>
            <ol className="list-decimal list-inside space-y-3 pl-1">
              <li>Contact our team on WhatsApp at <strong className="text-[#111111]">{formatDisplayPhone(whatsappNumber)}</strong> with your original invoice copy and photo of the item.</li>
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
