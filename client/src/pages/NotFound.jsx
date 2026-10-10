import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-cream-50 px-4">
      <Helmet>
        <title>Page Not Found - Suyog Jewelry</title>
      </Helmet>
      
      <motion.div 
        className="text-center max-w-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="font-heading text-6xl md:text-8xl text-gold-500 font-bold mb-4">404</h1>
        <h2 className="font-heading text-2xl md:text-3xl text-dark mb-6">Page Not Found</h2>
        <p className="font-body text-gray-warm mb-8">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link 
          to="/" 
          className="inline-block bg-dark text-white font-medium uppercase tracking-wider text-sm px-8 py-3 rounded hover:bg-gold-600 transition-colors"
        >
          Return to Home
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
