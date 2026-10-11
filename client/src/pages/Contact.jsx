import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaWhatsapp } from 'react-icons/fa';
import { formatDisplayPhone } from '../utils';

const Contact = () => {

  const fadeInUp = {
    hidden: { opacity: 0, y: 25 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <div className="bg-white min-h-screen py-16 md:py-24 lg:py-32">
      <Helmet>
        <title>Contact Us - Suyog Jewelry</title>
        <meta name="description" content="Get in touch with Suyog Jewelry for custom orders, enquiries, or to book an appointment at our store." />
      </Helmet>

      <div className="max-w-7xl mx-auto px-5 md:px-8 lg:px-12">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="text-center mb-14 md:mb-20"
        >
          {/* <span className="text-[11px] uppercase tracking-[0.25em] text-[#6B6B6B] font-medium block mb-2">
            Concierge & Inquiries
          </span> */}
          <h1 className="font-heading text-4xl md:text-6xl text-[#111111] font-light mb-4">
            Concierge & Inquiries
          </h1>
          <p className="text-[#6B6B6B] text-xs md:text-sm max-w-xl mx-auto leading-relaxed font-light">
            Whether seeking bespoke bridal commissions, private boutique viewings, or specific catalogue details, our team is at your complete disposal.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto border border-[#E5E5E5] bg-[#0D0D0D] text-white p-8 md:p-14 lg:p-16">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#9E9E9E] font-medium block mb-2">
              Atelier Location & Concierge
            </span>
            <h2 className="font-heading text-3xl md:text-4xl text-white font-light">
              Boutique Details
            </h2>
            <div className="w-12 h-px bg-[#333333] mx-auto mt-4"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
            <div className="flex items-start gap-4 p-6 bg-[#141414] border border-[#222222]">
              <div className="mt-1 text-white opacity-80"><FaMapMarkerAlt size={18} /></div>
              <div>
                <h3 className="font-body text-[10px] uppercase tracking-[0.2em] text-[#9E9E9E] mb-1.5 font-medium">
                  Store Address
                </h3>
                <p className="text-white text-xs leading-relaxed font-light">
                  Tilak Path, near Rajwada<br />
                  Indore, Madhya Pradesh - 452007, India
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-[#141414] border border-[#222222]">
              <div className="mt-1 text-white opacity-80"><FaPhoneAlt size={16} /></div>
              <div>
                <h3 className="font-body text-[10px] uppercase tracking-[0.2em] text-[#9E9E9E] mb-1.5 font-medium">
                  Telephone
                </h3>
                <p className="text-white text-xs font-light">{formatDisplayPhone()}</p>
                <p className="text-[#9E9E9E] text-[11px] mt-1 font-light">Mon &ndash; Sat: 10:30 AM &ndash; 8:30 PM</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-[#141414] border border-[#222222]">
              <div className="mt-1 text-white opacity-80"><FaEnvelope size={16} /></div>
              <div>
                <h3 className="font-body text-[10px] uppercase tracking-[0.2em] text-[#9E9E9E] mb-1.5 font-medium">
                  Direct Email
                </h3>
                <p className="text-white text-xs font-light">suyogsinnarkar@gmail.com</p>
                <p className="text-[#9E9E9E] text-[11px] mt-1 font-light">General enquiries & certifications</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-[#141414] border border-[#222222]">
              <div className="mt-1 text-[#25D366]"><FaWhatsapp size={19} /></div>
              <div>
                <h3 className="font-body text-[10px] uppercase tracking-[0.2em] text-[#9E9E9E] mb-1.5 font-medium">
                  Instant WhatsApp
                </h3>
                <p className="text-white text-xs font-light">Rapid consultation & live video showcases</p>
                <a
                  href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER || '919752009399'}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 mt-2.5 text-[#25D366] hover:underline text-xs tracking-wider uppercase font-medium"
                >
                  <span>Open WhatsApp Chat</span>
                  <span>&rarr;</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
