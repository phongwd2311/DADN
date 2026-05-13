import apiClient from './client';

export const standardsApi = {
  getStandardTables: async () => {
    const response = await apiClient.get('/standards');
    return response.data;
  },

  getStandardTableByKey: async (tableKey: string) => {
    const response = await apiClient.get(`/standards/${tableKey}`);
    return response.data;
  }
};
