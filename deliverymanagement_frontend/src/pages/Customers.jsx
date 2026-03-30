import { useEffect, useState } from "react";
import { useCustomerStore } from "../store/customerStore";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { Search, Plus, Users, Mail, Calendar } from "lucide-react";
import { Button } from "../components/ui/Button";
import Modal from "../components/ui/Modal";

function SkeletonRow() {
  return (
    <tr className="border-b border-border/30">
      {[200, 180, 80, 120, 90].map((w, i) => (
        <td key={i} className="px-4 py-3.5">
          <div className="skeleton h-4 rounded" style={{ width: w }} />
        </td>
      ))}
    </tr>
  );
}

export default function Customers() {
  const { customers, fetchCustomers, isLoading, createCustomer } = useCustomerStore();
  const [search, setSearch]           = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => { fetchCustomers(); }, [fetchCustomers]);

  const onSubmit = async (data) => {
    await createCustomer({ ...data, totalOrders: 0, lastOrderDate: new Date().toISOString() });
    setIsModalOpen(false);
    reset();
  };

  const filtered = customers.filter((c) =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Customers</h1>
          <p className="text-sm text-muted-foreground mt-0.5 font-medium">Manage customer profiles and order history</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} size="sm">
          <Plus className="h-4 w-4" /> Add Customer
        </Button>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className="rounded-2xl overflow-hidden border border-border/50 bg-card/60 backdrop-blur-sm"
        style={{ boxShadow: "0 4px 32px hsl(0 0% 0% / 0.25)" }}>
        <div className="h-[2px] bg-gradient-to-r from-violet-500 via-pink-500 to-rose-500" />

        <div className="p-4 border-b border-border/40 bg-muted/20">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input placeholder="Search customers…" value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-9 pl-9 pr-4 rounded-lg text-sm bg-background/60 border border-border/40
                         focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/40 bg-muted/30">
                {["Customer", "Email", "Total Orders", "Last Order", "Action"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-widest text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                [1, 2, 3, 4].map((i) => <SkeletonRow key={i} />)
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-3 text-muted-foreground">
                      <div className="p-4 rounded-full bg-muted/40">
                        <Users className="h-10 w-10 opacity-40" />
                      </div>
                      <div>
                        <p className="font-bold text-foreground/70">
                          {search ? "No customers match your search" : "No customers yet"}
                        </p>
                        <p className="text-xs mt-1 opacity-60">
                          {!search && "Add your first customer using the button above"}
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((c, idx) => (
                  <motion.tr key={c.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className="group border-b border-border/30 hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-500/60 to-pink-500/60
                                        flex items-center justify-center text-white font-bold text-xs shrink-0">
                          {c.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <span className="font-semibold">{c.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Mail className="h-3.5 w-3.5" /> {c.email}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 font-bold text-primary">{c.totalOrders || 0}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        {c.lastOrderDate ? format(new Date(c.lastOrderDate), "MMM dd, yyyy") : "—"}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <button className="text-xs font-semibold text-primary hover:text-primary/80
                                         opacity-0 group-hover:opacity-100 transition-all">
                        View →
                      </button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Customer">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          {[
            { label: "Full Name", name: "name", type: "text", placeholder: "Jane Smith" },
            { label: "Email",     name: "email", type: "email", placeholder: "jane@example.com" },
          ].map((f) => (
            <div key={f.name} className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{f.label}</label>
              <input type={f.type} placeholder={f.placeholder}
                className="w-full h-10 px-3 rounded-lg text-sm border border-border/50 bg-background/60
                           focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                {...register(f.name, { required: `${f.label} is required` })} />
              {errors[f.name] && <p className="text-xs text-destructive">{errors[f.name].message}</p>}
            </div>
          ))}
          <div className="flex justify-end gap-2 pt-2 border-t border-border/40">
            <Button variant="ghost" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit"><Users className="h-4 w-4" /> Add Customer</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
