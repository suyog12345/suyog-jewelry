import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { FiMenu, FiX, FiSearch } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Collections', path: '/products' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header
      className={`fixed w-full top-0 z-50 transition-all duration-300 bg-white/95 backdrop-blur-md border-b border-[#E5E5E5] ${scrolled ? 'py-3.5 shadow-[0_1px_3px_rgba(0,0,0,0.03)]' : 'py-5'
        }`}
    >
      <div className="max-w-7xl mx-auto px-5 md:px-8 lg:px-12 flex justify-between items-center">
        {/* Minimal Luxury Logo */}
        <Link to="/" className="flex flex-col items-center text-center">
          <span className="font-heading text-2xl md:text-3xl font-normal text-[#111111] tracking-[0.22em] uppercase leading-none indent-[0.22em]">
            Suyog
          </span>
          <span className="font-body text-[9px] md:text-[10px] tracking-[0.35em] text-[#6B6B6B] uppercase mt-1 indent-[0.35em]">
            Jewelry
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-10 items-center">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `text-xs uppercase tracking-[0.2em] transition-all duration-200 ${isActive
                  ? 'text-[#111111] font-medium border-b border-[#111111] pb-0.5'
                  : 'text-[#6B6B6B] hover:text-[#111111]'
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
          <Link
            to="/products?search="
            className="text-[#111111] hover:opacity-50 transition-opacity pl-2"
            aria-label="Search jewelry"
          >
            <FiSearch size={18} />
          </Link>
        </nav>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center gap-5">
          <Link to="/products?search=" className="text-[#111111]" aria-label="Search jewelry">
            <FiSearch size={20} />
          </Link>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-[#111111] focus:outline-none p-1"
            aria-label="Toggle menu"
          >
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: '100vh' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden fixed inset-x-0 top-full bg-white flex flex-col items-center pt-10 pb-20 gap-8 border-t border-[#E5E5E5] shadow-lg"
          >
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `text-sm font-medium tracking-[0.22em] uppercase transition-colors ${isActive ? 'text-[#111111] border-b border-[#111111] pb-1' : 'text-[#6B6B6B]'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
            <div className="w-12 h-px bg-[#E5E5E5] mt-4"></div>
            <p className="text-xs tracking-[0.18em] uppercase text-[#9E9E9E]">
              Exquisite Handcrafted Creations
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
