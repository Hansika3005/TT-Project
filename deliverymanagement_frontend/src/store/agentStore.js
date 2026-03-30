import { create } from 'zustand';
import { agentService } from '../services/agentService';
import { toast } from 'sonner';

export const useAgentStore = create((set, get) => ({
  agents: [],
  isLoading: false,

  fetchAgents: async () => {
    set({ isLoading: true });
    try {
      const data = await agentService.getAgents();
      set({ agents: data, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
    }
  },

  createAgent: async (agentData) => {
    try {
      const newAgent = await agentService.createAgent(agentData);
      set((state) => ({ agents: [...state.agents, newAgent] }));
      toast.success("Agent added successfully");
    } catch (error) {
      // Handled globally
    }
  },
}));
