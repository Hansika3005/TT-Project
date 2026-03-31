import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';
import { useAuthStore } from './store/authStore';

// Layouts
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';
import BackendStatusBanner from './components/layout/BackendStatusBanner';

// Pages
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Orders from './pages/Orders';
import Agents from './pages/Agents';
import Customers from './pages/Customers';

/**
 * PublicRoute: Only accessible when NOT logged in.
 * Logged-in users are redirected to /dashboard.
 */
const PublicRoute = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return !isAuthenticated ? <Outlet /> : <Navigate to="/dashboard" replace />;
};

/**
 * ProtectedRoute: Only accessible when logged in.
 * Optionally restricts by role.
 */
const ProtectedRoute = ({ allowedRoles } = {}) => {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user?.role)) return <Navigate to="/dashboard" replace />;
  return <Outlet />;
};

function App() {
  const { isAuthenticated, isBackendDown, checkHealth } = useAuthStore();

  // ── Initial Health Check ────────────────────────────────────────────────────
  useEffect(() => {
    checkHealth();
  }, [checkHealth]);

  // ── Silent Background Retry ────────────────────────────────────────────────
  useEffect(() => {
    if (!isBackendDown) return;
    
    const interval = setInterval(() => {
      console.log('[System]: Silent background health check...');
      checkHealth();
    }, 25000); // 25 seconds

    return () => clearInterval(interval);
  }, [isBackendDown, checkHealth]);

  return (
    <Router>
      <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
        <BackendStatusBanner />
        <Toaster position="top-right" richColors closeButton />
        <Routes>
          {/* Public Authentication Flow */}
          <Route element={<PublicRoute />}>
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Login />} /> {/* Login handles both via state */}
            </Route>
          </Route>

          {/* Private Application Flow */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/orders" element={<Orders />} />
              
              <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
                <Route path="/agents" element={<Agents />} />
              </Route>
              
              <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'DELIVERY_AGENT']} />}>
                <Route path="/customers" element={<Customers />} />
              </Route>
            </Route>
          </Route>

          {/* Catch-all Redirect */}
          <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
