import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { formatCurrency } from "@/src/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
  hoverable?: boolean;
  onClick?: () => void;
}

export function Card({
  children,
  className,
  padding = "md",
  hoverable = false,
  onClick
}: CardProps) {
  const paddingStyles = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8"
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-white border border-gray-200 rounded-xl shadow-sm",
        paddingStyles[padding],
        hoverable && "hover:shadow-md transition-shadow cursor-pointer",
        onClick && "cursor-pointer",
        className
      )}
    >
      {children}
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  subtitle?: string;
  className?: string;
  onClick?: () => void;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  subtitle,
  className,
  onClick
}: StatCardProps) {
  return (
    <Card className={className} onClick={onClick} hoverable={!!onClick}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
            {title}
          </p>
          <p className="text-2xl font-black text-gray-900 mb-1">
            {typeof value === "number" ? formatCurrency(value) : value}
          </p>
          {subtitle && (
            <p className="text-xs text-gray-500">{subtitle}</p>
          )}
          {trend && (
            <div
              className={cn(
                "inline-flex items-center gap-1 text-xs font-bold mt-2",
                trend.isPositive ? "text-green-600" : "text-red-600"
              )}
            >
              <span>{trend.isPositive ? "↑" : "↓"}</span>
              <span>{Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
            <Icon size={20} className="text-blue-600" />
          </div>
        )}
      </div>
    </Card>
  );
}

interface DashboardCardProps {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export function DashboardCard({
  title,
  children,
  action,
  className
}: DashboardCardProps) {
  return (
    <Card className={className} padding="none">
      <div className="p-6 border-b border-gray-100 flex items-center justify-between">
        <h3 className="text-lg font-black text-gray-900 tracking-tight">
          {title}
        </h3>
        {action}
      </div>
      <div className="p-6">
        {children}
      </div>
    </Card>
  );
}
