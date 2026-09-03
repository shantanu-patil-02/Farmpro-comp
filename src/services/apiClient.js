import axios from 'axios';

// Resolve API Base URL from environment variable or fallback to same-origin relative path
const BASE_URL = import.meta.env.VITE_API_URL || '';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token if present
apiClient.interceptors.request.use(
  config => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('farmpro_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  error => Promise.reject(error)
);

// Response interceptor to unwrap data and handle 401 token expiration
apiClient.interceptors.response.use(
  response => response.data,
  error => {
    // If 401 Unauthorized / Token Expired, clear stale token and notify app
    if (error.response && error.response.status === 401) {
      if (typeof window !== 'undefined') {
        const hadToken = localStorage.getItem('farmpro_token');
        if (hadToken) {
          localStorage.removeItem('farmpro_token');
          window.dispatchEvent(new CustomEvent('farmpro:auth_expired', {
            detail: { message: error.response.data?.error || 'Session expired. Please log in again.' }
          }));
        }
      }
    }

    const message =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      'Failed to connect to backend server.';
    return Promise.reject(new Error(message));
  }
);

// --- Auth APIs ---
export const authAPI = {
  register: data => apiClient.post('/api/auth/register', data),
  login: data => apiClient.post('/api/auth/login', data),
  getMe: () => apiClient.get('/api/auth/me'),
};

// --- Farm Profile APIs ---
export const farmAPI = {
  getMyFarm: () => apiClient.get('/api/farms/me'),
  updateMyFarm: data => apiClient.put('/api/farms/me', data),
  createFarm: data => apiClient.post('/api/farms', data),
  getById: id => apiClient.get(`/api/farms/${id}`),
};

// --- Crop APIs ---
export const cropsAPI = {
  getAll: params => apiClient.get('/api/crops', { params }),
  getById: id => apiClient.get(`/api/crops/${id}`),
};

// --- Recommendation APIs ---
export const recommendationsAPI = {
  generate: farmConditions => apiClient.post('/api/recommendations', farmConditions),
  getHistory: params => apiClient.get('/api/recommendations/history', { params }),
  getById: id => apiClient.get(`/api/recommendations/${id}`),
};

// --- Market APIs ---
export const marketAPI = {
  getMarket: params => apiClient.get('/api/market', { params }),
  getMarketByCrop: cropId => apiClient.get(`/api/market/${cropId}`),
  getOverview: () => apiClient.get('/api/market'),
};

// --- Weather APIs ---
export const weatherAPI = {
  getWeather: (location = 'Nagpur, Maharashtra') =>
    apiClient.get('/api/weather', { params: { location } }),
};

// --- Feedback APIs ---
export const feedbackAPI = {
  submit: data => apiClient.post('/api/feedback', data),
  getAll: () => apiClient.get('/api/feedback'),
};

// --- AI Chat APIs ---
export const aiAPI = {
  chat: (message, context = {}) => apiClient.post('/api/ai/chat', { message, context }),
};

// --- Subscription APIs ---
export const subscriptionsAPI = {
  getPlans: () => apiClient.get('/api/subscriptions/plans'),
  getStatus: params => apiClient.get('/api/subscriptions/status', { params }),
  subscribe: planId => apiClient.post('/api/subscriptions/subscribe', { planId }),
  checkout: planId => apiClient.post('/api/subscriptions/checkout', { planId }),
};

export default apiClient;
