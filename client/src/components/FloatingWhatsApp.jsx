import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { motion } from 'framer-motion';

const FloatingWhatsApp = () => {
  const phoneNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '';
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=Hi%20Suyog%20Jewelry,%20I'm%20interested%20in%20your%20collections!`;

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:shadow-xl focus:outline-none transition-all flex items-center justify-center group"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 1 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Contact us on WhatsApp"
    >
      <FaWhatsapp size={28} />

      {/* Minimal luxury tooltip */}
      <span className="absolute right-full mr-3.5 bg-[#111111] text-white text-[10px] tracking-[0.2em] uppercase font-medium py-1.5 px-3 border border-[#333333] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md">
        Enquire on WhatsApp
        <span className="absolute top-1/2 -right-1 -translate-y-1/2 border-4 border-transparent border-l-[#111111]"></span>
      </span>
    </motion.a>
  );
};

export default FloatingWhatsApp;
