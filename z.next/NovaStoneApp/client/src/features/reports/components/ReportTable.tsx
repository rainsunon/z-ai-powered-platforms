import React from "react";
import { Download } from "lucide-react";
import { formatCurrency } from "@/src/lib/utils";

interface ReportTableProps {
  title: string;
  items: { label: string; amount: number }[];
  total: number;
  onExport?: () => void;
}

export function ReportTable({ title, items, total, onExport }: ReportTableProps) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center border-b border-gray-100 pb-2">
        <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest">{title}</h4>
        {onExport && (
          <button
            onClick={onExport}
            className="flex items-center gap-1.5 px-2 py-1 text-[10px] font-bold text-primary hover:bg-primary/5 rounded transition-all no-print"
          >
            <Download size={12} />
            EXPORT CSV
          </button>
        )}
      </div>
      <div className="space-y-4 px-2">
        {items.map((item) => (
          <div key={item.label} className="flex justify-between items-center text-sm">
            <span className="text-gray-600 font-medium">{item.label}</span>
            <span className="text-gray-900 font-bold tabular-nums">{formatCurrency(item.amount)}</span>
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg mt-2">
        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Total {title}</span>
        <span className="text-sm font-black text-gray-900 tabular-nums">{formatCurrency(total)}</span>
      </div>
    </div>
  );
}
