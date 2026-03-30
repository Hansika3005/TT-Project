import { create } from 'zustand';
import { customerService } from '../services/customerService';
import { toast } from 'sonner';

export const useCustomerStore = create((set, get) => ({
  customers: [],
  isLoading: false,

  fetchCustomers: async () => {
    set({ isLoading: true });
    try {
      const data = await customerService.getCustomers();
      set({ customers: data, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
    }
  },

  createCustomer: async (customerData) => {
    try {
      const newCustomer = await customerService.createCustomer(customerData);
      set((state) => ({ customers: [...state.customers, newCustomer] }));
      toast.success("Customer profile created");
    } catch (error) {
      // Handled globally
    }
  },
}));
