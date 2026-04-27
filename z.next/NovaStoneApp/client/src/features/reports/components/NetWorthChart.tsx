import React from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import { TrendingUp } from "lucide-react";

interface NetWorthChartProps {
  data: { month: string; assets: number; liabilities: number; equity: number }[];
}

export function NetWorthChart({ data }: NetWorthChartProps) {
  return (
    <div className="bg-gray-50/50 p-6 rounded-xl border border-gray-100">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp size={18} className="text-primary" />
        <h4 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Net Worth Trend</h4>
      </div>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
            <Tooltip
              contentStyle={{ border: 'none', borderRadius: '12px', boxShadow: '0 8px 30px rgba(0,0,0,0.1)' }}
            />
            <Legend iconType="circle" />
            <Line type="monotone" dataKey="assets" name="Assets" stroke="#0077c5" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} activeDot={{ r: 6 }} />
            <Line type="monotone" dataKey="liabilities" name="Liabilities" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3, strokeWidth: 1, fill: '#fff' }} />
            <Line type="monotone" dataKey="equity" name="Equity" stroke="#16a34a" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
