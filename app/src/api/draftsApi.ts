import apiClient from './client';

export const draftsApi = {
  getAll: async () => {
    const response = await apiClient.get('/drafts');
    return response.data;
  },

  getLatest: async () => {
    const response = await apiClient.get('/drafts/latest');
    return response.data;
  },

  autosave: async (payload: {
    draft_id?: number;
    draft_name?: string;
    input: Record<string, unknown>;
    result?: Record<string, unknown> | null;
  }) => {
    const response = await apiClient.post('/drafts/autosave', payload);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await apiClient.delete(`/drafts/${id}`);
    return response.data;
  },
};
