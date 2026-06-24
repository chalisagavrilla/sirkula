import { apiRequest } from './api';

export const authService = {
  login: async (email, password) => {
    return await apiRequest('auth/login.php', 'POST', { email, password });
  },
  
  register: async (wargaData) => {
    return await apiRequest('auth/register.php', 'POST', wargaData);
  },
  
  logout: async () => {
    return await apiRequest('auth/logout.php', 'POST');
  }
};