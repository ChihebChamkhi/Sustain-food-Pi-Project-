import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

// Create axios instance with interceptors
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

// Get token from storage (matches your login system)
const getAuthToken = () => {
  // Check both storage locations
  return localStorage.getItem("token") || 
         sessionStorage.getItem("token") ||
         localStorage.getItem("token") || 
         sessionStorage.getItem("token");
};

// Request interceptor
api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (!token) {
    console.warn("No authentication token found");
    throw new axios.Cancel("Authentication required");
  }
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      console.warn("Session expired - clearing tokens");
      // Clear all possible token locations
      ["authToken", "accessToken"].forEach(key => {
        localStorage.removeItem(key);
        sessionStorage.removeItem(key);
      });
    }
    return Promise.reject(error);
  }
);

export const fetchBusinesses = async () => {
  try {
    const response = await api.get("/reviews/businesses");
    return response.data;
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log("Request canceled:", error.message);
    } else {
      console.error("API Error:", error.config.url, error.response?.status);
    }
    throw error;
  }
};

export const submitReview = async (businessId, content) => {
  try {
    const response = await api.post("/reviews", { businessId, content });
    return response.data;
  } catch (error) {
    console.error("Review submission failed:", error);
    throw error;
  }
};


// services/reviewService.js
// Add this function to your existing service
export const getReviewsForBusiness = async (businessId) => {
    try {
      const response = await api.get(`/reviews/${businessId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching reviews:", error);
      throw error;
    }
  };




  

// Add to your existing service file
export const getReviewSuggestions = async (text) => {
    try {
      const response = await api.post('/reviews/suggestions', { text });
      return response.data.suggestions;
    } catch (error) {
      console.error("Suggestion error:", error);
      return []; // Fallback to no suggestions
    }
  };

  