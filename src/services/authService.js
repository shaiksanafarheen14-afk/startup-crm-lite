import api from './api';

const authService = {
  register: async (name, email, password) => {
    const response = await api.post('/api/auth/register', { name, email, password });
    return response.data;
  },

  login: async (email, password) => {
    const response = await api.post('/api/auth/login', { email, password });
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('crm-token');
  },

  getProfile: async () => {
    const response = await api.get('/api/auth/profile');
    return response.data;
  },

  updateProfile: async (data) => {
    const response = await api.put('/api/auth/profile', data);
    return response.data;
  }
};

export default authService;
