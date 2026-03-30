import api from './api';

export const orderService = {
  getOrders: async () => {
    const response = await api.get('/orders');
    return response.data; // Expecting flat array [] per user's requirement
  },

  createOrder: async (orderData) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  updateStatus: async (id, statusData) => {
    const response = await api.put(`/orders/${id}`, statusData);
    return response.data;
  },

  deleteOrder: async (id) => {
    const response = await api.delete(`/orders/${id}`);
    return response.data;
  },
};
