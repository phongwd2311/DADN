import apiClient from './client';

export const motorsApi = {
  getMotors: async () => {
    const response = await apiClient.get('/motors');
    return response.data;
  },

  getMotorById: async (id: string) => {
    const response = await apiClient.get(`/motors/${id}`);
    return response.data;
  }
};
