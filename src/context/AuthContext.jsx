// src/context/AuthContext.jsx
// context/AuthContext.jsx
import { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { getUserProfile, loginUser, logoutUser, refreshToken } from "../services/api_auth";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const updateUser = (updatedUserData) => {
    const newUser = { ...user, ...updatedUserData };
    setUser(newUser);
    const storage = localStorage.getItem("token") ? localStorage : sessionStorage;
    storage.setItem("user", JSON.stringify(newUser));
  };

  const handleTokenRefresh = async () => {
    try {
      const newToken = await refreshToken();
      const storage = localStorage.getItem("token") ? localStorage : sessionStorage;
      storage.setItem("token", newToken);
      return newToken;
    } catch (error) {
      logout();
      throw error;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const userData = await getUserProfile(token);
        setUser(userData);
        const storage = localStorage.getItem("token") ? localStorage : sessionStorage;
        storage.setItem("user", JSON.stringify(userData));
      } catch (error) {
        if (error.response?.status === 401) {
          try {
            await handleTokenRefresh();
            const userData = await getUserProfile(token);
            setUser(userData);
          } catch (refreshError) {
            logout();
          }
        } else {
          logout();
        }
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);


  const login = async (email, password, rememberMe) => {
    setLoading(true);
    try {
      const response = await loginUser({ email, password });
      const { accessToken, user: userData } = response;

      // Determine storage method
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem("token", accessToken);
      storage.setItem("user", JSON.stringify(userData));

      // Clear opposite storage
      const oppositeStorage = rememberMe ? sessionStorage : localStorage;
      oppositeStorage.removeItem("token");
      oppositeStorage.removeItem("user");

      // Update state
      setUser(userData);
      setLoading(false);

      // Navigation
      navigate(userData.role === 'admin' ? '/admin' : '/');
      
      return userData;
    } catch (error) {
      setLoading(false);
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = () => {
    setLoading(true);
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
    setUser(null);
    setLoading(false);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      loading, 
      updateUser,
      handleTokenRefresh,
      isAuthenticated: !!user && !loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};