import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { authService } from '../services/authService';
import { toast } from 'sonner';
import { getRoleLabel, normalizeRole } from '../utils/roleMapping';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      isBackendDown: false,
      // Store UI role labels locally for display preference
      pendingDisplayRoles: {}, 

      setBackendDown: (isDown) => set({ isBackendDown: isDown }),

      checkHealth: async () => {
        try {
          const { default: api } = await import('../services/api');
          // Use the lightweight public health endpoint instead of an authenticated route
          await api.get('/health', { suppressGlobalErrorToast: true });
          set({ isBackendDown: false });
          return true;
        } catch (error) {
          if (!error.response) {
            set({ isBackendDown: true });
          } else {
            set({ isBackendDown: false });
          }
          return false;
        }
      },

      login: async (credentials) => {
        set({ isLoading: true });
        try {
          const data = await authService.login(credentials);
          const token = data?.token || null;
          
          if (!token) {
            toast.error('Login failed: no token received from server.');
            set({ isLoading: false });
            return false;
          }

          const resolvedRole = normalizeRole(data?.user?.role || data?.role);
          if (!resolvedRole) {
            toast.error('Login response missing user role.');
            set({ isLoading: false });
            return false;
          }

          // Recovery displayRole: check if we have a locally saved preference for this email
          const savedDisplayRole = get().pendingDisplayRoles[credentials.email.toLowerCase()];

          const user = {
            name: data?.user?.name || credentials.email.split('@')[0],
            email: data?.user?.email || credentials.email.toLowerCase(),
            role: resolvedRole,
            displayRole: savedDisplayRole || getRoleLabel(resolvedRole),
          };

          console.log('[Auth Debug] response.data.role:', data?.role);
          console.log('[Auth Debug] normalized role from login response:', resolvedRole);

          set({ user, token, isAuthenticated: true, isLoading: false, isBackendDown: false });
          console.log('[Auth Debug] role stored in frontend state:', user.role);
          toast.success('Welcome back!');
          return true;
        } catch (error) {
          set({ isLoading: false });
          return false;
        }
      },

      register: async (userData) => {
        set({ isLoading: true });
        const { displayRole, ...apiData } = userData;
        try {
          await authService.register(apiData);
          
          // Save the displayRole preference locally
          if (displayRole) {
            set((state) => ({
              pendingDisplayRoles: {
                ...state.pendingDisplayRoles,
                [apiData.email.toLowerCase()]: displayRole
              }
            }));
          }

          set({ isLoading: false });
          toast.success('Account created! Please sign in.');
          return true;
        } catch (error) {
          set({ isLoading: false });
          return false;
        }
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false, isLoading: false });
      },
    }),
    {
      name: 'delivery-auth-storage',
      storage: createJSONStorage(() => localStorage),
      // Persist user, token, and the roles map
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token, 
        pendingDisplayRoles: state.pendingDisplayRoles 
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isAuthenticated = !!state.token;
        }
      },
    }
  )
);
