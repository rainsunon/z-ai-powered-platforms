import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Mail, Lock, Loader2 } from "lucide-react";
import { AuthInput } from "./AuthInput";
import { useAuthStore } from "../store/authStore";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onToggle: () => void;
}

export function LoginForm({ onToggle }: LoginFormProps) {
  const [loading, setLoading] = React.useState(false);
  const login = useAuthStore((s) => s.login);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    const result = await login(data.email, data.password);
    setLoading(false);
    if (result.success) {
      toast.success("Welcome back to NovaStone!");
    } else {
      toast.error(result.error || "Invalid credentials");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <AuthInput
        label="Authorized Email"
        icon={Mail}
        error={errors.email?.message}
        placeholder="operator@vanguard.sys"
        {...register("email")}
      />

      <AuthInput
        label="Access Key"
        icon={Lock}
        type="password"
        error={errors.password?.message}
        placeholder="••••••••"
        helperAction={{
          text: "Reset Key",
          onClick: () => console.log("Reset password"),
        }}
        {...register("password")}
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? <Loader2 className="animate-spin" size={16} /> : "Initiate Session"}
      </button>

      <div className="text-center mt-8 pt-6 border-t border-neutral-800">
        <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">
          New Operator?{" "}
          <button type="button" onClick={onToggle} className="text-indigo-400 hover:underline">
            Register Node
          </button>
        </p>
      </div>
    </form>
  );
}
