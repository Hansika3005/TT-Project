import api from './api';

export const agentService = {
  getAgents: async () => {
    const response = await api.get('/agent');
    return response.data;
  },

  createAgent: async (agentData) => {
    const response = await api.post('/agent', agentData);
    return response.data;
  },

  assignOrder: async (agentId, orderId) => {
    const response = await api.put(`/orders/${orderId}/assign/${agentId}`);
    return response.data;
  }
};
