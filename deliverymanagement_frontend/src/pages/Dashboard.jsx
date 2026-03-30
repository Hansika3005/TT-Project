import { useEffect } from "react";
import { useOrderStore } from "../store/orderStore";
import { useAuthStore } from "../store/authStore";
import {
  Package, Truck, CircleDollarSign, Clock,
  TrendingUp, TrendingDown, ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar, Cell,
} from "recharts";

// ── Skeleton ──────────────────────────────────────────────────────────────────
function SkeletonCard() {
  return <div className="skeleton h-32 rounded-2xl" />;
}

// ── KPI Card ──────────────────────────────────────────────────────────────────
const KPI_CONFIG = [
  {
    key: "revenue",
    label: "Gross Revenue",
    icon: CircleDollarSign,
    gradient: "from-violet-600 to-purple-500",
    glow: "hsl(265 75% 55% / 0.25)",
    format: (v) => `$${parseFloat(v || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
  },
  {
    key: "totalOrders",
    label: "Total Orders",
    icon: Package,
    gradient: "from-blue-600 to-cyan-500",
    glow: "hsl(210 100% 55% / 0.2)",
    format: (v) => v,
  },
  {
    key: "deliveredOrders",
    label: "Delivered",
    icon: Truck,
    gradient: "from-emerald-600 to-teal-500",
    glow: "hsl(160 84% 40% / 0.2)",
    format: (v) => v,
  },
  {
    key: "pendingOrders",
    label: "Pending",
    icon: Clock,
    gradient: "from-amber-500 to-orange-500",
    glow: "hsl(38 92% 50% / 0.2)",
    format: (v) => v,
  },
];

function KpiCard({ config, value, idx }) {
  const Icon = config.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.06, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className="relative rounded-2xl overflow-hidden border border-border/50 bg-card/60 backdrop-blur-sm"
      style={{ boxShadow: `0 4px 24px ${config.glow}` }}
    >
      {/* gradient top strip */}
      <div className={`h-1 w-full bg-gradient-to-r ${config.gradient}`} />
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
              {config.label}
            </p>
            <p className="text-3xl font-black tracking-tight">{config.format(value)}</p>
          </div>
          <div className={`p-2.5 rounded-xl bg-gradient-to-br ${config.gradient} shadow-lg`}>
            <Icon className="h-5 w-5 text-white" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Custom Tooltip ─────────────────────────────────────────────────────────────
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-border/60 bg-card/95 backdrop-blur-md p-3 shadow-2xl text-sm">
      <p className="font-bold text-foreground mb-1">{label}</p>
      {payload.map((entry) => (
        <p key={entry.dataKey} style={{ color: entry.color }} className="font-medium">
          {entry.name}: {entry.name === "Revenue" ? `$${entry.value?.toLocaleString()}` : entry.value}
        </p>
      ))}
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const { dashboardStats, fetchDashboardStats, isLoading } = useOrderStore();
  const { user } = useAuthStore();

  useEffect(() => { fetchDashboardStats(); }, [fetchDashboardStats]);

  // ── Role-Based KPI Filtering ───────────────────────────────────────────────
  const filteredKpis = KPI_CONFIG.filter((cfg) => {
    if (user?.role === "ADMIN") return true;
    // Hide revenue/financials for Customers and Agents
    return cfg.key !== "revenue";
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary mb-1">
            <TrendingUp className="h-3.5 w-3.5" /> Live Overview
          </div>
          <h1 className="text-4xl font-black tracking-tight gradient-text">
            Operations Console
          </h1>
          <p className="text-muted-foreground mt-1 text-sm font-medium">
            Personalized metrics for your {user?.displayRole || "Dashboard"}
          </p>
        </div>
        <motion.a
          href="/orders"
          whileHover={{ x: 3 }}
          className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
        >
          View your orders <ArrowRight className="h-4 w-4" />
        </motion.a>
      </motion.div>

      {/* KPI Grid */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading || !dashboardStats
          ? [0, 1, 2, 3].map((i) => <SkeletonCard key={i} />)
          : filteredKpis.map((cfg, idx) => (
              <KpiCard
                key={cfg.key}
                config={cfg}
                value={dashboardStats[cfg.key]}
                idx={idx}
              />
            ))}
      </div>

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.28, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm overflow-hidden"
        style={{ boxShadow: "0 4px 32px hsl(0 0% 0% / 0.25)" }}
      >
        {/* card header */}
        <div className="h-1 w-full bg-gradient-to-r from-violet-600 via-primary to-cyan-500" />
        <div className="p-6 flex items-center justify-between border-b border-border/40">
          <div>
            <h2 className="text-lg font-bold">Revenue Stream</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Aggregated from live order data</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-violet-500 inline-block" /> Revenue
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-cyan-500 inline-block" /> Orders
            </div>
          </div>
        </div>

        <div className="p-6 h-[340px]">
          {isLoading || !dashboardStats ? (
            <div className="h-full skeleton rounded-xl" />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dashboardStats.chartData} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="gRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="hsl(255 80% 65%)" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="hsl(255 80% 65%)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gOrders" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="hsl(185 95% 60%)" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="hsl(185 95% 60%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11}
                  tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11}
                  tickLine={false} axisLine={false}
                  tickFormatter={(v) => `$${v}`} />
                <Tooltip content={<ChartTooltip />} />
                <Area name="Revenue" type="monotone" dataKey="revenue"
                  stroke="hsl(255 80% 65%)" strokeWidth={2.5}
                  fill="url(#gRevenue)" dot={false} />
                <Area name="Orders" type="monotone" dataKey="orders"
                  stroke="hsl(185 95% 60%)" strokeWidth={2}
                  fill="url(#gOrders)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </motion.div>
    </div>
  );
}
