import api from './api';

export const agentService = {
  getAgents: async () => {
    const response = await api.get('/agents');
    return response.data;
  },

  createAgent: async (agentData) => {
    const response = await api.post('/agents', agentData);
    return response.data;
  },

  assignOrder: async (agentId, orderId) => {
    const response = await api.put(`/agents/${agentId}/assign/${orderId}`);
    return response.data;
  }
};
