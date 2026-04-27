import React from "react";
import { FileText, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { MetricCard, MetricsGrid } from "@/shared";

interface InvoiceStats {
  total: number;
  paid: number;
  unpaid: number;
  overdue: number;
  totalAmount: number;
  paidAmount: number;
  unpaidAmount: number;
}

interface InvoiceMetricsProps {
  stats: InvoiceStats;
}

export function InvoiceMetrics({ stats }: InvoiceMetricsProps) {
  return (
    <MetricsGrid columns={4}>
      <MetricCard
        title="Total Invoices"
        value={stats.total}
        icon={FileText}
        color="blue"
        prefix=""
        suffix=""
      />
      <MetricCard
        title="Paid"
        value={stats.paidAmount}
        icon={CheckCircle2}
        color="green"
      />
      <MetricCard
        title="Unpaid"
        value={stats.unpaidAmount}
        icon={Clock}
        color="yellow"
      />
      <MetricCard
        title="Overdue"
        value={stats.unpaid}
        icon={AlertCircle}
        color="red"
        prefix=""
        suffix=" invoices"
      />
    </MetricsGrid>
  );
}
