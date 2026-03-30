import api from './api';

export const customerService = {
  getCustomers: async () => {
    const response = await api.get('/customers');
    return response.data;
  },

  createCustomer: async (customerData) => {
    const response = await api.post('/customers', customerData);
    return response.data;
  }
};
