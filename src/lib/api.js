import axios from 'axios';
import { getToken, logout } from './auth';

const backendUrl = String(import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');
const apiBaseUrl = backendUrl
  ? (backendUrl.endsWith('/api') ? backendUrl : `${backendUrl}/api`)
  : '/api';

const api = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      logout();
    }
    return Promise.reject(error);
  },
);

export default api;
