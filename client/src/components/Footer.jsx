import React from 'react';
import { Link } from 'react-router-dom';
import { FaInstagram, FaFacebookF, FaWhatsapp } from 'react-icons/fa';
import { formatDisplayPhone } from '../utils';

const Footer = () => {
  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '';
  const instagramUrl = import.meta.env.VITE_INSTAGRAM_URL || 'https://instagram.com';

  return (
    <footer className="bg-[#0D0D0D] text-white pt-20 md:pt-28 pb-12 border-t border-[#1F1F1F]">
      <div className="max-w-7xl mx-auto px-5 md:px-8 lg:px-12 grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">

        {/* Brand Column */}
        <div className="col-span-1 md:col-span-1">
          <Link to="/" className="inline-flex flex-col items-center text-center mb-6">
            <span className="font-heading text-2xl md:text-3xl font-normal text-white tracking-[0.22em] uppercase leading-none indent-[0.22em]">
              Suyog
            </span>
            <span className="font-body text-[9px] tracking-[0.35em] text-[#9E9E9E] uppercase mt-1 indent-[0.35em]">
              Jewelry
            </span>
          </Link>
          <p className="text-[#9E9E9E] text-xs leading-relaxed mb-8 max-w-sm">
            Exquisite handcrafted jewelry blending generational Indian artistry with contemporary minimalism.
          </p>
          <div className="flex gap-3">
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 border border-[#333333] flex items-center justify-center text-white hover:bg-white hover:text-[#0D0D0D] transition-colors"
              aria-label="Instagram"
            >
              <FaInstagram size={15} />
            </a>
            <a
              href="#"
              className="w-9 h-9 border border-[#333333] flex items-center justify-center text-white hover:bg-white hover:text-[#0D0D0D] transition-colors"
              aria-label="Facebook"
            >
              <FaFacebookF size={14} />
            </a>
            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 border border-[#333333] flex items-center justify-center text-white hover:bg-[#25D366] hover:border-[#25D366] hover:text-white transition-colors"
              aria-label="WhatsApp"
            >
              <FaWhatsapp size={16} />
            </a>
          </div>
        </div>

        {/* Collections */}
        {/* <div>
          <h4 className="font-body text-xs font-medium text-white mb-6 uppercase tracking-[0.25em]">
            Collections
          </h4>
          <ul className="flex flex-col gap-3.5 text-xs text-[#9E9E9E]">
            <li><Link to="/products" className="hover:text-white transition-colors">All Pieces</Link></li>
            <li><Link to="/products?category=Necklaces" className="hover:text-white transition-colors">Necklaces</Link></li>
            <li><Link to="/products?category=Earrings" className="hover:text-white transition-colors">Earrings</Link></li>
            <li><Link to="/products?category=Bridal Sets" className="hover:text-white transition-colors">Bridal Suites</Link></li>
            <li><Link to="/products?featured=true" className="hover:text-white transition-colors">Featured Creations</Link></li>
          </ul>
        </div> */}

        {/* Maison Information */}
        <div>
          <h4 className="font-body text-xs font-medium text-white mb-6 uppercase tracking-[0.25em]">
            Information
          </h4>
          <ul className="flex flex-col gap-3.5 text-xs text-[#9E9E9E]">
            <li><Link to="/about" className="hover:text-white transition-colors">Our Heritage</Link></li>
            <li><Link to="/contact" className="hover:text-white transition-colors">Boutique Appointment</Link></li>
            <li><Link to="/faq" className="hover:text-white transition-colors">Frequently Asked Questions</Link></li>
            <li><Link to="/return-policy" className="hover:text-white transition-colors">Exchange & Guarantee</Link></li>
            <li><Link to="/jewelry-care" className="hover:text-white transition-colors">Care Guide</Link></li>
          </ul>
        </div>

        {/* Boutique Location */}
        <div>
          <h4 className="font-body text-xs font-medium text-white mb-6 uppercase tracking-[0.25em]">
            Boutique
          </h4>
          <ul className="flex flex-col gap-3.5 text-xs text-[#9E9E9E] leading-relaxed">
            <li>
              Tilak Path, near Rajwada<br />
              Indore, Madhya Pradesh -452007
            </li>
            <li className="pt-2">
              <span className="text-white block font-medium">Hours:</span>
              Mon – Sat: 10:30 AM – 8:30 PM<br />
              Sunday: By Appointment
            </li>
            {whatsappNumber && (
              <li className="pt-2">
                <span className="text-white block font-medium">Direct Enquiry:</span>
                {formatDisplayPhone(whatsappNumber)}
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 md:px-8 lg:px-12 mt-16 pt-8 border-t border-[#1F1F1F] flex flex-col md:flex-row justify-between items-center text-[11px] text-[#6B6B6B] tracking-wider uppercase">
        <p>&copy; {new Date().getFullYear()} Suyog Jewelry. All rights reserved.</p>
        <div className="flex gap-6 mt-4 md:mt-0">
          <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
