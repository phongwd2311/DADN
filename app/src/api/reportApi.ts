import apiClient from './client';

export const reportApi = {
  previewReport: async (payload: any) => {
    const response = await apiClient.post('/report/preview', payload);
    return response.data;
  },

  exportPdf: async (payload: any) => {
    const response = await apiClient.post('/report/pdf', payload, {
      responseType: 'arraybuffer',
    });
    return response;
  },

  getPrintHtml: async (payload: any) => {
    const response = await apiClient.post('/report/print', payload);
    return response.data;
  },
};
