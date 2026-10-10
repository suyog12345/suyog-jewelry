import React from 'react';
import { Helmet } from 'react-helmet-async';
import { FiLock, FiEye, FiServer, FiUserCheck } from 'react-icons/fi';

const PrivacyPolicy = () => {
  return (
    <div className="bg-cream-50 min-h-screen py-12 md:py-20">
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

      <div className="container mx-auto px-4 md:px-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gold-100 text-gold-700 mb-4">
            <FiLock size={24} />
          </div>
          <h1 className="font-heading text-3xl md:text-5xl text-dark mb-4">Privacy Policy</h1>
          <div className="w-24 h-1 bg-gold-400 mx-auto mb-4"></div>
          <p className="text-gray-warm text-sm md:text-base max-w-xl mx-auto">
            Last updated: October 2026. Your privacy and trust are sacred to us.
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-sm border border-cream-200 p-6 md:p-10 space-y-8 text-gray-warm leading-relaxed">
          
          <section>
            <div className="flex items-center gap-3 mb-3 text-dark">
              <FiEye className="text-gold-600" size={22} />
              <h2 className="font-heading text-xl md:text-2xl font-bold">1. Information We Collect</h2>
            </div>
            <p className="text-sm md:text-base mb-3">
              When you browse our catalog, submit contact forms, or initiate WhatsApp enquiries, we collect minimal information necessary to deliver exceptional bespoke service:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-sm md:text-base pl-2">
              <li>Contact details: Name, email address, phone/WhatsApp number, and postal city.</li>
              <li>Product preferences: Custom design requirements, sizing preferences, and enquiry history.</li>
              <li>Technical analytics: Anonymous web usage, browser type, and page traffic patterns to optimize performance.</li>
            </ul>
          </section>

          <hr className="border-cream-200" />

          <section>
            <div className="flex items-center gap-3 mb-3 text-dark">
              <FiServer className="text-gold-600" size={22} />
              <h2 className="font-heading text-xl md:text-2xl font-bold">2. How We Use Your Information</h2>
            </div>
            <p className="text-sm md:text-base mb-3">
              The data you share with Suyog Jewelry is utilized solely for:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-sm md:text-base pl-2">
              <li>Answering bespoke jewelry inquiries and fulfilling orders.</li>
              <li>Providing hallmark certificates, GST invoices, and shipment tracking.</li>
              <li>Direct WhatsApp consultations regarding jewelry care, previews, and appointments.</li>
              <li>Ensuring security and regulatory compliance with Indian tax laws for high-value transactions.</li>
            </ul>
          </section>

          <hr className="border-cream-200" />

          <section>
            <div className="flex items-center gap-3 mb-3 text-dark">
              <FiUserCheck className="text-gold-600" size={22} />
              <h2 className="font-heading text-xl md:text-2xl font-bold">3. No Selling or Renting of Personal Data</h2>
            </div>
            <p className="text-sm md:text-base mb-3">
              <strong>We never sell, rent, or lease patron information to third-party advertisers or lead brokers.</strong> Your phone number and email remain strictly confidential between you and Suyog Jewelry.
            </p>
            <p className="text-sm md:text-base">
              Third parties who assist in delivering your orders (such as insured armored couriers or government hallmarking centers) receive only the minimum information necessary to execute their duties securely.
            </p>
          </section>

          <hr className="border-cream-200" />

          <section>
            <h2 className="font-heading text-xl md:text-2xl text-dark font-bold mb-3">4. Cookies and Web Storage</h2>
            <p className="text-sm md:text-base">
              Our website uses basic functional session cookies to remember your display preferences, filter settings, and smooth navigation. You may disable cookies in your browser settings at any time without impacting your ability to browse our jewelry catalog.
            </p>
          </section>

          <hr className="border-cream-200" />

          <section>
            <h2 className="font-heading text-xl md:text-2xl text-dark font-bold mb-3">5. Contact Our Privacy Officer</h2>
            <p className="text-sm md:text-base">
              If you have any questions about this Privacy Policy or wish to request the deletion or update of your stored enquiry details, please write to us at <strong>contact@suyogjewelry.com</strong> or message our support team on WhatsApp.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
