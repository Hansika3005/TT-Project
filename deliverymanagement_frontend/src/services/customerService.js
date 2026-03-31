import api from './api';

export const customerService = {
  getCustomers: async () => {
    const response = await api.get('/customers');
    return response.data;
  },

  getCustomerByEmail: async (email) => {
    const response = await api.get(`/customers/by-email/${encodeURIComponent(email)}`);
    return response.data;
  },

  createCustomer: async (customerData) => {
    const response = await api.post('/customers', customerData);
    return response.data;
  },

  upsertCustomerByEmail: async (email, customerData) => {
    const response = await api.put(`/customers/by-email/${encodeURIComponent(email)}`, customerData);
    return response.data;
  },
};
