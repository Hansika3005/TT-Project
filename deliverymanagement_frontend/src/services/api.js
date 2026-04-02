import axios from 'axios';
import axiosRetry from 'axios-retry';
import { useAuthStore } from '../store/authStore';
import { toast } from 'sonner';

// Default to your Render backend if Vercel env var isn't configured yet.
// Also normalize so base always ends with `/api` (backend routes are `/api/auth/*`, `/api/health`).
const API_BASE_URL_RAW =
  import.meta.env.VITE_API_BASE_URL || 'https://delivery-management-backend-f6jn.onrender.com/api';

const API_BASE_URL = (() => {
  const trimmed = API_BASE_URL_RAW.replace(/\/+$/, '');
  return /\/api$/i.test(trimmed) ? trimmed : `${trimmed}/api`;
})();

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  // Render free instances can cold-start slowly; avoid false "offline" states.
  timeout: 60000,
});

// Retry on network errors and 5xx – up to 3 attempts with exponential backoff
axiosRetry(api, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) =>
    axiosRetry.isNetworkOrIdempotentRequestError(error) || (error.response?.status >= 500),
});

// ── Toast deduplication & Debounce ──────────────────────────────────────────
const activeToasts = new Set();
let lastErrorToastTime = 0;
const TOAST_DEBOUNCE_MS = 15000; // 15 seconds

const showToast = (message, type = 'error') => {
  const now = Date.now();
  if (type === 'error') {
    if (now - lastErrorToastTime < TOAST_DEBOUNCE_MS) return;
    lastErrorToastTime = now;
  }
  
  if (activeToasts.has(message)) return;
  activeToasts.add(message);
  
  toast[type](message, {
    onDismiss: () => activeToasts.delete(message),
    onAutoClose: () => activeToasts.delete(message),
  });
  
  setTimeout(() => activeToasts.delete(message), 6000);
};

// ── Request interceptor: attach JWT & Check Backend State ───────────────────
api.interceptors.request.use(
  (config) => {
    const { token, isBackendDown } = useAuthStore.getState();
    
    // Proactively block requests if we already know the backend is down
    // (excluding health checks or specific retry calls if we had them here, 
    // but usually App.jsx handles the manual re-check)
    if (isBackendDown && !config.url?.includes('/health')) {
      return Promise.reject(new Error('Backend is offline'));
    }

    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ── Response interceptor: unified error handling ─────────────────────────────
api.interceptors.response.use(
  (response) => {
    // If we get any successful response, the backend is UP
    if (useAuthStore.getState().isBackendDown) {
      useAuthStore.getState().setBackendDown(false);
    }
    return response;
  },
  (error) => {
    const { isBackendDown, setBackendDown, logout } = useAuthStore.getState();
    const suppressGlobalErrorToast = Boolean(error.config?.suppressGlobalErrorToast);

    if (error.response) {
      // If we got a response, the backend is UP
      if (isBackendDown) setBackendDown(false);

      const { status, data } = error.response;
      const backendMsg = data?.message || data?.error || data?.detail || (typeof data === 'string' ? data : null);

      if (status === 401) {
        if (!suppressGlobalErrorToast) {
          logout();
          showToast(backendMsg || 'Session expired. Please log in again.');
        }
      } else if (status === 403) {
        if (!suppressGlobalErrorToast) {
          showToast(backendMsg || 'Unauthorized action.');
        }
      } else if (status >= 500) {
        if (!suppressGlobalErrorToast) {
          showToast(backendMsg || 'Server error.');
        }
      } else {
        if (!suppressGlobalErrorToast) {
          showToast(backendMsg || 'An unexpected error occurred.');
        }
      }
    } else if (error.request) {
      // No response received — backend is likely offline
      setBackendDown(true);
      // Avoid noisy popups during Render cold starts; banner already informs the user.
      console.warn('[API]: Connection failed. Backend status set to OFFLINE.');
    } else {
      if (error.message !== 'Backend is offline' && !suppressGlobalErrorToast) {
        showToast(error.message || 'Request setup error.');
      }
    }

    return Promise.reject(error);
  }
);

export default api;
