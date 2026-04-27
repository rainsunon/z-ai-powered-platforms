import React from "react";
import { CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type PurchaseStatus = "paid" | "unpaid" | "overdue";

interface PurchaseStatusBadgeProps {
  status: PurchaseStatus;
}

export function PurchaseStatusBadge({ status }: PurchaseStatusBadgeProps) {
  const styles = {
    paid: "bg-green-50 text-green-600 border-green-100",
    unpaid: "bg-amber-50 text-amber-600 border-amber-100",
    overdue: "bg-rose-50 text-rose-600 border-rose-100",
  };

  const icons = {
    paid: <CheckCircle2 size={12} />,
    unpaid: <Clock size={12} />,
    overdue: <AlertCircle size={12} />,
  };

  return (
    <div className={cn(
      "flex items-center gap-1.5 px-2 py-1 rounded-full border text-[10px] font-black uppercase tracking-tight w-fit",
      styles[status]
    )}>
      {icons[status]}
      {status}
    </div>
  );
}
