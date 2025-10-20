// services/api_announcements.js
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Add request interceptor to include token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getAnnouncements = async (filters = {}) => {
  try {
    const response = await api.get('/announcements', { params: filters });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch announcements';
  }
};

export const getAnnouncementById = async (id) => {
  try {
    // Validate ID format before making the request
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      throw new Error('Invalid announcement ID format');
    }

    const response = await api.get(`/announcements/${id}`);
    
    if (response.status === 404) {
      throw new Error('Announcement not found');
    }
    
    return response.data;
  } catch (error) {
    console.error('Error fetching announcement:', error);
    throw new Error(
      error.response?.data?.message || 
      error.response?.data?.error || 
      error.message || 
      'Failed to fetch announcement details'
    );
  }
};

export const createAnnouncement = async (formData) => {
  try {
    const response = await api.post('/announcements', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || 
                     error.response.data.error || 
                     'Failed to create announcement');
    } else {
      throw new Error(error.message || 'Network error');
    }
  }
};

