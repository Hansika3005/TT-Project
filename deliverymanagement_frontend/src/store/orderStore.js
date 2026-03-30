import { create } from 'zustand';
import { orderService } from '../services/orderService';
import { toast } from 'sonner';

export const useOrderStore = create((set, get) => ({
  orders: [],
  dashboardStats: null,
  isLoading: false,

  fetchOrders: async () => {
    set({ isLoading: true });
    try {
      const data = await orderService.getOrders();
      set({ orders: data, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
    }
  },

  createOrder: async (orderData) => {
    try {
      const newOrder = await orderService.createOrder(orderData);
      set((state) => ({ orders: [...state.orders, newOrder] }));
      toast.success("Order created successfully");
    } catch (error) {
      // Handled by global interceptor
    }
  },

  updateOrderStatus: async (orderId, newStatus) => {
    try {
      const updatedOrder = await orderService.updateStatus(orderId, { status: newStatus });
      set((state) => ({
        orders: state.orders.map((o) =>
          o.id === orderId ? { ...o, ...updatedOrder } : o
        )
      }));
      toast.success("Status updated");
    } catch (error) {
      // Handled globally
    }
  },
  
  deleteOrder: async (orderId) => {
    try {
      await orderService.deleteOrder(orderId);
      set((state) => ({
        orders: state.orders.filter(o => o.id !== orderId)
      }));
      toast.success("Order removed");
    } catch (error) {
      // Handled globally
    }
  },

  fetchDashboardStats: async () => {
    set({ isLoading: true });
    try {
      // For now, if backend doesn't have a /dashboard stats endpoint,
      // we can aggregate it from the orders list as a fallback gracefully!
      const data = await orderService.getOrders();
      
      const totalR = data.reduce((acc, curr) => acc + (curr.amount || 0), 0);
      const delivered = data.filter(d => d.status === 'DELIVERED').length;
      const pending = data.filter(d => d.status === 'PENDING').length;

      set({ 
        dashboardStats: {
          totalOrders: data.length,
          deliveredOrders: delivered,
          pendingOrders: pending,
          revenue: totalR,
          chartData: [ // Fallback chart since real mapping requires a dedicated API
            { name: "Orders", orders: data.length, revenue: totalR },
          ]
        }, 
        isLoading: false 
      });
    } catch (error) {
      set({ isLoading: false });
    }
  },
}));
