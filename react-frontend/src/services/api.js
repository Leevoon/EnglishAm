import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Categories API
export const categoriesAPI = {
  getAll: (languageId = 1) => api.get(`/categories?languageId=${languageId}`),
  getById: (id, languageId = 1) => api.get(`/categories/${id}?languageId=${languageId}`),
  getSubcategories: (id, languageId = 1) => api.get(`/categories/${id}/subcategories?languageId=${languageId}`),
  getTestCategoriesForMenu: (languageId = 1) => api.get(`/categories/menu/test-categories?languageId=${languageId}`),
  getTestCategories: (categoryId, languageId = 1) => api.get(`/categories/${categoryId}/test-categories?languageId=${languageId}`)
};

// Tests API
export const testsAPI = {
  getCategories: (categoryId, languageId = 1) => api.get(`/tests/categories/${categoryId}?languageId=${languageId}`),
  getFilters: (categoryId, languageId = 1) => api.get(`/tests/categories/${categoryId}/filters?languageId=${languageId}`),
  getLevels: (languageId = 1) => api.get(`/tests/levels?languageId=${languageId}`),
  getTests: (params) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/tests?${queryString}`);
  },
  getTest: (testId, languageId = 1) => api.get(`/tests/${testId}?languageId=${languageId}`),
  submitTest: (testId, answers) => api.post(`/tests/${testId}/submit`, { answers })
};

// TOEFL API
export const toeflAPI = {
  getReading: () => api.get('/toefl/reading'),
  getListening: () => api.get('/toefl/listening'),
  getSpeaking: () => api.get('/toefl/speaking'),
  getWriting: () => api.get('/toefl/writing'),
  getComplete: () => api.get('/toefl/complete'),
  getSection: (section, id) => api.get(`/toefl/${section}/${id}`),
  submitSection: (section, id, answers) => api.post(`/toefl/${section}/${id}/submit`, { answers })
};

// IELTS API
export const ieltsAPI = {
  getReading: () => api.get('/ielts/reading'),
  getListening: () => api.get('/ielts/listening'),
  getSpeaking: () => api.get('/ielts/speaking'),
  getWriting: () => api.get('/ielts/writing'),
  getComplete: () => api.get('/ielts/complete'),
  getSection: (section, id) => api.get(`/ielts/${section}/${id}`),
  submitSection: (section, id, answers) => api.post(`/ielts/${section}/${id}/submit`, { answers })
};

// Content API
export const contentAPI = {
  getAbout: (languageId = 1) => api.get(`/content/about?languageId=${languageId}`),
  getContact: (languageId = 1) => api.get(`/content/contact?languageId=${languageId}`)
};

// Ads API
export const adsAPI = {
  getTestAd: (testId) => api.get(`/ads/test/${testId}`)
};

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (email, password) => api.post('/auth/login', { email, password }),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  guestLogin: () => api.post('/auth/guest'),
  changePassword: (currentPassword, newPassword) => 
    api.post('/auth/change-password', { currentPassword, newPassword })
};

// Home API
export const homeAPI = {
  getSlideshow: (languageId = 1) => api.get(`/home/slideshow?languageId=${languageId}`),
  getAbout: (languageId = 1) => api.get(`/home/about?languageId=${languageId}`),
  getWhyChoose: (languageId = 1) => api.get(`/home/why-choose?languageId=${languageId}`),
  getMemberships: (languageId = 1) => api.get(`/home/memberships?languageId=${languageId}`),
  getTestimonials: (limit = 5) => api.get(`/home/testimonials?limit=${limit}`),
  getNews: (languageId = 1, limit = 3) => api.get(`/home/news?languageId=${languageId}&limit=${limit}`),
  getGallery: (limit = 6) => api.get(`/home/gallery?limit=${limit}`),
  getPageImages: (keys) => api.get(`/home/page-images${keys ? `?keys=${keys}` : ''}`)
};

export default api;
