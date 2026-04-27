import React from "react";
import { TrendingUp, Receipt, ShoppingCart, Wallet } from "lucide-react";
import { MetricCard, MetricsGrid } from "@/shared";

interface DashboardMetric {
  title: string;
  value: number;
  trend?: {
    value: number;
    direction: "up" | "down" | "neutral";
  };
  color?: "blue" | "green" | "red" | "yellow" | "purple";
}

interface DashboardStatsProps {
  revenue: DashboardMetric;
  expenses: DashboardMetric;
  profit: DashboardMetric;
  invoices: DashboardMetric;
}

export function DashboardStats({ revenue, expenses, profit, invoices }: DashboardStatsProps) {
  return (
    <MetricsGrid columns={4}>
      <MetricCard
        title={revenue.title}
        value={revenue.value}
        icon={TrendingUp}
        trend={revenue.trend}
        color={revenue.color || "blue"}
      />
      <MetricCard
        title={expenses.title}
        value={expenses.value}
        icon={ShoppingCart}
        trend={expenses.trend}
        color={expenses.color || "red"}
      />
      <MetricCard
        title={profit.title}
        value={profit.value}
        icon={Wallet}
        trend={profit.trend}
        color={profit.color || "green"}
      />
      <MetricCard
        title={invoices.title}
        value={invoices.value}
        icon={Receipt}
        trend={invoices.trend}
        color={invoices.color || "purple"}
      />
    </MetricsGrid>
  );
}
