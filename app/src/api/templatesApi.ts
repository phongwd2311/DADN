import apiClient from './client';

export const templatesApi = {
  getAll: async () => {
    const response = await apiClient.get('/templates');
    return response.data;
  },

  create: async (template_name: string, input: Record<string, unknown>) => {
    const response = await apiClient.post('/templates', {
      template_name,
      input,
    });
    return response.data;
  },

  delete: async (id: number) => {
    const response = await apiClient.delete(`/templates/${id}`);
    return response.data;
  },
};
