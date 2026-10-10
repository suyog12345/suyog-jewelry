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
    return Promise.reject({ message, status: error.response?.status });
  }
);

// ── Products ──
export const getProducts = (params) => api.get('/products', { params });
export const getProduct = (idOrSlug) => api.get(`/products/${idOrSlug}`);
export const trackClick = (id) => api.post(`/products/${id}/click`);

// ── Categories ──
export const getCategories = () => api.get('/categories');
export const getCategory = (id) => api.get(`/categories/${id}`);

// ── Banners ──
export const getBanners = () => api.get('/banners');

// ── Contact ──
export const submitContact = (data) => api.post('/contact', data);

// ── Auth (admin) ──
export const login = (data) => api.post('/auth/login', data);
export const logout = () => api.post('/auth/logout');
export const getMe = () => api.get('/auth/me');

export default api;
