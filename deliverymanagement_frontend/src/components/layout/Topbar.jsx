import { useAuthStore } from "../../store/authStore";
import { Bell, Search, Moon, Sun } from "lucide-react";
import { useState, useEffect } from "react";
import { Input } from "../ui/Input";
import { getRoleLabel, normalizeRole } from "../../utils/roleMapping";

export default function Topbar() {
  const { user } = useAuthStore();
  const [theme, setTheme] = useState("light");
  const role = normalizeRole(user?.role);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  useEffect(() => {
    // Check initial theme from system or class
    if (document.documentElement.classList.contains("dark")) {
      setTheme("dark");
    }
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    if (theme === "light") {
      root.classList.add("dark");
      setTheme("dark");
    } else {
      root.classList.remove("dark");
      setTheme("light");
    }
  };

  return (
    <header className="h-16 border-b border-border/40 bg-background/60 backdrop-blur-xl sticky top-0 z-30 flex items-center justify-between px-6 shadow-sm">
      <div className="flex-1 flex max-w-sm">
        <div className="relative w-full group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            type="search"
            placeholder="Search dashboard..."
            className="pl-10 h-10 w-full !rounded-full bg-muted/40 border-border/20 focus-visible:bg-background/80 focus-visible:ring-primary/30 transition-all duration-300"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-all duration-200"
          title="Toggle theme"
        >
          {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
        </button>
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsNotifOpen((v) => !v)}
            className="p-2.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground relative transition-all duration-200 group"
            aria-haspopup="menu"
            aria-expanded={isNotifOpen}
            title="Notifications"
          >
          <Bell size={18} />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary ring-2 ring-background group-hover:scale-110 transition-transform"></span>
          </button>
          {isNotifOpen && (
            <div
              role="menu"
              className="absolute right-0 mt-2 w-72 rounded-xl border border-border/60 bg-card/95 backdrop-blur-md shadow-2xl overflow-hidden z-50"
            >
              <div className="px-4 py-3 border-b border-border/40">
                <p className="text-sm font-bold">Notifications</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">No new notifications</p>
              </div>
              <div className="px-4 py-3 text-xs text-muted-foreground">
                This is a placeholder panel. Hook it to backend events later.
              </div>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-3 pl-4 ml-2 border-l border-border/40">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold leading-none text-foreground">{user?.name || "User"}</p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-primary mt-1 opacity-70">
              {getRoleLabel(role)}
            </p>
          </div>
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-accent text-white flex items-center justify-center font-black shadow-lg glow-primary-sm transform hover:scale-105 transition-transform cursor-pointer">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
        </div>
      </div>
    </header>
  );
}
