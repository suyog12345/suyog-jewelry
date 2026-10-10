import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiHelpCircle } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

const faqs = [
  {
    category: 'Ordering & Enquiries',
    items: [
      {
        q: 'How do I purchase jewelry from Suyog Jewelry?',
        a: 'We operate as a high-touch bespoke jewelry boutique. Every product features an "Enquire on WhatsApp" button. Tapping it opens a direct conversation with our jewelry consultants with the product details pre-filled. We discuss sizes, custom requirements, bullion pricing, and arrange payment and delivery.',
      },
      {
        q: 'Why do you take enquiries via WhatsApp instead of regular e-commerce checkout?',
        a: 'Fine luxury jewelry is deeply personal and requires exact sizing, weight confirmation, and daily fluctuating gold rates. Our WhatsApp concierge allows you to speak directly with an expert, view high-definition video previews of the jewelry, and customize pieces to your exact budget and preference.',
      },
      {
        q: 'Can I customize an existing design or create a custom piece?',
        a: 'Absolutely! More than 60% of our bridal and statement pieces are tailored specifically for our patrons. You can share your inspiration sketches or modifications with us on WhatsApp, and our master karigars will craft it to perfection.',
      },
    ],
  },
  {
    category: 'Authenticity & Certification',
    items: [
      {
        q: 'Is all gold jewelry hallmarked?',
        a: 'Yes, 100% of our gold jewelry carries government-approved BIS 916 Hallmark (for 22 Karat) or BIS 750 (for 18 Karat) with a unique HUID (Hallmark Unique Identification) stamped on the piece.',
      },
      {
        q: 'Are your diamonds and gemstones certified?',
        a: 'All our diamond jewelry is accompanied by authentic laboratory grading certificates (such as IGI or SGL), detailing diamond color, clarity, carat weight, and cut quality.',
      },
      {
        q: 'Do you provide a formal tax invoice?',
        a: 'Yes, all purchases come with a detailed GST invoice specifying net gold weight, gross weight, stone weight, making charges, and hallmarking charges for your complete peace of mind.',
      },
    ],
  },
  {
    category: 'Shipping & Boutique Visits',
    items: [
      {
        q: 'Do you offer insured shipping across India?',
        a: 'Yes, we provide fully insured, tamper-evident door-to-door transit for high-value jewelry across major pin codes in India through specialized secure logistics partners.',
      },
      {
        q: 'Can I visit your physical boutique to view designs?',
        a: 'We warmly welcome patrons to visit our boutique in Mumbai. You can preview our entire heritage bridal collection, inspect items under magnification, and meet our senior gemologists. You may also schedule a private appointment via WhatsApp.',
      },
      {
        q: 'How long does custom jewelry manufacturing take?',
        a: 'In-stock pieces are dispatched within 24–48 hours after final confirmation. Bespoke custom designs typically take 10 to 18 business days depending on the intricacy of the handcrafting.',
      },
    ],
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState({});

  const toggle = (catIdx, itemIdx) => {
    const key = `${catIdx}-${itemIdx}`;
    setOpenIndex((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '';

  return (
    <div className="bg-cream-50 min-h-screen py-12 md:py-20">
      <Helmet>
        <title>Frequently Asked Questions (FAQ) - Suyog Jewelry</title>
        <meta
          name="description"
          content="Find answers to common questions about ordering, BIS hallmarking, custom bridal designs, and WhatsApp consultations at Suyog Jewelry."
        />
        <meta property="og:title" content="FAQ - Suyog Jewelry" />
        <meta property="og:description" content="Answers to common questions about ordering fine handcrafted jewelry at Suyog Jewelry." />
      </Helmet>

      <div className="container mx-auto px-4 md:px-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gold-100 text-gold-700 mb-4">
            <FiHelpCircle size={24} />
          </div>
          <h1 className="font-heading text-3xl md:text-5xl text-dark mb-4">Frequently Asked Questions</h1>
          <div className="w-24 h-1 bg-gold-400 mx-auto mb-4"></div>
          <p className="text-gray-warm text-sm md:text-base max-w-xl mx-auto">
            Everything you need to know about our handcrafted jewelry, certification standards, and personalised order process.
          </p>
        </div>

        {/* Accordions by category */}
        <div className="space-y-10">
          {faqs.map((group, catIdx) => (
            <div key={catIdx} className="bg-white rounded-xl shadow-sm border border-cream-200 overflow-hidden p-6 md:p-8">
              <h2 className="font-heading text-xl md:text-2xl text-gold-700 mb-6 border-b border-cream-100 pb-3">
                {group.category}
              </h2>

              <div className="space-y-4">
                {group.items.map((item, itemIdx) => {
                  const key = `${catIdx}-${itemIdx}`;
                  const isOpen = !!openIndex[key];

                  return (
                    <div
                      key={itemIdx}
                      className="border border-cream-200 rounded-lg overflow-hidden transition-colors"
                    >
                      <button
                        onClick={() => toggle(catIdx, itemIdx)}
                        className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 bg-cream-50 hover:bg-cream-100 transition-colors cursor-pointer"
                        aria-expanded={isOpen}
                      >
                        <span className="font-heading text-base md:text-lg text-dark font-medium">
                          {item.q}
                        </span>
                        <FiChevronDown
                          size={18}
                          className={`text-gold-700 shrink-0 transform transition-transform duration-200 ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>

                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="overflow-hidden"
                          >
                            <div className="px-5 py-4 text-gray-warm text-sm leading-relaxed border-t border-cream-200 bg-white">
                              {item.a}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Still Have Questions CTA */}
        <div className="mt-12 bg-maroon-900 text-cream-50 rounded-xl p-8 text-center border border-gold-600/30">
          <h3 className="font-heading text-2xl mb-2 text-gold-400">Still have questions?</h3>
          <p className="text-cream-200 text-sm max-w-md mx-auto mb-6">
            Our jewelry specialists are available on WhatsApp to answer any queries and assist you with custom requirements.
          </p>
          <a
            href={`https://wa.me/${whatsappNumber}?text=Hi%20Suyog%20Jewelry,%20I%20have%20a%20question%20about%20your%20collections`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white px-6 py-3 rounded-lg font-medium text-sm transition-colors shadow"
          >
            <FaWhatsapp size={18} />
            <span>Chat on WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
