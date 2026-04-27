import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { formatCurrency } from "@/src/lib/utils";

interface ExpensePieChartProps {
  data: { name: string; value: number; color: string }[];
  showLegend?: boolean;
  size?: "sm" | "md" | "lg";
}

export function ExpensePieChart({ data, showLegend = false, size = "md" }: ExpensePieChartProps) {
  const total = data.reduce((acc, item) => acc + item.value, 0);
  
  const dimensions = {
    sm: { height: 160, innerRadius: 50, outerRadius: 65 },
    md: { height: 200, innerRadius: 60, outerRadius: 80 },
    lg: { height: 250, innerRadius: 70, outerRadius: 95 },
  };

  const { height, innerRadius, outerRadius } = dimensions[size];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-center">
      <div className={`h-[${height}px] w-full relative`} style={{ height: `${height}px` }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => formatCurrency(value)} />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className={size === "sm" ? "text-base font-black text-gray-900" : "text-xl font-black text-gray-900"}>
            {formatCurrency(total)}
          </span>
          <span className="text-[8px] text-gray-500 font-bold uppercase">
            {size === "sm" ? "Expenses" : "Total"}
          </span>
        </div>
      </div>
      
      {showLegend && (
        <div className="flex flex-col justify-center space-y-3">
          {data.map((item) => (
            <div key={item.name} className="flex justify-between items-center text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-gray-600 font-medium">{item.name}</span>
              </div>
              <span className="text-gray-900 font-bold">{formatCurrency(item.value)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
