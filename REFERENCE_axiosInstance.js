// ============================================
// FINAL AXIOSINSTANCE.JS (NEW FILE)
// Location: frontend/src/utils/axiosInstance.js
// ============================================

import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

// Create axios instance
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add token to every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401 errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

// ============================================
// WHAT THIS FILE DOES:
// ============================================
// 1. Creates axios instance with base URL
// 2. Request interceptor:
//    - Automatically adds Authorization header with Bearer token
//    - Token is read from localStorage
//    - Only added if token exists
//
// 3. Response interceptor:
//    - Catches 401 Unauthorized errors
//    - Clears localStorage (authToken and user)
//    - Redirects to /login
//    - Allows frontend to re-authenticate
//
// ============================================
// USAGE:
// ============================================
// import axiosInstance from './axiosInstance';
// 
// // All requests automatically include token
// const response = await axiosInstance.get('/products');
// const response = await axiosInstance.post('/orders', data);
// const response = await axiosInstance.put('/profile', updates);
