// services/api_chat.js
import axios from 'axios';
import { refreshToken } from './api_auth';

const API_BASE_URL = 'http://localhost:5000/api/chat';

// Create axios instance with interceptors
const api = axios.create({
  baseURL: API_BASE_URL
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }).catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await refreshToken();
        localStorage.setItem('token', newToken);
        api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        processQueue(null, newToken);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export const getConversations = async () => {
  try {
    const response = await api.get('/');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const startConversation = async (announcementId) => {
  try {
    const response = await api.post(`/${announcementId}`, {});
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getMessages = async (conversationId) => {
  try {
    const response = await api.get(`/${conversationId}/messages`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const sendMessage = async (conversationId, content) => {
  try {
    const response = await api.post(`/${conversationId}/messages`, { content });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const markMessagesAsRead = async (conversationId) => {
  try {
    const response = await api.patch(`/${conversationId}/read`, {});
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};