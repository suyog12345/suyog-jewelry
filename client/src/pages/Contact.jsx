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
        toast.success('Message sent successfully! We will get back to you soon.');
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
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="bg-cream-50 min-h-screen py-12 md:py-20">
      <Helmet>
        <title>Contact Us - Suyog Jewelry</title>
        <meta name="description" content="Get in touch with Suyog Jewelry for custom orders, enquiries, or to book an appointment at our store." />
      </Helmet>

      <div className="container mx-auto px-4 md:px-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="text-center mb-12"
        >
          <h1 className="font-heading text-3xl md:text-5xl text-dark mb-4">Get in Touch</h1>
          <div className="w-24 h-1 bg-gold-400 mx-auto mb-6"></div>
          <p className="text-gray-warm max-w-2xl mx-auto">
            Whether you're looking for a custom design, have a question about our collections, or want to book an appointment, our team is here to assist you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white rounded-xl shadow-sm border border-cream-200 overflow-hidden">

          {/* Contact Info (Left) */}
          <div className="bg-dark text-white p-8 md:p-12">
            <h2 className="font-heading text-2xl md:text-3xl text-gold-400 mb-8">Contact Information</h2>

            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="mt-1 text-gold-500"><FaMapMarkerAlt size={20} /></div>
                <div>
                  <h3 className="font-medium text-lg mb-1 uppercase tracking-wider text-cream-200 text-sm">Store Address</h3>
                  <p className="text-gray-300 leading-relaxed">123 Main Bazaar Road,<br />Jewelry District,<br />Mumbai 400002, India</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-1 text-gold-500"><FaPhoneAlt size={20} /></div>
                <div>
                  <h3 className="font-medium text-lg mb-1 uppercase tracking-wider text-cream-200 text-sm">Phone</h3>
                  <p className="text-gray-300">{formatDisplayPhone()}</p>
                  <p className="text-gray-400 text-sm mt-1">Mon-Sat: 10:30 AM - 8:30 PM</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-1 text-gold-500"><FaEnvelope size={20} /></div>
                <div>
                  <h3 className="font-medium text-lg mb-1 uppercase tracking-wider text-cream-200 text-sm">Email</h3>
                  <p className="text-gray-300">contact@suyogjewelry.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-1 text-gold-500"><FaWhatsapp size={22} /></div>
                <div>
                  <h3 className="font-medium text-lg mb-1 uppercase tracking-wider text-cream-200 text-sm">WhatsApp</h3>
                  <p className="text-gray-300">Instant replies during business hours</p>
                  <a
                    href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 text-gold-400 hover:text-white transition-colors underline underline-offset-4 text-sm"
                  >
                    Chat with us now
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form (Right) */}
          <div className="p-8 md:p-12">
            <h2 className="font-heading text-2xl text-dark mb-6">Send us a Message</h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="name" className="block text-sm text-dark-light mb-1">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border border-cream-200 rounded px-4 py-2 focus:outline-none focus:border-gold-500 transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm text-dark-light mb-1">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border border-cream-200 rounded px-4 py-2 focus:outline-none focus:border-gold-500 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="phone" className="block text-sm text-dark-light mb-1">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full border border-cream-200 rounded px-4 py-2 focus:outline-none focus:border-gold-500 transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="type" className="block text-sm text-dark-light mb-1">Enquiry Type</label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full border border-cream-200 rounded px-4 py-2 focus:outline-none focus:border-gold-500 transition-colors bg-white"
                  >
                    <option value="general">General Enquiry</option>
                    <option value="custom-order">Custom Order</option>
                    <option value="enquiry">Product Enquiry</option>
                    <option value="complaint">Feedback/Complaint</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm text-dark-light mb-1">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full border border-cream-200 rounded px-4 py-2 focus:outline-none focus:border-gold-500 transition-colors"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm text-dark-light mb-1">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full border border-cream-200 rounded px-4 py-2 focus:outline-none focus:border-gold-500 transition-colors resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-dark text-white font-medium uppercase tracking-wider py-3 rounded hover:bg-gold-600 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
