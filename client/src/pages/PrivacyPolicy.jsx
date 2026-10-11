import React from 'react';
import { Helmet } from 'react-helmet-async';
import { FiLock, FiEye, FiServer, FiUserCheck } from 'react-icons/fi';

const PrivacyPolicy = () => {
  return (
    <div className="bg-white min-h-screen py-16 md:py-24 lg:py-28">
      <Helmet>
        <title>Privacy Policy - Suyog Jewelry</title>
        <meta
          name="description"
          content="Read the Privacy Policy of Suyog Jewelry. Learn how we safeguard customer data, respect your privacy, and manage WhatsApp communications."
        />
        <meta property="og:title" content="Privacy Policy - Suyog Jewelry" />
        <meta
          property="og:description"
          content="Learn how Suyog Jewelry protects and handles customer privacy and data."
        />
      </Helmet>

      <div className="max-w-4xl mx-auto px-5 md:px-8">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center justify-center w-12 h-12 border border-[#E5E5E5] bg-[#F7F7F7] text-[#111111] mb-5">
            <FiLock size={20} />
          </div>
          <span className="block text-[11px] font-medium uppercase tracking-[0.25em] text-[#6B6B6B] mb-2">
            Client Confidentiality
          </span>
          <h1 className="font-heading text-3xl md:text-5xl font-normal text-[#111111] tracking-tight mb-4">
            Privacy Policy
          </h1>
          <div className="w-12 h-px bg-[#111111] mx-auto mb-4"></div>
          <p className="text-sm md:text-base text-[#6B6B6B] font-light max-w-xl mx-auto">
            Last updated: October 2026. Your privacy and trust are paramount to our house.
          </p>
        </div>

        {/* Content Box */}
        <div className="bg-[#F7F7F7] border border-[#E5E5E5] p-6 md:p-12 space-y-10 text-[#6B6B6B] leading-relaxed">
          
          <section>
            <div className="flex items-center gap-3 mb-4 text-[#111111]">
              <FiEye size={20} />
              <h2 className="font-heading text-xl md:text-2xl font-normal tracking-tight">
                1. Information We Collect
              </h2>
            </div>
            <p className="text-sm md:text-base mb-4 font-light text-[#111111]">
              When you browse our catalog, submit contact requests, or initiate WhatsApp concierge enquiries, we collect only the minimal information essential to deliver bespoke service:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm md:text-base pl-2">
              <li><strong className="font-medium text-[#111111]">Contact details:</strong> Name, email address, phone/WhatsApp number, and delivery city.</li>
              <li><strong className="font-medium text-[#111111]">Product preferences:</strong> Custom design specifications, metal sizing, and enquiry history.</li>
              <li><strong className="font-medium text-[#111111]">Technical analytics:</strong> Anonymous web telemetry, device characteristics, and browsing paths to improve experience.</li>
            </ul>
          </section>

          <hr className="border-[#E5E5E5]" />

          <section>
            <div className="flex items-center gap-3 mb-4 text-[#111111]">
              <FiServer size={20} />
              <h2 className="font-heading text-xl md:text-2xl font-normal tracking-tight">
                2. How We Use Your Information
              </h2>
            </div>
            <p className="text-sm md:text-base mb-4 font-light text-[#111111]">
              Information entrusted to Suyog Jewelry is utilized solely for:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm md:text-base pl-2">
              <li>Direct response to handcrafted jewelry inquiries and custom commission fulfillment.</li>
              <li>Provision of government hallmark certificates, insurance appraisals, and insured logistics tracking.</li>
              <li>Personalized WhatsApp consultations regarding gemstone previews and boutique appointments.</li>
              <li>Full compliance with Indian statutory and tax regulations (GST) for high-value precious goods.</li>
            </ul>
          </section>

          <hr className="border-[#E5E5E5]" />

          <section>
            <div className="flex items-center gap-3 mb-4 text-[#111111]">
              <FiUserCheck size={20} />
              <h2 className="font-heading text-xl md:text-2xl font-normal tracking-tight">
                3. Zero Third-Party Data Monetization
              </h2>
            </div>
            <p className="text-sm md:text-base mb-4 font-light">
              <strong className="font-medium text-[#111111]">We never sell, rent, license, or trade client information to advertising networks or data brokers.</strong> Your contact details remain strictly confidential within Suyog Jewelry.
            </p>
            <p className="text-sm md:text-base font-light">
              Trusted logistics partners (such as insured armored couriers or government hallmarking assay offices) receive only the strictly necessary manifest data to execute secure delivery.
            </p>
          </section>

          <hr className="border-[#E5E5E5]" />

          <section>
            <h2 className="font-heading text-xl md:text-2xl text-[#111111] font-normal tracking-tight mb-4">
              4. Cookies and Web Storage
            </h2>
            <p className="text-sm md:text-base font-light">
              Our site employs standard functional session cookies to remember catalog filters, currency display preferences, and navigation states. You may modify cookie settings in your browser at any time without restricting access to our digital catalog.
            </p>
          </section>

          <hr className="border-[#E5E5E5]" />

          <section>
            <h2 className="font-heading text-xl md:text-2xl text-[#111111] font-normal tracking-tight mb-4">
              5. Privacy Inquiries & Data Rights
            </h2>
            <p className="text-sm md:text-base font-light">
              To request a copy, update, or deletion of your stored enquiry details, please reach out directly to our privacy concierge at <strong className="font-medium text-[#111111]">contact@suyogjewelry.com</strong> or via WhatsApp.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
