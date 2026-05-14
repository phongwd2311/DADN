import apiClient from './client';

export const dashboardApi = {
  getOverview: async () => {
    const response = await apiClient.get('/dashboard');
    return response.data;
  },
};
