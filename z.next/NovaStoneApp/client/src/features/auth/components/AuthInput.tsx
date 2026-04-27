import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: LucideIcon;
  helperAction?: {
    text: string;
    onClick: () => void;
  };
}

export function AuthInput({
  label,
  error,
  icon: Icon,
  helperAction,
  className,
  ...props
}: AuthInputProps) {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <label className="label-system">{label}</label>
        {helperAction && (
          <button
            type="button"
            onClick={helperAction.onClick}
            className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest hover:underline"
          >
            {helperAction.text}
          </button>
        )}
      </div>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600" size={16} />
        )}
        <input
          className={cn(
            "w-full bg-neutral-800 border border-neutral-700 rounded-lg py-2.5 pr-4 text-sm text-white outline-none focus:border-indigo-500 transition-all placeholder:text-neutral-600",
            Icon ? "pl-10" : "pl-4",
            error && "border-rose-500",
            className
          )}
          {...props}
        />
      </div>
      {error && (
        <p className="text-rose-500 text-[10px] font-bold mt-1 uppercase tracking-tight">
          {error}
        </p>
      )}
    </div>
  );
}
