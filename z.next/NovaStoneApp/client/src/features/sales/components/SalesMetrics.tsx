import React from "react";
import { ShoppingBag, TrendingUp, Users, DollarSign } from "lucide-react";
import { MetricCard, MetricsGrid } from "@/shared";

interface SalesStats {
  totalRevenue: number;
  totalSales: number;
  averageSaleValue: number;
  topCustomers: number;
  revenueTrend?: {
    value: number;
    direction: "up" | "down" | "neutral";
  };
}

interface SalesMetricsProps {
  stats: SalesStats;
}

export function SalesMetrics({ stats }: SalesMetricsProps) {
  return (
    <MetricsGrid columns={4}>
      <MetricCard
        title="Total Revenue"
        value={stats.totalRevenue}
        icon={DollarSign}
        color="green"
        trend={stats.revenueTrend}
      />
      <MetricCard
        title="Total Sales"
        value={stats.totalSales}
        icon={ShoppingBag}
        color="blue"
        prefix=""
        suffix=" sales"
      />
      <MetricCard
        title="Average Sale"
        value={stats.averageSaleValue}
        icon={TrendingUp}
        color="purple"
      />
      <MetricCard
        title="Active Customers"
        value={stats.topCustomers}
        icon={Users}
        color="yellow"
        prefix=""
        suffix=""
      />
    </MetricsGrid>
  );
}
