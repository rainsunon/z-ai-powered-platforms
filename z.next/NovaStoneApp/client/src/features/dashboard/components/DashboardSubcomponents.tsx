import React from "react";
import { formatCurrency, cn } from "@/src/lib/utils";

export function ShortcutLink({ icon: Icon, label, onClick }: { icon: any; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex items-center gap-3 text-primary text-sm font-bold hover:underline transition-all group">
      <div className="text-primary group-hover:scale-110 transition-transform"><Icon size={18} /></div>
      {label}
    </button>
  );
}

export function PeriodToggle({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className={cn("px-3 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all", active ? "bg-white shadow-sm text-primary" : "text-gray-400 hover:text-gray-600")}>
      {label}
    </button>
  );
}

export function LegendItem({ color, label, isLine = false }: { color: string; label: string; isLine?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      {isLine ? (
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full border border-gray-900" style={{ backgroundColor: '#fff' }}></div>
          <div className="w-3 h-0.5 bg-gray-900"></div>
          <div className="w-1.5 h-1.5 rounded-full border border-gray-900" style={{ backgroundColor: '#fff' }}></div>
        </div>
      ) : (
        <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: color }}></div>
      )}
      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</span>
    </div>
  );
}

export function AgingTable({ title, data }: { title: string; data: { label: string; value: number }[] }) {
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-bold text-gray-900">{title}</h4>
      <div className="border-t border-gray-100">
        {data.map((item, i) => (
          <div key={i} className="flex justify-between py-2.5 border-b border-gray-50 text-xs">
            <span className={cn("font-bold", i === 0 ? "text-primary" : "text-gray-600")}>{item.label}</span>
            <span className="text-gray-500 font-bold">{formatCurrency(item.value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ComparisonRow({ label, prev, current, isNegative = false, isBold = false }: any) {
  return (
    <tr className={cn("group hover:bg-gray-50/50 transition-colors", isBold && "bg-gray-50/30")}>
      <td className={cn("py-4 px-4 text-sm font-bold text-gray-600", isBold && "text-gray-900")}>{label}</td>
      <td className={cn("py-4 px-4 text-sm font-black text-right", isNegative ? "text-gray-400" : "text-primary", isBold && "text-primary")}>{formatCurrency(prev)}</td>
      <td className={cn("py-4 px-4 text-sm font-black text-right", isNegative ? "text-gray-400" : "text-primary", isBold && "text-primary")}>{formatCurrency(current)}</td>
    </tr>
  );
}
