import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';

const NotFound = () => {
  return (
    <div className="min-h-[75vh] flex items-center justify-center bg-white px-5 py-24">
      <Helmet>
        <title>Page Not Found - Suyog Jewelry</title>
      </Helmet>
      
      <motion.div 
        className="text-center max-w-lg mx-auto"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <span className="block text-[11px] font-medium uppercase tracking-[0.25em] text-[#6B6B6B] mb-2">
          Error 404
        </span>
        <h1 className="font-heading text-7xl md:text-9xl font-light text-[#111111] tracking-tight mb-2">
          404
        </h1>
        <h2 className="font-heading text-2xl md:text-3xl font-normal text-[#111111] mb-4 tracking-tight">
          Page Not Found
        </h2>
        <div className="w-12 h-px bg-[#111111] mx-auto mb-6"></div>
        <p className="text-[#6B6B6B] text-sm md:text-base font-light mb-10 leading-relaxed">
          The jewelry collection or page you are seeking could not be found or may have been relocated.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            to="/" 
            className="w-full sm:w-auto inline-flex items-center justify-center bg-[#111111] text-white text-[11px] font-medium uppercase tracking-[0.2em] px-8 py-3.5 border border-[#111111] hover:bg-white hover:text-[#111111] transition-colors duration-200"
          >
            Return to Home
          </Link>
          <Link 
            to="/products" 
            className="w-full sm:w-auto inline-flex items-center justify-center bg-transparent text-[#111111] text-[11px] font-medium uppercase tracking-[0.2em] px-8 py-3.5 border border-[#E5E5E5] hover:border-[#111111] transition-colors duration-200"
          >
            Explore Catalog
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
