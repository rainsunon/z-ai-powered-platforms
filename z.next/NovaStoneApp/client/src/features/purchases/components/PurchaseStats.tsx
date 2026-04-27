import React from "react";
import { Receipt, Clock, AlertCircle } from "lucide-react";
import { MetricCard, MetricsGrid } from "@/shared";

interface PurchaseStatsProps {
  totalOutstanding: number;
  unpaidCount: number;
  unpaidAmount: number;
  overdueAmount: number;
}

export function PurchaseStats({
  totalOutstanding,
  unpaidCount,
  unpaidAmount,
  overdueAmount,
}: PurchaseStatsProps) {
  return (
    <MetricsGrid columns={3}>
      <MetricCard
        title="Total Outstanding"
        value={totalOutstanding}
        icon={Receipt}
        color="blue"
      />
      <MetricCard
        title="Unpaid Bills"
        value={unpaidAmount}
        icon={Clock}
        color="yellow"
      />
      <MetricCard
        title="Overdue"
        value={overdueAmount}
        icon={AlertCircle}
        color="red"
      />
    </MetricsGrid>
  );
}
