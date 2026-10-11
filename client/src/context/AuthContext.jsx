import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getMe, login as apiLogin, logout as apiLogout } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    try {
      const res = await getMe();
      if (res.data?.success && res.data?.data) {
        setUser(res.data.data);
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (credentials) => {
    try {
      const res = await apiLogin(credentials);
      if (res.data?.success) {
        setUser(res.data.data);
        toast.success(`Welcome back, ${res.data.data.name || 'Admin'}!`);
        return { success: true, data: res.data.data };
      }
      return { success: false, message: 'Login failed' };
    } catch (err) {
      const msg = err.message || 'Invalid credentials';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  const logout = async () => {
    try {
      await apiLogout();
      toast.success('Logged out successfully');
    } catch (err) {
      console.warn('Logout error (clearing local state):', err);
    } finally {
      setUser(null);
      window.location.href = '/admin/login';
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    checkAuth,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
