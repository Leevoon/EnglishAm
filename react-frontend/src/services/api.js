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
  submitTest: (testId, answers, userId, duration) => api.post(`/tests/${testId}/submit`, { answers, userId, duration }),
  getHistory: (userId, languageId = 1) => api.get(`/tests/history/${userId}?languageId=${languageId}`),
  getStatistics: (userId) => api.get(`/tests/statistics/${userId}`)
};

// TOEFL API
export const toeflAPI = {
  getReading: (languageId = 1) => api.get(`/toefl/reading?languageId=${languageId}`),
  getListening: (languageId = 1) => api.get(`/toefl/listening?languageId=${languageId}`),
  getSpeaking: (languageId = 1) => api.get(`/toefl/speaking?languageId=${languageId}`),
  getWriting: (languageId = 1) => api.get(`/toefl/writing?languageId=${languageId}`),
  getComplete: (languageId = 1) => api.get(`/toefl/complete?languageId=${languageId}`),
  getSection: (section, id, languageId = 1) => api.get(`/toefl/${section}/${id}?languageId=${languageId}`),
  submitSection: (section, id, answers, duration) => api.post(`/toefl/${section}/${id}/submit`, { answers, duration })
};

// IELTS API
export const ieltsAPI = {
  getReading: (languageId = 1) => api.get(`/ielts/reading?languageId=${languageId}`),
  getListening: (languageId = 1) => api.get(`/ielts/listening?languageId=${languageId}`),
  getSpeaking: (languageId = 1) => api.get(`/ielts/speaking?languageId=${languageId}`),
  getWriting: (languageId = 1) => api.get(`/ielts/writing?languageId=${languageId}`),
  getComplete: (languageId = 1) => api.get(`/ielts/complete?languageId=${languageId}`),
  getSection: (section, id, languageId = 1) => api.get(`/ielts/${section}/${id}?languageId=${languageId}`),
  submitSection: (section, id, answers, duration) => api.post(`/ielts/${section}/${id}/submit`, { answers, duration })
};

// Content API
export const contentAPI = {
  getAbout: (languageId = 1) => api.get(`/content/about?languageId=${languageId}`),
  getContact: (languageId = 1) => api.get(`/content/contact?languageId=${languageId}`),
  sendContact: (data) => api.post('/content/contact/send', data)
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
  getPageImages: (keys) => api.get(`/home/page-images${keys ? `?keys=${keys}` : ''}`),
  getCategories: (languageId = 1) => api.get(`/home/categories?languageId=${languageId}`)
};

// FAQ API
export const faqAPI = {
  getAll: (languageId = 1) => api.get(`/faq?languageId=${languageId}`),
  // Also available via home route for homepage section
  getForHome: (languageId = 1) => api.get(`/home/faq?languageId=${languageId}`)
};

// Settings API
export const settingsAPI = {
  getSettings: () => api.get('/settings'),
  getSocials: () => api.get('/socials'),
  getTranslations: (languageId = 1) => api.get(`/translations?languageId=${languageId}`)
};

// Lessons API
export const lessonsAPI = {
  getAll: (params) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/lessons?${queryString}`);
  }
};

// Trainings API
export const trainingsAPI = {
  getAll: (languageId = 1) => api.get(`/trainings?languageId=${languageId}`)
};

export default api;
