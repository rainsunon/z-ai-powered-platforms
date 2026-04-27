import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
  isLoading?: boolean;
  fullWidth?: boolean;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  icon: Icon,
  iconPosition = "left",
  isLoading = false,
  fullWidth = false,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = "font-bold rounded-lg transition-all inline-flex items-center justify-center gap-2";
  
  const variantStyles = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 active:scale-95 shadow-lg shadow-blue-200",
    secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300 active:scale-95",
    outline: "border-2 border-blue-600 text-blue-600 hover:bg-blue-50",
    ghost: "text-gray-700 hover:bg-gray-100",
    danger: "bg-red-600 text-white hover:bg-red-700 active:scale-95"
  };

  const sizeStyles = {
    sm: "px-4 py-1.5 text-xs",
    md: "px-6 py-2.5 text-sm",
    lg: "px-8 py-3 text-base"
  };

  return (
    <button
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && "w-full",
        (disabled || isLoading) && "opacity-50 cursor-not-allowed",
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
          Loading...
        </>
      ) : (
        <>
          {Icon && iconPosition === "left" && <Icon size={16} />}
          {children}
          {Icon && iconPosition === "right" && <Icon size={16} />}
        </>
      )}
    </button>
  );
}

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  rounded?: boolean;
}

export function IconButton({
  icon: Icon,
  variant = "ghost",
  size = "md",
  rounded = true,
  className,
  ...props
}: IconButtonProps) {
  const variantStyles = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300",
    ghost: "text-gray-600 hover:bg-gray-100",
    danger: "text-red-600 hover:bg-red-50"
  };

  const sizeStyles = {
    sm: "p-1.5",
    md: "p-2",
    lg: "p-3"
  };

  const iconSizes = {
    sm: 14,
    md: 16,
    lg: 20
  };

  return (
    <button
      className={cn(
        "transition-colors inline-flex items-center justify-center",
        variantStyles[variant],
        sizeStyles[size],
        rounded ? "rounded-full" : "rounded-lg",
        className
      )}
      {...props}
    >
      <Icon size={iconSizes[size]} />
    </button>
  );
}
