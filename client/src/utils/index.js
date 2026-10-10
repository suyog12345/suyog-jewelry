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
