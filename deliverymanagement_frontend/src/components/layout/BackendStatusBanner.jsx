import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, RefreshCw, X } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { useState } from "react";
import { cn } from "../../utils/cn";

export default function BackendStatusBanner() {
  const { isBackendDown, checkHealth } = useAuthStore();
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    setIsRetrying(true);
    await checkHealth();
    setIsRetrying(false);
  };

  return (
    <AnimatePresence>
      {isBackendDown && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-[100] w-full overflow-hidden bg-amber-500/10 border-b border-amber-500/20 backdrop-blur-md"
        >
          <div className="mx-auto max-w-7xl px-4 py-2 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-1 items-center gap-2 min-w-0">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-amber-500/20 text-amber-500 shadow-sm">
                  <AlertCircle className="h-4 w-4" aria-hidden="true" />
                </span>
                <p className="truncate text-xs font-semibold text-amber-500/90 uppercase tracking-wider">
                  System Offline
                  <span className="hidden sm:inline font-medium lowercase tracking-normal text-muted-foreground ml-2">
                    — Backend server is not reachable. Some features are limited.
                  </span>
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <button
                  onClick={handleRetry}
                  disabled={isRetrying}
                  className={cn(
                    "flex items-center gap-1.5 rounded-full bg-amber-500 px-3 py-1 text-xs font-bold text-white shadow-lg shadow-amber-500/20 transition-all hover:bg-amber-600 active:scale-95 disabled:opacity-50",
                    isRetrying && "cursor-not-allowed"
                  )}
                >
                  <RefreshCw className={cn("h-3.5 w-3.5", isRetrying && "animate-spin")} />
                  {isRetrying ? "Checking..." : "Reconnect"}
                </button>
              </div>
            </div>
          </div>
          {/* Subtle bottom glow */}
          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
