import React from "react";
import { motion } from "motion/react";
import { LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn, formatCurrency } from "@/src/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    direction: "up" | "down" | "neutral";
  };
  prefix?: string;
  suffix?: string;
  color?: "blue" | "green" | "red" | "yellow" | "purple" | "gray";
  onClick?: () => void;
}

export function MetricCard({
  title,
  value,
  icon: Icon,
  trend,
  prefix = "",
  suffix = "",
  color = "blue",
  onClick,
}: MetricCardProps) {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    red: "bg-red-50 text-red-600",
    yellow: "bg-yellow-50 text-yellow-600",
    purple: "bg-purple-50 text-purple-600",
    gray: "bg-gray-50 text-gray-600",
  };

  const TrendIcon = trend?.direction === "up" ? TrendingUp : 
                    trend?.direction === "down" ? TrendingDown : Minus;

  const trendColor = trend?.direction === "up" ? "text-green-600" :
                     trend?.direction === "down" ? "text-red-600" : "text-gray-600";

  return (
    <motion.div
      whileHover={{ y: -2 }}
      onClick={onClick}
      className={cn(
        "bg-white border border-gray-200 rounded-2xl p-6 shadow-sm",
        onClick && "cursor-pointer hover:shadow-md transition-shadow"
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", colorClasses[color])}>
          <Icon size={24} />
        </div>
        {trend && (
          <div className={cn("flex items-center gap-1 text-sm font-bold", trendColor)}>
            <TrendIcon size={16} />
            <span>{Math.abs(trend.value)}%</span>
          </div>
        )}
      </div>
      
      <div>
        <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
        <p className="text-3xl font-black text-gray-900">
          {prefix}{typeof value === "number" ? formatCurrency(value) : value}{suffix}
        </p>
      </div>
    </motion.div>
  );
}

interface MetricsGridProps {
  children: React.ReactNode;
  columns?: 2 | 3 | 4;
}

export function MetricsGrid({ children, columns = 4 }: MetricsGridProps) {
  const gridCols = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div className={cn("grid gap-4 mb-6", gridCols[columns])}>
      {children}
    </div>
  );
}
