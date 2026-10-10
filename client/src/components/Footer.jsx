import React from 'react';
import { Link } from 'react-router-dom';
import { FaInstagram, FaFacebookF, FaWhatsapp } from 'react-icons/fa';
import { formatDisplayPhone } from '../utils';

const Footer = () => {
  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '';
  const instagramUrl = import.meta.env.VITE_INSTAGRAM_URL || 'https://instagram.com';

  return (
    <footer className="bg-dark text-cream-50 pt-16 pb-8 border-t-4 border-gold-500">
      <div className="container mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* Brand */}
        <div className="col-span-1 md:col-span-1">
          <Link to="/" className="flex flex-col mb-4">
            <span className="font-heading text-3xl font-bold text-gold-400 tracking-wider">
              SUYOG
            </span>
            <span className="font-body text-sm tracking-widest text-cream-200 uppercase">
              Jewelry
            </span>
          </Link>
          <p className="text-gray-warm text-sm leading-relaxed mb-6">
            Exquisite handcrafted jewelry blending timeless traditions with modern elegance. Discover your perfect piece today.
          </p>
          <div className="flex gap-4">
            <a 
              href={instagramUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-10 h-10 rounded-full bg-dark-light flex items-center justify-center text-gold-400 hover:bg-gold-500 hover:text-dark transition-colors"
              aria-label="Follow us on Instagram"
            >
              <FaInstagram size={18} />
            </a>
            <a 
              href="#" 
              className="w-10 h-10 rounded-full bg-dark-light flex items-center justify-center text-gold-400 hover:bg-gold-500 hover:text-dark transition-colors"
              aria-label="Facebook"
            >
              <FaFacebookF size={18} />
            </a>
            <a 
              href={`https://wa.me/${whatsappNumber}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-10 h-10 rounded-full bg-dark-light flex items-center justify-center text-gold-400 hover:bg-gold-500 hover:text-dark transition-colors"
              aria-label="Contact us on WhatsApp"
            >
              <FaWhatsapp size={20} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-heading text-lg text-gold-300 mb-4 tracking-wide uppercase">Quick Links</h4>
          <ul className="flex flex-col gap-3 text-sm text-cream-200">
            <li><Link to="/products" className="hover:text-gold-400 transition-colors">All Collections</Link></li>
            <li><Link to="/products?category=Necklaces" className="hover:text-gold-400 transition-colors">Necklaces</Link></li>
            <li><Link to="/products?category=Earrings" className="hover:text-gold-400 transition-colors">Earrings</Link></li>
            <li><Link to="/products?category=Bridal Sets" className="hover:text-gold-400 transition-colors">Bridal Sets</Link></li>
            <li><Link to="/products?featured=true" className="hover:text-gold-400 transition-colors">Featured Pieces</Link></li>
          </ul>
        </div>

        {/* Information */}
        <div>
          <h4 className="font-heading text-lg text-gold-300 mb-4 tracking-wide uppercase">Information</h4>
          <ul className="flex flex-col gap-3 text-sm text-cream-200">
            <li><Link to="/about" className="hover:text-gold-400 transition-colors">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-gold-400 transition-colors">Contact Us</Link></li>
            <li><Link to="/faq" className="hover:text-gold-400 transition-colors">FAQ</Link></li>
            <li><Link to="/return-policy" className="hover:text-gold-400 transition-colors">Return Policy</Link></li>
            <li><Link to="/jewelry-care" className="hover:text-gold-400 transition-colors">Jewelry Care</Link></li>
          </ul>
        </div>

        {/* Store Info */}
        <div>
          <h4 className="font-heading text-lg text-gold-300 mb-4 tracking-wide uppercase">Visit Us</h4>
          <ul className="flex flex-col gap-3 text-sm text-cream-200">
            <li>
              <strong>Address:</strong><br />
              123 Main Bazaar Road,<br />
              Jewelry District, Mumbai 400002
            </li>
            <li className="mt-2">
              <strong>Hours:</strong><br />
              Mon - Sat: 10:30 AM - 8:30 PM<br />
              Sunday: Closed
            </li>
            {whatsappNumber && (
              <li className="mt-2">
                <strong>Phone / WhatsApp:</strong><br />
                {formatDisplayPhone(whatsappNumber)}
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 mt-12 pt-6 border-t border-dark-light flex flex-col md:flex-row justify-between items-center text-xs text-gray-warm">
        <p>&copy; {new Date().getFullYear()} Suyog Jewelry. All rights reserved.</p>
        <div className="flex gap-4 mt-4 md:mt-0">
          <Link to="/privacy-policy" className="hover:text-cream-200 transition-colors">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-cream-200 transition-colors">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
