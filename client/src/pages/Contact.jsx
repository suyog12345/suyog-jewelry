import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { submitContact } from '../services/api';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaWhatsapp } from 'react-icons/fa';
import { formatDisplayPhone } from '../utils';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    type: 'general'
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await submitContact(formData);
      if (res.data.success) {
        toast.success('Your message has been received. Our concierge will be in touch shortly.');
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
          type: 'general'
        });
      }
    } catch (error) {
      toast.error(error.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#6B6B6B] font-medium block mb-2">
            Concierge & Inquiries
          </span>
          <h1 className="font-heading text-4xl md:text-6xl text-[#111111] font-light mb-4">
            Get in Touch
          </h1>
          <p className="text-[#6B6B6B] text-xs md:text-sm max-w-xl mx-auto leading-relaxed font-light">
            Whether seeking bespoke bridal commissions, private boutique viewings, or specific catalogue details, our team is at your complete disposal.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 border border-[#E5E5E5] overflow-hidden">

          {/* Left Column: Boutique Information (Full Black Contrast) */}
          <div className="lg:col-span-5 bg-[#0D0D0D] text-white p-8 md:p-14 border-b lg:border-b-0 lg:border-r border-[#1F1F1F]">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#9E9E9E] font-medium block mb-2">
              Atelier Location
            </span>
            <h2 className="font-heading text-2xl md:text-3xl text-white font-light mb-10">
              Boutique Details
            </h2>

            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="mt-1 text-white opacity-80"><FaMapMarkerAlt size={16} /></div>
                <div>
                  <h3 className="font-body text-[10px] uppercase tracking-[0.2em] text-[#9E9E9E] mb-1">
                    Store Address
                  </h3>
                  <p className="text-white text-xs leading-relaxed font-light">
                    123 Main Bazaar Road,<br />
                    Jewelry District,<br />
                    Mumbai 400002, India
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-1 text-white opacity-80"><FaPhoneAlt size={15} /></div>
                <div>
                  <h3 className="font-body text-[10px] uppercase tracking-[0.2em] text-[#9E9E9E] mb-1">
                    Telephone
                  </h3>
                  <p className="text-white text-xs font-light">{formatDisplayPhone()}</p>
                  <p className="text-[#6B6B6B] text-[11px] mt-0.5">Mon &ndash; Sat: 10:30 AM &ndash; 8:30 PM</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-1 text-white opacity-80"><FaEnvelope size={15} /></div>
                <div>
                  <h3 className="font-body text-[10px] uppercase tracking-[0.2em] text-[#9E9E9E] mb-1">
                    Direct Email
                  </h3>
                  <p className="text-white text-xs font-light">contact@suyogjewelry.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-1 text-[#25D366]"><FaWhatsapp size={18} /></div>
                <div>
                  <h3 className="font-body text-[10px] uppercase tracking-[0.2em] text-[#9E9E9E] mb-1">
                    Instant WhatsApp
                  </h3>
                  <p className="text-white text-xs font-light">Rapid consultation & live video showcases</p>
                  <a
                    href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 text-[#25D366] hover:underline text-xs tracking-wider uppercase font-medium"
                  >
                    Open WhatsApp Chat &rarr;
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7 bg-white p-8 md:p-14">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#6B6B6B] font-medium block mb-2">
              Correspondence
            </span>
            <h2 className="font-heading text-2xl md:text-3xl text-[#111111] font-light mb-8">
              Send an Inquiry
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-[10px] uppercase tracking-[0.2em] text-[#6B6B6B] mb-2 font-medium">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-[#F7F7F7] border border-[#E5E5E5] px-4 py-3 text-xs text-[#111111] focus:outline-none focus:border-[#111111] focus:bg-white transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-[10px] uppercase tracking-[0.2em] text-[#6B6B6B] mb-2 font-medium">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-[#F7F7F7] border border-[#E5E5E5] px-4 py-3 text-xs text-[#111111] focus:outline-none focus:border-[#111111] focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone" className="block text-[10px] uppercase tracking-[0.2em] text-[#6B6B6B] mb-2 font-medium">
                    Phone / Mobile
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-[#F7F7F7] border border-[#E5E5E5] px-4 py-3 text-xs text-[#111111] focus:outline-none focus:border-[#111111] focus:bg-white transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="type" className="block text-[10px] uppercase tracking-[0.2em] text-[#6B6B6B] mb-2 font-medium">
                    Nature of Inquiry
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full bg-[#F7F7F7] border border-[#E5E5E5] px-4 py-3 text-xs text-[#111111] focus:outline-none focus:border-[#111111] focus:bg-white transition-colors cursor-pointer"
                  >
                    <option value="general">General Inquiry</option>
                    <option value="custom-order">Bespoke Commission</option>
                    <option value="enquiry">Specific Piece Inquiry</option>
                    <option value="complaint">Boutique Appointment</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-[10px] uppercase tracking-[0.2em] text-[#6B6B6B] mb-2 font-medium">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full bg-[#F7F7F7] border border-[#E5E5E5] px-4 py-3 text-xs text-[#111111] focus:outline-none focus:border-[#111111] focus:bg-white transition-colors"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-[10px] uppercase tracking-[0.2em] text-[#6B6B6B] mb-2 font-medium">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full bg-[#F7F7F7] border border-[#E5E5E5] px-4 py-3 text-xs text-[#111111] focus:outline-none focus:border-[#111111] focus:bg-white transition-colors resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#111111] text-white border border-[#111111] font-medium uppercase tracking-[0.2em] py-4 text-xs hover:bg-white hover:text-[#111111] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Transmitting...' : 'Submit Inquiry'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
