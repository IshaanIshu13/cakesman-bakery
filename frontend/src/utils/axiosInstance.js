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
      console.log(`🔗 ${config.method.toUpperCase()} ${config.url}`, {
        hasToken: true,
        tokenType: token === 'admin-token' ? 'admin' : 'user',
        hasData: !!config.data,
        authHeader: config.headers.Authorization
      });
    } else {
      console.log(`🔗 ${config.method.toUpperCase()} ${config.url}`, {
        hasToken: false,
        hasData: !!config.data
      });
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - SAFE handling of errors
// DO NOT logout on API errors - only on explicit logout or true auth failures
axiosInstance.interceptors.response.use(
  (response) => {
    console.log(`✓ ${response.status} ${response.config.url}`, {
      status: response.status,
      message: response.data?.message || 'Success'
    });
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url;
    const message = error.response?.data?.message || error.message;

    // CRITICAL: 401/403 should NOT automatically logout
    // These could be API-specific auth issues, not token expiry
    // Let the component handle the error appropriately
    if (status === 401) {
      console.warn(`⚠️ 401 Unauthorized on ${url}:`, message);
      console.warn('ℹ️ Token exists:', !!localStorage.getItem('authToken'));
      console.warn('ℹ️ NOT auto-logging out. Let component handle this.');
      // Do NOT remove token or redirect here
      // The component (AdminDashboard) will decide what to do
    } else if (status === 403) {
      console.warn(`⚠️ 403 Forbidden on ${url}:`, message);
      // Also don't auto-logout on 403 - it might be permission-based, not auth-based
    } else if (error.response) {
      console.error(`❌ ${status} ${url}`, {
        status,
        message,
        data: error.response.data
      });
    } else if (error.request) {
      console.error('❌ Network error - No response received:', error.message);
    } else {
      console.error('❌ Error:', error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
