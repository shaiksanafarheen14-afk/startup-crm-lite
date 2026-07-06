import axios from 'axios';
import toast from 'react-hot-toast';

// Create an Axios instance pointing to our backend API
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

// Request interceptor: Automatically add Authorization header to every request if a token exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('crm-token');
    if (token) {
      config.headers.Authorization = 'Bearer ' + token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Handle global 401s (unauthorized/expired) and network errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check if error is 401 Unauthorized
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('crm-token');
      // Redirect to login if not already there
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        window.location.href = '/login';
      }
    } else if (!error.response) {
      // Handle network errors where the server didn't respond
      toast.error("Cannot connect to server. Check your connection.");
    }
    return Promise.reject(error);
  }
);

export default api;
