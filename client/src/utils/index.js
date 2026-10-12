export const formatPrice = (price, priceOnRequest) => {
  if (priceOnRequest || price === null || price === undefined) {
    return 'Price on Request';
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
};

export const getWhatsAppNumber = () => {
  return import.meta.env.VITE_WHATSAPP_NUMBER || '';
};

export const getInstagramUrl = () => {
  return import.meta.env.VITE_INSTAGRAM_URL || '';
};

export const formatDisplayPhone = (phone = import.meta.env.VITE_WHATSAPP_NUMBER) => {
  if (!phone) return '';
  const cleaned = phone.toString().replace(/\D/g, '');
  if (cleaned.length === 12 && cleaned.startsWith('91')) {
    return `+91 ${cleaned.slice(2, 7)} ${cleaned.slice(7)}`;
  }
  return `+${cleaned}`;
};

export const generateWhatsAppLink = (product) => {
  const phoneNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '';
  const siteUrl = import.meta.env.VITE_SITE_URL || window.location.origin;

  const priceText = product.priceOnRequest ? 'Price on Request' : formatPrice(product.price);
  const productUrl = `${siteUrl}/products/${product.slug || product._id}`;

  const message = `Hi Suyog Jewelry, I'm interested in: ${product.name} | Price: ${priceText} | Link: ${productUrl}`;

  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
};

/**
 * Robust cross-platform copy to clipboard function.
 * Supports modern Clipboard API (secure contexts) and document.execCommand fallback
 * for mobile devices, WebViews, and local network HTTP IPs.
 */
export const copyToClipboard = async (text) => {
  if (!text) return false;

  // 1. Modern Clipboard API (when in secure context / HTTPS / localhost)
  if (typeof navigator !== 'undefined' && navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.warn('navigator.clipboard.writeText failed, falling back:', err);
    }
  }

  // 2. Fallback for non-secure contexts (e.g. mobile over local network IP) and older browsers
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;

    // Prevent scrolling and zooming on mobile
    textArea.style.position = 'fixed';
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.width = '2em';
    textArea.style.height = '2em';
    textArea.style.padding = '0';
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
    textArea.style.background = 'transparent';
    textArea.style.opacity = '0';
    textArea.setAttribute('readonly', '');

    document.body.appendChild(textArea);

    // iOS Safari requires setSelectionRange
    textArea.focus();
    textArea.select();
    textArea.setSelectionRange(0, text.length);

    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch (err) {
    console.error('execCommand copy fallback failed:', err);
    return false;
  }
};
