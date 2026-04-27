import React from "react";
import { Info } from "lucide-react";
import { cn, formatCurrency } from "@/src/lib/utils";

interface ReportKPICardProps {
  title: string;
  amount: number;
  unit?: string;
  trend: string;
  isPositive: boolean;
}

export function ReportKPICard({ title, amount, unit = "", trend, isPositive }: ReportKPICardProps) {
  return (
    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
      <div className="flex justify-between items-center mb-3">
        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{title}</span>
        <button className="text-gray-300 hover:text-gray-500"><Info size={14} /></button>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-black text-gray-900 tracking-tighter">
          {unit === '%' ? amount : formatCurrency(amount)}{unit}
        </span>
        <span className={cn(
          "text-[10px] font-bold px-1.5 py-0.5 rounded",
          isPositive ? "text-green-700 bg-green-50" : "text-red-700 bg-red-50"
        )}>
          {trend}
        </span>
      </div>
    </div>
  );
}
