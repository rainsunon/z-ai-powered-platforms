import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Loader2, User, Mail, Lock } from "lucide-react";
import { AuthInput } from "./AuthInput";
import { useAuthStore } from "../store/authStore";

const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignUpFormData = z.infer<typeof signUpSchema>;

interface SignUpFormProps {
  onToggle: () => void;
}

export function SignUpForm({ onToggle }: SignUpFormProps) {
  const [loading, setLoading] = React.useState(false);
  const registerUser = useAuthStore((s) => s.register);

  const { register, handleSubmit, formState: { errors } } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpFormData) => {
    setLoading(true);
    const result = await registerUser(data.name, data.email, data.password);
    setLoading(false);
    if (result.success) {
      toast.success("Account created! Welcome to NovaStone.");
    } else {
      toast.error(result.error || "Registration failed");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <AuthInput
        label="Operator Name"
        icon={User}
        error={errors.name?.message}
        placeholder="Alex Rivera"
        {...register("name")}
      />

      <AuthInput
        label="System Email"
        icon={Mail}
        type="email"
        error={errors.email?.message}
        placeholder="alex@vanguard.sys"
        {...register("email")}
      />

      <AuthInput
        label="Initial Key"
        icon={Lock}
        type="password"
        error={errors.password?.message}
        placeholder="••••••••"
        {...register("password")}
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin" size={16} />
            Registering...
          </>
        ) : (
          "Provision Node"
        )}
      </button>

      <div className="text-center mt-8 pt-6 border-t border-neutral-800">
        <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">
          Valid session?{" "}
          <button type="button" onClick={onToggle} className="text-indigo-400 hover:underline">
            Access Terminal
          </button>
        </p>
      </div>
    </form>
  );
}
