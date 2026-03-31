import { useEffect, useState } from "react";
import { useOrderStore } from "../store/orderStore";
import { useAgentStore } from "../store/agentStore";
import { useAuthStore } from "../store/authStore";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { cn } from "../utils/cn";
import { normalizeRole } from "../utils/roleMapping";
import {
  Search, Download, Plus, Truck, Clock,
  Trash2, PackageOpen, ShoppingCart,
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import Modal from "../components/ui/Modal";
import ConfirmDialog from "../components/ui/ConfirmDialog";

// ── Helpers ───────────────────────────────────────────────────────────────────
const STATUS_STYLES = {
  DELIVERED: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  SHIPPED:   "bg-blue-500/15    text-blue-400    border-blue-500/20",
  PENDING:   "bg-amber-500/15   text-amber-400   border-amber-500/20",
};

function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border ${STATUS_STYLES[status] || "bg-muted text-muted-foreground border-border"}`}>
      {status?.charAt(0) + status?.slice(1)?.toLowerCase()}
    </span>
  );
}

// ── Skeleton row ─────────────────────────────────────────────────────────────
function SkeletonRow() {
  return (
    <tr className="border-b border-border/30">
      {[120, 150, 100, 80, 90, 70].map((w, i) => (
        <td key={i} className="px-4 py-3.5">
          <div className={`skeleton h-4 rounded`} style={{ width: w }} />
        </td>
      ))}
    </tr>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function Orders() {
  const { orders, fetchOrders, isLoading, createOrder, updateOrderStatus, deleteOrder } = useOrderStore();
  const { agents, fetchAgents } = useAgentStore();
  const { user, isBackendDown } = useAuthStore();
  const role = normalizeRole(user?.role);
  const canManageOrders = role === "ADMIN" || role === "DELIVERY_AGENT";

  const [search, setSearch]             = useState("");
  const [isModalOpen, setIsModalOpen]   = useState(false);
  const [confirmId, setConfirmId]       = useState(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => { fetchOrders(); fetchAgents(); }, [fetchOrders, fetchAgents]);

  // ── Role-Based Filtering ───────────────────────────────────────────────────
  const roleFiltered = orders.filter((order) => {
    if (role === "ADMIN") return true;

    if (role === "DELIVERY_AGENT") {
      return order.agentId === user.id ||
             order.agentName?.toLowerCase() === user.name?.toLowerCase();
    }

    // Regular Customer
    return order.customerName?.toLowerCase() === user?.name?.toLowerCase();
  });

  const filtered = roleFiltered.filter((o) =>
    (o.id?.toString().includes(search)) ||
    (o.customerName?.toLowerCase().includes(search.toLowerCase()))
  );

  const handleExport = () => {
    const csv = ["ID,Customer,Amount,Status,Date",
      ...roleFiltered.map((o) => `${o.id},${o.customerName},${o.amount},${o.status},${o.date}`)
    ].join("\n");
    const a = document.createElement("a");
    a.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
    a.download = "orders.csv";
    a.click();
  };

  const onSubmit = async (data) => {
    if (isBackendDown) return;
    await createOrder({ ...data, amount: parseFloat(data.amount), date: new Date().toISOString(), status: "PENDING" });
    setIsModalOpen(false);
    reset();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Orders</h1>
          <p className="text-sm text-muted-foreground mt-0.5 font-medium">
            {role === 'ADMIN' ? 'Manage and track all delivery orders' : 'Track your own orders and deliveries'}
          </p>
        </div>
        <div className="flex gap-2">
          {canManageOrders && (
            <>
              <Button variant="outline" onClick={handleExport} size="sm">
                <Download className="h-4 w-4" /> Export CSV
              </Button>
              <div title={isBackendDown ? "Backend is offline" : ""}>
                <Button 
                  onClick={() => !isBackendDown && setIsModalOpen(true)} 
                  size="sm"
                  disabled={isBackendDown}
                  className={isBackendDown ? "opacity-50 cursor-not-allowed" : ""}
                >
                  <Plus className="h-4 w-4" /> New Order
                </Button>
              </div>
            </>
          )}
        </div>
      </motion.div>

      {/* Table card */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className="rounded-2xl overflow-hidden border border-border/50 bg-card/60 backdrop-blur-sm"
        style={{ boxShadow: "0 4px 32px hsl(0 0% 0% / 0.25)" }}
      >
        <div className="h-[2px] bg-gradient-to-r from-violet-600 via-primary to-cyan-500" />

        {/* Search bar */}
        <div className="p-4 border-b border-border/40 bg-muted/20">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              placeholder="Search by ID or customer…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-9 pl-9 pr-4 rounded-lg text-sm bg-background/60 border border-border/40
                         focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/40 bg-muted/30">
                {["Order ID", "Customer", "Date", "Amount", "Status", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                [1, 2, 3, 4, 5].map((i) => <SkeletonRow key={i} />)
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-3 text-muted-foreground">
                      <div className="p-4 rounded-full bg-muted/40">
                        <PackageOpen className="h-10 w-10 opacity-40" />
                      </div>
                      <div>
                        <p className="font-bold text-foreground/70">
                          {search ? "No matching orders" : "No orders yet"}
                        </p>
                        <p className="text-xs mt-1 opacity-60">
                          {search ? "Try adjusting your search" : "Create your first order using the button above"}
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((order, idx) => (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className="group border-b border-border/30 hover:bg-muted/20 transition-colors"
                  >
                    <td className="px-4 py-3.5 font-mono text-[11px] text-muted-foreground">#{order.id}</td>
                    <td className="px-4 py-3.5 font-semibold">{order.customerName}</td>
                    <td className="px-4 py-3.5 text-muted-foreground text-xs">
                      {order.date ? format(new Date(order.date), "MMM dd, yyyy") : "—"}
                    </td>
                    <td className="px-4 py-3.5 font-bold">
                      ${parseFloat(order.amount || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-3.5"><StatusBadge status={order.status} /></td>
                    <td className="px-4 py-3.5">
                      {canManageOrders && (
                        <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200">
                          {order.status !== "DELIVERED" && (
                            <div title={isBackendDown ? "Backend is offline" : ""}>
                              <button
                                disabled={isBackendDown}
                                onClick={() => updateOrderStatus(order.id, order.status === "PENDING" ? "SHIPPED" : "DELIVERED")}
                                className={cn(
                                  "p-1.5 rounded-md transition-colors",
                                  isBackendDown ? "opacity-30 cursor-not-allowed" : "hover:bg-primary/15 text-primary"
                                )}
                              >
                                {order.status === "PENDING" ? <Clock className="h-3.5 w-3.5" /> : <Truck className="h-3.5 w-3.5" />}
                              </button>
                            </div>
                          )}
                          <div title={isBackendDown ? "Backend is offline" : ""}>
                            <button
                              disabled={isBackendDown}
                              onClick={() => setConfirmId(order.id)}
                              className={cn(
                                "p-1.5 rounded-md transition-colors",
                                isBackendDown ? "opacity-30 cursor-not-allowed" : "hover:bg-destructive/15 text-destructive/60 hover:text-destructive"
                              )}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      )}
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Create Order Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New Order">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Customer Name</label>
            <input placeholder="Jane Doe"
              className="w-full h-10 px-3 rounded-lg text-sm border border-border/50 bg-background/60
                         focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
              {...register("customerName", { required: "Required" })} />
            {errors.customerName && <p className="text-xs text-destructive">{errors.customerName.message}</p>}
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Amount ($)</label>
            <input type="number" step="0.01" placeholder="0.00"
              className="w-full h-10 px-3 rounded-lg text-sm border border-border/50 bg-background/60
                         focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
              {...register("amount", { required: "Required" })} />
            {errors.amount && <p className="text-xs text-destructive">{errors.amount.message}</p>}
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Assign Agent</label>
            <select className="w-full h-10 px-3 rounded-lg text-sm border border-border/50 bg-background/80
                               focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all appearance-none"
              {...register("agentId")}>
              <option value="">Unassigned</option>
              {agents.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-border/40">
            <Button variant="ghost" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit"><ShoppingCart className="h-4 w-4" /> Create</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!confirmId}
        onClose={() => setConfirmId(null)}
        onConfirm={async () => { await deleteOrder(confirmId); setConfirmId(null); }}
        title="Delete Order"
        message="This action is permanent and cannot be undone. Are you sure?"
      />
    </div>
  );
}
