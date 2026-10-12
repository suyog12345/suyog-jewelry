import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaWhatsapp, FaInstagram, FaShareAlt } from 'react-icons/fa';
import { SiGmail } from 'react-icons/si';
import { FiCopy, FiCheck, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { formatPrice, copyToClipboard } from '../utils';
import { optimizeCloudinaryUrl } from '../utils/cloudinary';

const ShareModal = ({ isOpen, onClose, product, url }) => {
  const [copied, setCopied] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Lock body scroll and handle Escape key when open
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!product) return null;

  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const priceText = product.priceOnRequest ? 'Price on Request' : formatPrice(product.price);
  const rawImage = product.images?.[0]?.url || product.primaryImage || '/placeholder.jpg';
  const previewImage = optimizeCloudinaryUrl(rawImage, { width: 160, height: 160, crop: 'fill' });

  const handleCopyLink = async () => {
    const success = await copyToClipboard(shareUrl);
    if (success) {
      setCopied(true);
      toast.success('Product link copied to clipboard!');
      setTimeout(() => setCopied(false), 2500);
    } else {
      toast.error('Unable to copy link to clipboard');
    }
  };

  const handleWhatsAppShare = () => {
    const message = `Check out this handcrafted piece from Suyog Jewelry:\n\n*${product.name}*\n${priceText}\n\n${shareUrl}`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const handleInstagramShare = async () => {
    await copyToClipboard(shareUrl);
    toast.success('Link copied! Paste it in Instagram Direct Message or Story.', { duration: 4000 });
    // Open Instagram app or web
    window.open('https://www.instagram.com/', '_blank', 'noopener,noreferrer');
  };

  const handleGmailShare = () => {
    const subject = `${product.name} | Suyog Jewelry`;
    const body = `Hi,\n\nI thought you might appreciate this handcrafted piece from Suyog Jewelry:\n\n${product.name}\n${priceText}\n\nView piece details:\n${shareUrl}\n\nSuyog Jewelry - Fine Handcrafted Creations`;

    const isMobileDevice = typeof navigator !== 'undefined' && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (isMobileDevice) {
      window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    } else {
      window.open(`https://mail.google.com/mail/?view=cm&fs=1&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank', 'noopener,noreferrer');
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share && window.isSecureContext) {
      try {
        await navigator.share({
          title: `${product.name} - Suyog Jewelry`,
          text: `Check out ${product.name} at Suyog Jewelry`,
          url: shareUrl,
        });
        onClose();
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.warn('System share error:', err);
        }
      }
    }
  };

  const hasNativeShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function' && typeof window !== 'undefined' && window.isSecureContext;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
            onClick={onClose}
            aria-label="Close modal overlay"
          />

          {/* Modal / Bottom Sheet */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="share-modal-title"
            initial={isMobile ? { y: '100%' } : { scale: 0.95, opacity: 0 }}
            animate={isMobile ? { y: 0 } : { scale: 1, opacity: 1 }}
            exit={isMobile ? { y: '100%' } : { scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', damping: 26, stiffness: 300 }}
            className="relative w-full md:max-w-md bg-white rounded-t-3xl md:rounded-2xl shadow-2xl border border-[#E5E5E5] overflow-hidden z-10 max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile Drag Indicator */}
            <div className="pt-3 pb-1 md:hidden flex justify-center">
              <div className="w-10 h-1 bg-[#D8D8D8] rounded-full" />
            </div>

            {/* Header */}
            <div className="px-6 pt-3 md:pt-6 pb-4 flex items-center justify-between border-b border-[#F0F0F0]">
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#8C733E] font-medium block">
                  Suyog Jewelry
                </span>
                <h3 id="share-modal-title" className="font-heading text-xl text-[#111111] font-light">
                  Share Creation
                </h3>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full border border-[#E5E5E5] flex items-center justify-center text-[#6B6B6B] hover:text-[#111111] hover:border-[#111111] transition-colors cursor-pointer"
                aria-label="Close share dialog"
              >
                <FiX size={18} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="p-6 overflow-y-auto space-y-6">
              {/* Product Preview Snippet */}
              <div className="flex items-center gap-3.5 p-3 bg-[#FAF8F5] border border-[#EAE4D9] rounded-xl">
                <img
                  src={previewImage}
                  alt={product.name}
                  className="w-14 h-14 object-cover rounded-lg border border-[#E5E5E5] bg-white flex-shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <span className="text-[9px] uppercase tracking-[0.2em] text-[#8C733E] font-medium block truncate">
                    {product.category?.name || 'Fine Jewelry'}
                  </span>
                  <h4 className="font-heading text-sm text-[#111111] font-normal truncate">
                    {product.name}
                  </h4>
                  <p className="text-xs text-[#111111] font-medium mt-0.5">
                    {priceText}
                  </p>
                </div>
              </div>

              {/* Share Options Grid */}
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#6B6B6B] font-medium block mb-3.5">
                  Share Via
                </span>
                <div className="grid grid-cols-4 gap-3 text-center">
                  {/* WhatsApp */}
                  <button
                    onClick={handleWhatsAppShare}
                    className="flex flex-col items-center group cursor-pointer p-2 rounded-xl hover:bg-[#F9F9F9] transition-colors"
                  >
                    <div className="w-13 h-13 rounded-2xl bg-[#25D366] text-white flex items-center justify-center shadow-md shadow-[#25D366]/20 transition-transform group-hover:scale-105 group-active:scale-95">
                      <FaWhatsapp size={26} />
                    </div>
                    <span className="text-xs font-medium text-[#111111] mt-2 group-hover:text-[#25D366] transition-colors">
                      WhatsApp
                    </span>
                    <span className="text-[10px] text-[#888888] font-light mt-0.5">
                      Chat
                    </span>
                  </button>

                  {/* Instagram */}
                  <button
                    onClick={handleInstagramShare}
                    className="flex flex-col items-center group cursor-pointer p-2 rounded-xl hover:bg-[#F9F9F9] transition-colors"
                  >
                    <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white flex items-center justify-center shadow-md shadow-[#dc2743]/20 transition-transform group-hover:scale-105 group-active:scale-95">
                      <FaInstagram size={26} />
                    </div>
                    <span className="text-xs font-medium text-[#111111] mt-2 group-hover:text-[#dc2743] transition-colors">
                      Instagram
                    </span>
                    <span className="text-[10px] text-[#888888] font-light mt-0.5">
                      DM / Story
                    </span>
                  </button>

                  {/* Gmail */}
                  <button
                    onClick={handleGmailShare}
                    className="flex flex-col items-center group cursor-pointer p-2 rounded-xl hover:bg-[#F9F9F9] transition-colors"
                  >
                    <div className="w-13 h-13 rounded-2xl bg-white border border-[#E5E5E5] text-[#EA4335] flex items-center justify-center shadow-sm transition-transform group-hover:scale-105 group-active:scale-95">
                      <SiGmail size={24} />
                    </div>
                    <span className="text-xs font-medium text-[#111111] mt-2 group-hover:text-[#EA4335] transition-colors">
                      Gmail
                    </span>
                    <span className="text-[10px] text-[#888888] font-light mt-0.5">
                      Email
                    </span>
                  </button>

                  {/* Copy Link */}
                  <button
                    onClick={handleCopyLink}
                    className="flex flex-col items-center group cursor-pointer p-2 rounded-xl hover:bg-[#F9F9F9] transition-colors"
                  >
                    <div
                      className={`w-13 h-13 rounded-2xl flex items-center justify-center transition-all group-hover:scale-105 group-active:scale-95 shadow-sm ${
                        copied
                          ? 'bg-[#16A34A] text-white shadow-[#16A34A]/20'
                          : 'bg-[#111111] text-white shadow-black/10'
                      }`}
                    >
                      {copied ? <FiCheck size={22} /> : <FiCopy size={20} />}
                    </div>
                    <span
                      className={`text-xs font-medium mt-2 transition-colors ${
                        copied ? 'text-[#16A34A]' : 'text-[#111111]'
                      }`}
                    >
                      {copied ? 'Copied!' : 'Copy Link'}
                    </span>
                    <span className="text-[10px] text-[#888888] font-light mt-0.5">
                      Clipboard
                    </span>
                  </button>
                </div>
              </div>

              {/* URL Display with One-Touch Copy Bar */}
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#6B6B6B] font-medium block mb-2">
                  Product Link
                </span>
                <div
                  onClick={handleCopyLink}
                  className="flex items-center gap-2 p-2.5 bg-[#F7F7F7] border border-[#E5E5E5] rounded-xl hover:border-[#111111] transition-colors cursor-pointer group"
                >
                  <input
                    type="text"
                    readOnly
                    value={shareUrl}
                    className="bg-transparent text-xs text-[#555555] flex-1 outline-none select-all cursor-pointer font-mono truncate"
                    tabIndex={-1}
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopyLink();
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium tracking-wider uppercase transition-colors cursor-pointer flex-shrink-0 ${
                      copied
                        ? 'bg-[#16A34A] text-white'
                        : 'bg-[#111111] text-white hover:bg-black'
                    }`}
                  >
                    {copied ? (
                      <>
                        <FiCheck size={14} />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <FiCopy size={13} />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Native System Share Link (if supported in browser context) */}
              {hasNativeShare && (
                <div className="pt-1 text-center">
                  <button
                    onClick={handleNativeShare}
                    className="inline-flex items-center gap-2 text-xs text-[#6B6B6B] hover:text-[#111111] transition-colors cursor-pointer py-1 px-3"
                  >
                    <FaShareAlt size={12} />
                    <span>More device sharing options</span>
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ShareModal;
