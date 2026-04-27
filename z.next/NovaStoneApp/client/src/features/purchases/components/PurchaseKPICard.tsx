import React from "react";
import { LucideIcon } from "lucide-react";
import { formatCurrency, cn } from "@/lib/utils";

interface PurchaseKPICardProps {
  title: string;
  amount: number;
  subtitle: string;
  icon: LucideIcon;
  color: "blue" | "yellow" | "red";
}

export function PurchaseKPICard({ title, amount, subtitle, icon: Icon, color }: PurchaseKPICardProps) {
  const colorMap = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    yellow: "bg-amber-50 text-amber-600 border-amber-100",
    red: "bg-rose-50 text-rose-600 border-rose-100",
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-start gap-4">
      <div className={cn("p-3 rounded-lg border", colorMap[color])}>
        <Icon size={20} />
      </div>
      <div>
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">{title}</h3>
        <p className="text-2xl font-black text-gray-900 tracking-tighter mt-1">{formatCurrency(amount)}</p>
        <p className="text-[10px] text-gray-400 font-medium mt-1 uppercase tracking-tight">{subtitle}</p>
      </div>
    </div>
  );
}
