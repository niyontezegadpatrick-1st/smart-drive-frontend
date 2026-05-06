import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

const API = 'https://smart-driving-site.onrender.com/api';

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('smartDriveUser');
    const savedToken = localStorage.getItem('smartDriveToken');
    if (savedUser && savedToken) {
      setCurrentUser(JSON.parse(savedUser));
      setToken(savedToken);
    }
    setLoading(false);
  }, []);

  const showToast = (message, type = 'success') => {
    const toast = document.createElement('div');
    toast.className = `fixed bottom-5 right-5 z-50 px-6 py-3 rounded-lg text-white font-semibold shadow-xl transition-all ${
      type === 'error' ? 'bg-red-500' : type === 'success' ? 'bg-green-500' : 'bg-gray-900'
    }`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  };

  const login = async (email, password) => {
    try {
      const res = await fetch(`${API}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'Login failed', 'error');
        return { success: false };
      }
      localStorage.setItem('smartDriveToken', data.token);
      localStorage.setItem('smartDriveUser', JSON.stringify(data.user));
      setToken(data.token);
      setCurrentUser(data.user);
      showToast(`Welcome back, ${data.user.name}!`, 'success');
      return { success: true, user: data.user };
    } catch (err) {
      showToast('Cannot connect to server', 'error');
      return { success: false };
    }
  };

  const signup = async (userData) => {
    try {
      const res = await fetch(`${API}/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'Registration failed', 'error');
        return { success: false };
      }
      localStorage.setItem('smartDriveToken', data.token);
      localStorage.setItem('smartDriveUser', JSON.stringify(data.user));
      setToken(data.token);
      setCurrentUser(data.user);
      showToast('Account created successfully!', 'success');
      return { success: true, user: data.user };
    } catch (err) {
      showToast('Cannot connect to server', 'error');
      return { success: false };
    }
  };

  const logout = () => {
    localStorage.removeItem('smartDriveToken');
    localStorage.removeItem('smartDriveUser');
    setToken(null);
    setCurrentUser(null);
    showToast('Logged out successfully', 'success');
  };

  const authFetch = async (url, options = {}) => {
    return fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    });
  };

  return (
    <AuthContext.Provider value={{ currentUser, token, loading, login, signup, logout, authFetch, showToast }}>
      {children}
    </AuthContext.Provider>
  );
};
