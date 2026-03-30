import { NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import {
  LayoutDashboard, Package, Users, Truck,
  LogOut, ChevronLeft, ChevronRight, Zap,
} from "lucide-react";
import { useState } from "react";
import { cn } from "../../utils/cn";
import { getRoleLabel } from "../../utils/roleMapping";
import { motion, AnimatePresence } from "framer-motion";

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, roles: ["ADMIN", "AGENT", "CUSTOMER"] },
    { name: "Orders",    href: "/orders",    icon: Package,         roles: ["ADMIN", "AGENT", "CUSTOMER"] },
    { name: "Agents",    href: "/agents",    icon: Truck,           roles: ["ADMIN"] },
    { name: "Customers", href: "/customers", icon: Users,           roles: ["ADMIN", "AGENT"] },
  ];

  const filteredItems = navItems.filter((item) =>
    item.roles.includes(user?.role || "CUSTOMER")
  );

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <motion.aside
      animate={{ width: isCollapsed ? 72 : 240 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="h-screen sticky top-0 flex flex-col z-20 shrink-0 overflow-hidden
                 border-r border-border/60 bg-card/80 backdrop-blur-xl"
    >
      {/* Subtle top glow line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      {/* Logo area */}
      <div className={cn("flex items-center gap-3 px-4 py-5", isCollapsed && "justify-center px-0")}>
        <motion.div
          whileHover={{ rotate: 10, scale: 1.05 }}
          className="h-8 w-8 shrink-0 rounded-lg bg-gradient-to-br from-primary to-accent
                     flex items-center justify-center text-white font-black text-sm shadow-lg glow-primary-sm"
        >
          <Zap className="h-4 w-4" />
        </motion.div>
        <AnimatePresence>
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="font-black text-base tracking-tight gradient-text truncate"
            >
              DeliveryApp
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-1 px-2 py-2">
        {filteredItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.href}
              to={item.href}
              title={isCollapsed ? item.name : undefined}
              className={({ isActive }) =>
                cn(
                  "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  "text-muted-foreground hover:text-foreground hover:bg-muted/60",
                  isActive
                    ? "text-primary bg-primary/10 shadow-[inset_0_0_0_1px_hsl(var(--primary)/0.2)]"
                    : "",
                  isCollapsed && "justify-center px-0"
                )
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute inset-0 rounded-lg bg-primary/10"
                      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    />
                  )}
                  <Icon
                    className={cn(
                      "relative z-10 h-[18px] w-[18px] shrink-0 transition-transform duration-200 group-hover:scale-110",
                      isActive && "text-primary drop-shadow-[0_0_6px_hsl(var(--primary)/0.7)]"
                    )}
                  />
                  <AnimatePresence>
                    {!isCollapsed && (
                      <motion.span
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -6 }}
                        transition={{ duration: 0.15 }}
                        className="relative z-10 truncate"
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom section: user info + collapse + logout */}
      <div className="px-2 pb-4 space-y-1 border-t border-border/40 pt-3">
        {/* User pill */}
        {!isCollapsed && (
          <div className="flex items-center gap-2.5 rounded-lg px-3 py-2 bg-muted/40 mx-0 mb-1">
            <div className="h-7 w-7 rounded-full bg-gradient-to-br from-primary/60 to-accent/60
                            flex items-center justify-center text-white font-bold text-xs shrink-0">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold truncate text-foreground">{user?.name || "User"}</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-primary/80 mt-0.5 truncate">
                {user?.displayRole || getRoleLabel(user?.role) || "Guest"}
              </p>
            </div>
          </div>
        )}

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground",
            "hover:bg-muted/60 hover:text-foreground transition-colors",
            isCollapsed && "justify-center px-0"
          )}
        >
          {isCollapsed
            ? <ChevronRight className="h-4 w-4 shrink-0" />
            : <><ChevronLeft className="h-4 w-4 shrink-0" /><span>Collapse</span></>
          }
        </button>

        <button
          onClick={handleLogout}
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium",
            "text-destructive/70 hover:text-destructive hover:bg-destructive/10 transition-colors",
            isCollapsed && "justify-center px-0"
          )}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </motion.aside>
  );
}
