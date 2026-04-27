import React from "react";
import { TrendingUp } from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell,
  PieChart, Pie, Line, ComposedChart, CartesianGrid
} from "recharts";
import { PeriodToggle, LegendItem, AgingTable, ComparisonRow } from "./DashboardSubcomponents";

const cashFlowData = [
  { name: "Apr 25", inflow: 45000, outflow: 38000, net: 7000 },
  { name: "May 25", inflow: 38000, outflow: 85000, net: -47000 },
  { name: "Jun 25", inflow: 78000, outflow: 42000, net: 36000 },
  { name: "Jul 25", inflow: 52000, outflow: 48000, net: 4000 },
  { name: "Aug 25", inflow: 41000, outflow: 40000, net: 1000 },
  { name: "Sep 25", inflow: 43000, outflow: 42000, net: 1000 },
  { name: "Oct 25", inflow: 44000, outflow: 43000, net: 1000 },
  { name: "Nov 25", inflow: 45000, outflow: 44000, net: 1000 },
  { name: "Dec 25", inflow: 46000, outflow: 45000, net: 1000 },
  { name: "Jan 26", inflow: 47000, outflow: 46000, net: 1000 },
  { name: "Feb 26", inflow: 48000, outflow: 47000, net: 1000 },
  { name: "Mar 26", inflow: 49000, outflow: 48000, net: 1000 },
  { name: "Apr 26", inflow: 50000, outflow: 49000, net: 1000 },
];

const profitLossData = [
  { name: "Apr 25", income: 42000, expense: 35000 },
  { name: "May 25", income: 52000, expense: 42000 },
  { name: "Jun 25", income: 95000, expense: 38000 },
  { name: "Jul 25", income: 38000, expense: 32000 },
  { name: "Aug 25", income: 41000, expense: 35000 },
  { name: "Sep 25", income: 28000, expense: 25000 },
  { name: "Oct 25", income: 31000, expense: 28000 },
  { name: "Nov 25", income: 32000, expense: 29000 },
  { name: "Dec 25", income: 33000, expense: 30000 },
  { name: "Jan 26", income: 34000, expense: 31000 },
  { name: "Feb 26", income: 35000, expense: 32000 },
  { name: "Mar 26", income: 36000, expense: 33000 },
  { name: "Apr 26", income: 37000, expense: 34000 },
];

const expenseBreakdown = [
  { name: "Health and life", value: 37.6, color: "#10b981" },
  { name: "Meals and Entertainment", value: 20.2, color: "#475569" },
  { name: "Uncategorized Expense", value: 12.7, color: "#3b82f6" },
  { name: "Office Supplies", value: 10.1, color: "#1e40af" },
  { name: "Travel Expense", value: 5.3, color: "#60a5fa" },
  { name: "General Expense", value: 5.0, color: "#8b5cf6" },
  { name: "Vehicle - Fuel", value: 4.5, color: "#a855f7" },
  { name: "Repairs & Maintenance", value: 4.5, color: "#a3e635" },
  { name: "Telephone - Wireless", value: 2.7, color: "#eab308" },
  { name: "Professional Fees", value: 2.4, color: "#f97316" },
];

const overdueItems = [
  { name: "Daniel Sun", amount: 4520.00 },
  { name: "renting", amount: 6700.00 },
  { name: "TD insurance", amount: 880.00 },
  { name: "Yonge Weldrick Dental", amount: 140.00 },
  { name: "MangJingJing", amount: 5085.00 },
];

export function CashFlowSection({ period, onPeriodChange, onNavigate }: { period: "12" | "24"; onPeriodChange: (p: "12" | "24") => void; onNavigate: (page: string) => void }) {
  return (
    <section className="space-y-4">
      <div className="flex justify-between items-end">
        <div>
          <h3 className="text-lg font-black text-gray-900 tracking-tight">Cash Flow</h3>
          <p className="text-sm text-gray-500 font-medium mt-1">Cash coming in and going out of your business.</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <button onClick={() => onNavigate("reports")} className="text-xs font-black text-primary uppercase tracking-widest">View Report</button>
          <div className="flex items-center gap-4 bg-gray-50 p-1 rounded-lg">
            <PeriodToggle active={period === "12"} label="Last 12 Months" onClick={() => onPeriodChange("12")} />
            <PeriodToggle active={period === "24"} label="Last 24 Months" onClick={() => onPeriodChange("24")} />
          </div>
        </div>
      </div>
      <div className="bg-white border border-gray-100 rounded-2xl p-6 h-[350px]">
        <div className="flex gap-6 mb-6">
          <LegendItem color="#10b981" label="Inflow" />
          <LegendItem color="#94a3b8" label="Outflow" />
          <LegendItem color="#3b3b3b" label="Net Change" isLine />
        </div>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={cashFlowData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} dx={-10} tickFormatter={(v) => `$${v / 1000}k`} />
            <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} />
            <Bar dataKey="inflow" fill="#10b981" barSize={12} radius={[2, 2, 0, 0]} />
            <Bar dataKey="outflow" fill="#94a3b8" barSize={12} radius={[2, 2, 0, 0]} />
            <Line type="monotone" dataKey="net" stroke="#3b3b3b" strokeWidth={2} dot={{ r: 4, fill: '#fff', stroke: '#3b3b3b', strokeWidth: 2 }} activeDot={{ r: 6 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

export function ProfitLossSection({ period, onPeriodChange, onNavigate }: { period: "12" | "24"; onPeriodChange: (p: "12" | "24") => void; onNavigate: (page: string) => void }) {
  return (
    <section className="space-y-4">
      <div className="flex justify-between items-end">
        <div>
          <h3 className="text-lg font-black text-gray-900 tracking-tight">Profit And Loss</h3>
          <p className="text-sm text-gray-500 font-medium mt-1">Income and expenses only (includes unpaid invoices and bills).</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <button onClick={() => onNavigate("reports")} className="text-xs font-black text-primary uppercase tracking-widest">View Report</button>
          <div className="flex items-center gap-4 bg-gray-50 p-1 rounded-lg">
            <PeriodToggle active={period === "12"} label="Last 12 Months" onClick={() => onPeriodChange("12")} />
            <PeriodToggle active={period === "24"} label="Last 24 Months" onClick={() => onPeriodChange("24")} />
          </div>
        </div>
      </div>
      <div className="bg-white border border-gray-100 rounded-2xl p-6 h-[350px]">
        <div className="flex gap-6 mb-6">
          <LegendItem color="#10b981" label="Income" />
          <LegendItem color="#94a3b8" label="Expense" />
        </div>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={profitLossData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} dx={-10} tickFormatter={(v) => `$${v / 1000}k`} />
            <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} />
            <Bar dataKey="income" fill="#10b981" barSize={12} radius={[2, 2, 0, 0]} />
            <Bar dataKey="expense" fill="#94a3b8" barSize={12} radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

export function ExpenseBreakdownSection({ period, onPeriodChange }: { period: "year" | "month"; onPeriodChange: (p: "year" | "month") => void }) {
  return (
    <section className="space-y-8">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-black text-gray-900 tracking-tight">Expense Breakdown</h3>
        <div className="flex items-center gap-4 bg-gray-50 p-1 rounded-lg">
          <PeriodToggle active={period === "year"} label="This Year" onClick={() => onPeriodChange("year")} />
          <PeriodToggle active={period === "month"} label="This Month" onClick={() => onPeriodChange("month")} />
        </div>
      </div>
      <div className="flex flex-col lg:flex-row items-center gap-12">
        <div className="w-[300px] h-[300px] relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={expenseBreakdown} innerRadius={80} outerRadius={120} paddingAngle={4} dataKey="value" stroke="none">
                {expenseBreakdown.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total</span>
            <span className="text-xl font-black text-gray-900">100%</span>
          </div>
        </div>
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12">
          {expenseBreakdown.map((item, i) => (
            <div key={i} className="flex items-center justify-between text-sm group cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className="font-bold text-gray-600 group-hover:text-gray-900 transition-colors">{item.name}</span>
              </div>
              <span className="text-gray-400 font-bold">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function OverdueSection({ onNavigate }: { onNavigate: (page: string) => void }) {
  return (
    <section className="space-y-4">
      <h3 className="text-lg font-black text-gray-900 tracking-tight">Overdue invoices & bills</h3>
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Overdue Bills</span>
          <button onClick={() => onNavigate("purchases")} className="text-xs font-bold text-primary hover:underline">View</button>
        </div>
        <ul className="space-y-3">
          {overdueItems.map((item, i) => (
            <li key={i} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-900"></div>
                <span className="font-bold text-gray-700">{item.name},</span>
              </div>
              <span className="text-gray-500 font-bold">{formatCurrency(item.amount)}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function PayableAndOwingSection() {
  return (
    <section className="space-y-4">
      <h3 className="text-lg font-black text-gray-900 tracking-tight">Payable & Owing</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <AgingTable title="Invoices payable to you" data={[
          { label: "Coming Due", value: 0 }, { label: "1-30 days overdue", value: 0 }, { label: "31-60 days overdue", value: 0 }, { label: "61-90 days overdue", value: 0 }, { label: "> 90 days overdue", value: 0 },
        ]} />
        <AgingTable title="Bills you owe" data={[
          { label: "Coming Due", value: 0 }, { label: "1-30 days overdue", value: 0 }, { label: "31-60 days overdue", value: 0 }, { label: "61-90 days overdue", value: 0 }, { label: "> 90 days overdue", value: 17405 },
        ]} />
      </div>
    </section>
  );
}

export function NetIncomeSection() {
  return (
    <section className="space-y-4">
      <h3 className="text-lg font-black text-gray-900 tracking-tight">Net Income</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 italic transition-none">
              <th className="py-3 px-4 flex items-center gap-2 text-sm font-bold text-gray-600">Fiscal Year <TrendingUp size={14} className="text-gray-400" /></th>
              <th className="py-3 px-4 text-sm font-bold text-gray-400 text-right uppercase tracking-widest">Previous</th>
              <th className="py-3 px-4 text-sm font-bold text-gray-400 text-right uppercase tracking-widest">Current</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            <ComparisonRow label="Income" prev={132150} current={21025} />
            <ComparisonRow label="Expense" prev={122949.90} current={10053.55} isNegative />
            <ComparisonRow label="Net Income" prev={9200.10} current={10971.45} isBold />
          </tbody>
        </table>
      </div>
    </section>
  );
}
