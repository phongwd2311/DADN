import apiClient from './client';

export const sessionApi = {
  getAll: async () => {
    const response = await apiClient.get('/sessions');
    return response.data; // { sessions: [...], total: N }
  },

  getById: async (id: number) => {
    const response = await apiClient.get(`/sessions/${id}`);
    return response.data;
  },

  create: async (session_name: string, inputData: any, resultData: any) => {
    const response = await apiClient.post('/sessions', {
      session_name,
      input: inputData,
      result: resultData
    });
    return response.data;
  },

  update: async (
    id: number,
    data: { session_name?: string; status?: "DRAFT" | "IN_PROGRESS" | "COMPLETED" | "FAILED"; input?: any; result?: any },
  ) => {
    const response = await apiClient.put(`/sessions/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await apiClient.delete(`/sessions/${id}`);
    return response.data;
  }
};
