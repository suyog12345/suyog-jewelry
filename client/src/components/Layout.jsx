import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import FloatingWhatsApp from './FloatingWhatsApp';
import { Helmet } from 'react-helmet-async';

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>Suyog Jewelry - Exquisite Handcrafted Jewelry</title>
      </Helmet>
      
      <Navbar />
      
      {/* Add top padding to account for fixed navbar */}
      <main className="flex-grow pt-20">
        <Outlet />
      </main>
      
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
};

export default Layout;
