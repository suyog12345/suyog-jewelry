import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

const faqs = [
  {
    category: 'Ordering & Concierge',
    items: [
      {
        q: 'How do I acquire jewelry from Suyog Jewelry?',
        a: 'We operate as a high-touch bespoke jewelry boutique. Every product features an "Enquire on WhatsApp" button. Tapping it opens a direct conversation with our jewelry consultants with the product details pre-filled. We discuss sizes, custom requirements, bullion pricing, and arrange payment and delivery.',
      },
      {
        q: 'Why do you take enquiries via WhatsApp instead of regular e-commerce checkout?',
        a: 'Fine luxury jewelry is deeply personal and requires exact sizing, weight confirmation, and daily fluctuating gold rates. Our WhatsApp concierge allows you to speak directly with an expert, view high-definition video previews of the jewelry, and customize pieces to your exact budget and preference.',
      },
      {
        q: 'Can I customize an existing design or create a custom piece?',
        a: 'Absolutely. Over 60% of our bridal and statement pieces are tailored specifically for our patrons. You can share your inspiration sketches or modifications with us on WhatsApp, and our master karigars will craft it to perfection.',
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
    <div className="bg-white min-h-screen py-16 md:py-24 lg:py-32">
      <Helmet>
        <title>Frequently Asked Questions (FAQ) - Suyog Jewelry</title>
        <meta
          name="description"
          content="Find answers to common questions about ordering, BIS hallmarking, custom bridal designs, and WhatsApp consultations at Suyog Jewelry."
        />
      </Helmet>

      <div className="max-w-4xl mx-auto px-5 md:px-8">
        {/* Header */}
        <div className="text-center mb-14 md:mb-20">
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#6B6B6B] font-medium block mb-2">
            Inquiries & Knowledge
          </span>
          <h1 className="font-heading text-4xl md:text-6xl text-[#111111] font-light mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-[#6B6B6B] text-xs md:text-sm max-w-lg mx-auto leading-relaxed font-light">
            Essential information regarding our bespoke creations, gold purity standards, and private consultations.
          </p>
        </div>

        {/* Accordions by category */}
        <div className="space-y-12">
          {faqs.map((group, catIdx) => (
            <div key={catIdx} className="border border-[#E5E5E5] p-6 md:p-10">
              <h2 className="font-heading text-2xl md:text-3xl text-[#111111] font-light mb-8 pb-3 border-b border-[#E5E5E5]">
                {group.category}
              </h2>

              <div className="space-y-4">
                {group.items.map((item, itemIdx) => {
                  const key = `${catIdx}-${itemIdx}`;
                  const isOpen = !!openIndex[key];

                  return (
                    <div
                      key={itemIdx}
                      className="border border-[#E5E5E5] transition-colors"
                    >
                      <button
                        onClick={() => toggle(catIdx, itemIdx)}
                        className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 bg-white hover:bg-[#F7F7F7] transition-colors cursor-pointer"
                        aria-expanded={isOpen}
                      >
                        <span className="font-heading text-base md:text-lg text-[#111111] font-normal leading-snug">
                          {item.q}
                        </span>
                        <FiChevronDown
                          size={16}
                          className={`text-[#111111] shrink-0 transform transition-transform duration-200 ${
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
                            <div className="px-5 py-4 text-[#6B6B6B] text-xs leading-relaxed border-t border-[#E5E5E5] bg-[#F7F7F7] font-light">
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

        {/* Full Black Contrast CTA */}
        <div className="mt-14 bg-[#0D0D0D] text-white p-8 md:p-12 text-center border border-[#1F1F1F]">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#9E9E9E] font-medium block mb-2">
            Personal Concierge
          </span>
          <h3 className="font-heading text-2xl md:text-3xl font-light mb-3 text-white">
            Have a Specific Question?
          </h3>
          <p className="text-[#9E9E9E] text-xs max-w-md mx-auto mb-8 font-light leading-relaxed">
            Our jewelry specialists are accessible on WhatsApp to provide live guidance, customized quotations, and sizing consultations.
          </p>
          <a
            href={`https://wa.me/${whatsappNumber}?text=Hi%20Suyog%20Jewelry,%20I%20have%20a%20question%20about%20your%20collections`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 bg-[#25D366] hover:bg-[#1ebd5a] text-white px-7 py-3.5 text-xs uppercase tracking-[0.2em] font-medium transition-colors"
          >
            <FaWhatsapp size={17} />
            <span>Consult on WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
