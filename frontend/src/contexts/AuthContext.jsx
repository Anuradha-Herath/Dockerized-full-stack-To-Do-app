import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    const token = localStorage.getItem('authToken');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // For now, we'll simulate a user object
      setUser({ email: localStorage.getItem('userEmail') || 'user@example.com' });
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      // Simulate login API call
      // In a real app, this would make an actual API call to your backend
      if (email && password) {
        const token = 'fake-jwt-token';
        localStorage.setItem('authToken', token);
        localStorage.setItem('userEmail', email);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser({ email });
        return { success: true };
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const signup = async (email, password) => {
    try {
      // Simulate signup API call
      if (email && password) {
        const token = 'fake-jwt-token';
        localStorage.setItem('authToken', token);
        localStorage.setItem('userEmail', email);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser({ email });
        return { success: true };
      } else {
        throw new Error('Invalid input');
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const value = {
    user,
    login,
    signup,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
