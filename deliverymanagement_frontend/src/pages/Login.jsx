import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { UI_ROLES, toBackendRole } from "../utils/roleMapping";
import { Zap, User, Mail, Lock, ChevronDown } from "lucide-react";

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const login       = useAuthStore((s) => s.login);
  const registerUser = useAuthStore((s) => s.register);
  const isLoading   = useAuthStore((s) => s.isLoading);
  const navigate    = useNavigate();

  const toggleMode = () => { setIsRegister(!isRegister); reset(); };

  const onSubmit = async (data) => {
    try {
      if (isRegister) {
        // Find the human-friendly label for the selected role value
        const selectedRole = UI_ROLES.find(r => r.value === data.role);
        
        const success = await registerUser({
          // Backend expects `username` (DTO field). We send it explicitly.
          username: data.name,
          email: data.email,
          password: data.password,
          role: toBackendRole(data.role),
          displayRole: selectedRole?.label || "Customer",
        });
        if (success) { setIsRegister(false); reset(); }
      } else {
        const ok = await login({ email: data.email, password: data.password });
        if (ok) navigate("/dashboard");
      }
    } catch (_) { /* toast shown by api.js */ }
  };

  return (
    /* Glass card */
    <div className="relative rounded-2xl overflow-hidden"
         style={{ background: "hsl(222 44% 8% / 0.85)", backdropFilter: "blur(24px)",
                  border: "1px solid hsl(255 80% 65% / 0.18)",
                  boxShadow: "0 24px 80px hsl(0 0% 0% / 0.5), inset 0 1px 0 hsl(255 80% 65% / 0.1)" }}>
      {/* Top gradient line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-primary to-transparent opacity-80" />

      <div className="px-8 py-10">
        {/* Logo */}
        <div className="flex flex-col items-center gap-3 mb-8">
          <motion.div
            whileHover={{ rotate: 15, scale: 1.1 }}
            className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-accent
                       flex items-center justify-center shadow-lg glow-primary"
          >
            <Zap className="h-6 w-6 text-white" />
          </motion.div>
          <div className="text-center">
            <h1 className="text-2xl font-black tracking-tight text-white">DeliveryApp</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {isRegister ? "Create your account to get started" : "Welcome back — sign in to continue"}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <AnimatePresence mode="popLayout">
            {isRegister && (
              <motion.div
                key="register-fields"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="space-y-4 overflow-hidden"
              >
                {/* Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="John Doe"
                      className="w-full h-10 pl-9 pr-4 rounded-lg text-sm text-white placeholder:text-muted-foreground/50
                                 border border-border/40 bg-white/5 focus:outline-none focus:ring-2 focus:ring-primary/50
                                 focus:border-primary/50 transition-all"
                      {...register("name", { required: "Name is required" })}
                    />
                  </div>
                  {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
                </div>

                {/* Role */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Role</label>
                  <div className="relative">
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <select
                        {...register("role", { value: "DELIVERY_AGENT" })}
                      border border-border/40 bg-[#0d0d1a] focus:outline-none focus:ring-2 focus:ring-primary/50
                    focus:border-primary/50 transition-all appearance-none cursor-pointer"
                      >
                      {UI_ROLES.map((r) => (
                        <option key={r.value} value={r.value}>{r.label}</option>
                      ))}
                    </select>
                 
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full h-10 pl-9 pr-4 rounded-lg text-sm text-white placeholder:text-muted-foreground/50
                           border border-border/40 bg-white/5 focus:outline-none focus:ring-2 focus:ring-primary/50
                           focus:border-primary/50 transition-all"
                {...register("email", { required: "Email is required" })}
              />
            </div>
            {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="password"
                placeholder="••••••••"
                className="w-full h-10 pl-9 pr-4 rounded-lg text-sm text-white placeholder:text-muted-foreground/50
                           border border-border/40 bg-white/5 focus:outline-none focus:ring-2 focus:ring-primary/50
                           focus:border-primary/50 transition-all"
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Minimum 6 characters" },
                })}
              />
            </div>
            {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
          </div>

          <div className="pt-2">
            <Button type="submit" className="w-full h-11 text-base" isLoading={isLoading}>
              {isRegister ? "Create Account" : "Sign In"}
            </Button>
          </div>

          <p className="text-sm text-center text-muted-foreground pt-1">
            {isRegister ? "Already have an account? " : "Don't have an account? "}
            <button type="button" onClick={toggleMode}
              className="text-primary font-semibold hover:underline transition-colors">
              {isRegister ? "Sign In" : "Register"}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
