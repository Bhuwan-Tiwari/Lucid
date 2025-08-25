

import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const errorMessage = error.response?.data?.error || error.message || 'An error occurred';
    return Promise.reject(new Error(errorMessage));
  }
);

export const emailAPI = {
  getConfig: () => api.get('/api/emails/config'),

  getEmails: (params = {}) => api.get('/api/emails', { params }),

  getEmailById: (id) => api.get(`/api/emails/${id}`),

  getReceivingChain: (id) => api.get(`/api/emails/${id}/receiving-chain`),

  getESPInfo: (id) => api.get(`/api/emails/${id}/esp`),

  processEmails: () => api.post('/api/emails/process'),


  deleteEmail: (id) => api.delete(`/api/emails/${id}`),

  getStats: () => api.get('/api/emails/stats/summary'),
};

export const healthAPI = {
  getHealth: () => api.get('/health'),

  getDetailedHealth: () => api.get('/health/detailed'),
};


export const apiUtils = {
  handleError: (error) => {
    console.error('API Error:', error);
    
    if (error.code === 'ECONNABORTED') {
      return 'Request timeout. Please try again.';
    }
    
    if (error.code === 'ERR_NETWORK') {
      return 'Network error. Please check your connection.';
    }
    
    return error.message || 'An unexpected error occurred.';
  },

  formatResponse: (response) => {
    if (response.success) {
      return response.data;
    }
    throw new Error(response.error || 'API request failed');
  },

  checkConnection: async () => {
    try {
      await healthAPI.getHealth();
      return true;
    } catch (error) {
      return false;
    }
  },
};

export default api;
