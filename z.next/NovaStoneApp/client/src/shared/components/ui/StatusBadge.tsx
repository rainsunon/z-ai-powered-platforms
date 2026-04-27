import React from "react";
import { cn } from "@/src/lib/utils";
import { CheckCircle2, Clock, AlertCircle, XCircle, Circle } from "lucide-react";

type StatusVariant = "success" | "warning" | "error" | "info" | "default" | "pending";

interface StatusBadgeProps {
  status: string;
  variant?: StatusVariant;
  showIcon?: boolean;
  size?: "sm" | "md" | "lg";
}

export function StatusBadge({ 
  status, 
  variant, 
  showIcon = true, 
  size = "md" 
}: StatusBadgeProps) {
  // Auto-detect variant based on status if not provided
  const detectedVariant = variant || detectVariant(status);
  
  const variantClasses = {
    success: "bg-green-50 text-green-700 border-green-200",
    warning: "bg-yellow-50 text-yellow-700 border-yellow-200",
    error: "bg-red-50 text-red-700 border-red-200",
    info: "bg-blue-50 text-blue-700 border-blue-200",
    pending: "bg-gray-50 text-gray-700 border-gray-200",
    default: "bg-gray-50 text-gray-700 border-gray-200",
  };

  const icons = {
    success: CheckCircle2,
    warning: AlertCircle,
    error: XCircle,
    info: Circle,
    pending: Clock,
    default: Circle,
  };

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm",
    lg: "px-3 py-1.5 text-base",
  };

  const Icon = icons[detectedVariant];

  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 font-medium border rounded-full",
      variantClasses[detectedVariant],
      sizeClasses[size]
    )}>
      {showIcon && <Icon size={size === "sm" ? 12 : size === "lg" ? 16 : 14} />}
      {status}
    </span>
  );
}

function detectVariant(status: string): StatusVariant {
  const statusLower = status.toLowerCase();
  
  if (statusLower === "paid" || statusLower === "completed" || statusLower === "active" || statusLower === "approved") {
    return "success";
  }
  if (statusLower === "unpaid" || statusLower === "pending" || statusLower === "draft") {
    return "pending";
  }
  if (statusLower === "overdue" || statusLower === "expired" || statusLower === "rejected") {
    return "error";
  }
  if (statusLower === "processing" || statusLower === "in progress") {
    return "warning";
  }
  return "default";
}

interface CategoryBadgeProps {
  category: string;
  color?: string;
}

export function CategoryBadge({ category, color }: CategoryBadgeProps) {
  const colorClass = color || getColorForCategory(category);
  
  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-lg",
      colorClass
    )}>
      {category}
    </span>
  );
}

function getColorForCategory(category: string): string {
  const colors: Record<string, string> = {
    software: "bg-purple-50 text-purple-700",
    hardware: "bg-blue-50 text-blue-700",
    rent: "bg-green-50 text-green-700",
    shipping: "bg-orange-50 text-orange-700",
    services: "bg-indigo-50 text-indigo-700",
    design: "bg-pink-50 text-pink-700",
    marketing: "bg-red-50 text-red-700",
    consulting: "bg-teal-50 text-teal-700",
  };
  
  return colors[category.toLowerCase()] || "bg-gray-50 text-gray-700";
}
