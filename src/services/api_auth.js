import axios from "axios";

const API_BASE_URL_AUTH = "http://localhost:5000/api/auth"; // Backend base URL

// Axios instance for auth-related requests
const api_auth = axios.create({
  baseURL: API_BASE_URL_AUTH,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // For cookies if needed
});





export const refreshToken = async () => {
  try {
    const response = await axios.post(`${API_BASE_URL_AUTH}/refresh`, {}, {
      withCredentials: true // For HTTP-only cookies
    });
    return response.data.accessToken;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Register a new user
export const registerUser = async (userData) => {
  try {
    const response = await api_auth.post("/register", userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Login user
export const loginUser = async (credentials) => {
  try {
    const response = await api_auth.post("/login", credentials);
    return {
      accessToken: response.data.accessToken,
      user: {
        _id: response.data._id,
        name: response.data.name,
        email: response.data.email,
        role: response.data.role
      }
    };
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Logout user
export const logoutUser = async () => {
  try {
    const response = await api_auth.post("/logout");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Fetch user profile
export const getUserProfile = async (token) => {
  try {
    const response = await axios.get(`${API_BASE_URL_AUTH}/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data; // User profile data
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Update user profile
export const updateProfile = async (token, updatedData) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL_AUTH}/updateProfile`, 
      updatedData,
      {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Change password
export const changePassword = async (token, passwordData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL_AUTH}/change-password`,
      passwordData,
      {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

  // Forgot Password - Request Password Reset Link
export const forgotPassword = async (email, recaptchaToken) => {
    try {
      const response = await api_auth.post('/forgot-password', { email, recaptchaToken });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  };
  

// Reset Password - Submit New Password
export const resetPassword = async (resetToken, newPassword) => {
    console.log("Resetting password with payload:", { resetToken, newPassword });

    try {
        const response = await api_auth.post('/reset-password', { resetToken, newPassword });
        return response.data;
    } catch (error) {
        console.error("Error during password reset:", error.response ? error.response.data : error.message);
        throw error.response?.data || error.message;
    }
};
  
  // Fetch all users
export const getAllUsers = async (token) => {
    try {
        const response = await axios.get(`${API_BASE_URL_AUTH}/getAllUsers`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

// Delete user
export const deleteUser = async (id) => {
    try {
        const response = await axios.delete(`${API_BASE_URL_AUTH}/deleteUser/${id}`);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};


// Block or Unblock user
// Block or Unblock user
export const blockUser = async (id, isBlocked, token) => {
  try {
      const response = await axios.put(
          `${API_BASE_URL_AUTH}/block-user/${id}`, 
          { isBlocked },
          {
              headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
              },
              withCredentials: true // Add this if using cookies
          }
      );
      return response.data;
  } catch (error) {
      console.error('Block user error:', error.response?.data || error.message);
      throw error.response?.data || { message: "An error occurred while blocking/unblocking user" };
  }
};

// upload avatar 
export const uploadAvatar = async (token, formData) => {
  try {
    const response = await fetch(`http://localhost:5000/api/auth/upload-avatar`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to upload avatar');
    }
    
    return data;
  } catch (error) {
    console.error('Avatar upload error:', error);
    throw error;
  }
};


// Get user statistics
export const getUserStats = async (token) => {
  try {
      const response = await axios.get(`${API_BASE_URL_AUTH}/user-stats`, {
          headers: {
              Authorization: `Bearer ${token}`,
          },
      });
      return response.data;
  } catch (error) {
      throw error.response?.data || error.message;
  }
};


  
