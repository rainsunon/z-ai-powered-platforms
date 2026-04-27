import React from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Filter } from "lucide-react";

interface PurchaseChartProps {
  data: { month: string; amount: number }[];
}

export function PurchaseChart({ data }: PurchaseChartProps) {
  return (
    <div className="bg-gray-50/50 p-6 rounded-xl border border-gray-100">
      <div className="flex items-center gap-2 mb-6">
        <Filter size={18} className="text-primary" />
        <h4 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Procurement Volume</h4>
      </div>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
            <Tooltip
              contentStyle={{ border: 'none', borderRadius: '12px', boxShadow: '0 8px 30px rgba(0,0,0,0.1)' }}
              cursor={{ fill: '#f1f5f9' }}
            />
            <Bar dataKey="amount" name="Purchase Amount" fill="#0077c5" radius={[4, 4, 0, 0]} barSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
