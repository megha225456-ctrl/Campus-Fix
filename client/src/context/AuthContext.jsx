import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiRequest } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('campusfix_token'));
  const [loading, setLoading] = useState(true);

  // Check if token exists on initial app load and fetch current user
  useEffect(() => {
    const verifyUser = async () => {
      const storedToken = localStorage.getItem('campusfix_token');
      if (storedToken) {
        try {
          const res = await apiRequest('/auth/me', { token: storedToken });
          if (res.success) {
            setUser(res.user);
          } else {
            logout();
          }
        } catch (error) {
          console.warn('Session expired or invalid, logging out.');
          logout();
        }
      }
      setLoading(false);
    };

    verifyUser();
  }, []);

  const login = async (email, password) => {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: { email, password },
    });

    if (data.success && data.token) {
      localStorage.setItem('campusfix_token', data.token);
      setToken(data.token);
      setUser(data.user);
      return data.user;
    }
  };

  const register = async (userData) => {
    const data = await apiRequest('/auth/register', {
      method: 'POST',
      body: userData,
    });

    if (data.success && data.token) {
      localStorage.setItem('campusfix_token', data.token);
      setToken(data.token);
      setUser(data.user);
      return data.user;
    }
  };

  const logout = () => {
    localStorage.removeItem('campusfix_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
