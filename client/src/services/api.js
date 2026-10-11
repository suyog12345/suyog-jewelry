import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// Response interceptor for error handling
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const message = error.response?.data?.message || error.message || 'Something went wrong';
    return Promise.reject({ message, status: error.response?.status, data: error.response?.data });
  }
);

// ── Products ──
export const getProducts = (params) => api.get('/products', { params });
export const getProduct = (idOrSlug) => api.get(`/products/${idOrSlug}`);
export const trackClick = (id) => api.post(`/products/${id}/click`);
export const createProduct = (formData) =>
  api.post('/products', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateProduct = (id, formData) =>
  api.put(`/products/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteProduct = (id) => api.delete(`/products/${id}`);
export const bulkActionProducts = (data) => api.post('/products/bulk', data);
export const getProductStats = () => api.get('/products/stats');

// ── Categories ──
export const getCategories = (params) => api.get('/categories', { params });
export const getCategory = (id) => api.get(`/categories/${id}`);
export const createCategory = (formData) =>
  api.post('/categories', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateCategory = (id, formData) =>
  api.put(`/categories/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteCategory = (id) => api.delete(`/categories/${id}`);

// ── Banners ──
export const getBanners = () => api.get('/banners');
export const createBanner = (formData) =>
  api.post('/banners', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateBanner = (id, formData) =>
  api.put(`/banners/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteBanner = (id) => api.delete(`/banners/${id}`);

// ── Contact ──
export const submitContact = (data) => api.post('/contact', data);
export const getContacts = (params) => api.get('/contact', { params });
export const markContactAsRead = (id) => api.put(`/contact/${id}/read`);
export const archiveContact = (id) => api.delete(`/contact/${id}`);

// ── Auth (admin) ──
export const login = (data) => api.post('/auth/login', data);
export const logout = () => api.post('/auth/logout');
export const getMe = () => api.get('/auth/me');

export default api;
