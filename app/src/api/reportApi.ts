import apiClient from './client';

export const reportApi = {
  previewReport: async (payload: any) => {
    const response = await apiClient.post('/report/preview', payload);
    return response.data;
  }
};
