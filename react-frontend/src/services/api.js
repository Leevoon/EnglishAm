import axios from 'axios';

const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
export const mediaURL = process.env.REACT_APP_MEDIA_URL || 'http://localhost:3001';

export const api = axios.create({ baseURL });

// attach token + language on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  const lang = localStorage.getItem('language_id');
  if (lang) config.headers['X-Language-Id'] = lang;
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response && err.response.status === 401) {
      // surface 401s but don't auto-redirect — page-level code decides.
    }
    return Promise.reject(err);
  },
);

export function media(p) {
  if (!p) return '';
  if (/^https?:\/\//i.test(p)) return p;
  return mediaURL + (p.startsWith('/') ? p : '/' + p);
}

export default api;
