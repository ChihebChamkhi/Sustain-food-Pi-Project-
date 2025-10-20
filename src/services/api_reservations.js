import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add request interceptor to include token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const createReservation = async (reservationData) => {
  try {
    const response = await api.post('/reservations', reservationData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message || 'Failed to create reservation';
  }
};

export const getReservations = async (type = null, status = null) => {
  try {
    const params = {};
    if (type) params.type = type;
    if (status) params.status = status;
    
    const response = await api.get('/reservations', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message || 'Failed to fetch reservations';
  }
};

export const getReservationStats = async () => {
  try {
    const response = await api.get('/reservations/stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching reservation stats:', error);
    throw error.response?.data?.error || error.message || 'Failed to fetch reservation statistics';
  }
};

export const updateReservationStatus = async (reservationId, status) => {
  try {
    const response = await api.put(`/reservations/${reservationId}/status`, { status });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message || 'Failed to update reservation status';
  }
};

export const cancelReservation = async (reservationId) => {
  try {
    const response = await api.put(`/reservations/${reservationId}/cancel`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message || 'Failed to cancel reservation';
  }
};

export const getRouteSuggestions = async (reservationId, userLocation) => {
  try {
    const response = await api.post(
      `/reservations/${reservationId}/routes`,
      { 
        userLocation: [userLocation.lng, userLocation.lat] // [longitude, latitude]
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message || 'Failed to get route suggestions';
  }
};

export const confirmRoute = async (reservationId, route) => {
  try {
    const response = await api.post(
      `/reservations/${reservationId}/confirm-route`,
      { route }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message || 'Failed to confirm route';
  }
};