import React from "react";
import { DollarSign, CreditCard, TrendingUp, TrendingDown } from "lucide-react";
import { MetricCard, MetricsGrid } from "@/shared";

interface TransactionStats {
  totalIncome: number;
  totalExpenses: number;
  netCashFlow: number;
  transactionCount: number;
}

interface TransactionMetricsProps {
  stats: TransactionStats;
}

export function TransactionMetrics({ stats }: TransactionMetricsProps) {
  const cashFlowTrend = stats.netCashFlow > 0 ? "up" : stats.netCashFlow < 0 ? "down" : "neutral";
  
  return (
    <MetricsGrid columns={4}>
      <MetricCard
        title="Total Income"
        value={stats.totalIncome}
        icon={TrendingUp}
        color="green"
      />
      <MetricCard
        title="Total Expenses"
        value={stats.totalExpenses}
        icon={TrendingDown}
        color="red"
      />
      <MetricCard
        title="Net Cash Flow"
        value={stats.netCashFlow}
        icon={DollarSign}
        color={cashFlowTrend === "up" ? "green" : "red"}
        trend={stats.netCashFlow !== 0 ? {
          value: Math.abs((stats.netCashFlow / (stats.totalIncome || 1)) * 100),
          direction: cashFlowTrend as "up" | "down",
        } : undefined}
      />
      <MetricCard
        title="Transactions"
        value={stats.transactionCount}
        icon={CreditCard}
        color="blue"
        prefix=""
        suffix=""
      />
    </MetricsGrid>
  );
}
