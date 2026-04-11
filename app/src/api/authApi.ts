import apiClient from './client';

export const authApi = {
  login: async (email?: string, password?: string) => {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data; // { token, user: { id, email, username, role } }
  },
  
  register: async (username?: string, email?: string, password?: string) => {
    const response = await apiClient.post('/auth/register', { username, email, password });
    return response.data; // { message, token, user }
  },

  getMe: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data; // { user: { id, email, username, role } }
  }
};
