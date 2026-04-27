import React from "react";
import { motion } from "motion/react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area
} from "recharts";
import { TrendingUp, Users, DollarSign, Calendar, Filter, Download, MoreVertical, Target } from "lucide-react";
import { formatCurrency, cn } from "@/src/lib/utils";
import { Sale } from "../types";
import { mockSales } from "../data/mockSales";
import { KPIItem, UserIcon } from "../components/SalesDashboardComponents";

const COLORS = ["#0ea5e9", "#10b981", "#f59e0b", "#f43f5e", "#8b5cf6", "#64748b"];

const monthlyData = [
  { month: "Jan", revenue: 45000, invoices: 22 }, { month: "Feb", revenue: 52000, invoices: 25 },
  { month: "Mar", revenue: 48000, invoices: 21 }, { month: "Apr", revenue: 61000, invoices: 28 },
  { month: "May", revenue: 55000, invoices: 24 }, { month: "Jun", revenue: 67000, invoices: 31 },
  { month: "Jul", revenue: 72000, invoices: 34 },
];

const categoryData = [
  { name: "Services", value: 35000 }, { name: "Hardware", value: 25000 },
  { name: "Software", value: 18000 }, { name: "Consulting", value: 12000 },
  { name: "Support", value: 8000 },
];

const topCustomers = [
  { name: "Acme Corp", total: 15400, count: 4, growth: 12 },
  { name: "Global Tech", total: 12500, count: 2, growth: -5 },
  { name: "Inno Designs", total: 8200, count: 5, growth: 24 },
  { name: "Stark Ind", total: 7100, count: 1, growth: 8 },
];

export function SalesDashboard() {
  const [dateRange, setDateRange] = React.useState("Last 6 Months");
  const revenueStats = {
    total: monthlyData.reduce((acc, curr) => acc + curr.revenue, 0),
    avgInvoice: 2450.50,
    growth: 14.2,
    newCustomers: 12,
  };

  return (
    <div className="p-8 space-y-8 bg-[#fcfcfc] min-h-screen font-sans antialiased">
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Sales Analytics</h2>
          <p className="text-gray-500 font-medium">Real-time revenue performance and customer insights.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 shadow-sm">
            <Calendar size={16} className="text-gray-400" />
            <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} className="text-sm font-bold text-gray-600 outline-none bg-transparent cursor-pointer">
              <option>Last 30 Days</option><option>Last 3 Months</option><option>Last 6 Months</option><option>Year to Date</option>
            </select>
          </div>
          <button className="p-3 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 shadow-sm transition-all"><Filter size={18} /></button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-black uppercase tracking-widest hover:bg-opacity-90 shadow-xl shadow-primary/20 transition-all"><Download size={16} />Export Report</button>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPIItem label="Total Revenue" value={formatCurrency(revenueStats.total)} growth="+12.5%" trend="up" icon={DollarSign} description="Total gross revenue for period" />
        <KPIItem label="Avg Invoice Value" value={formatCurrency(revenueStats.avgInvoice)} growth="+4.2%" trend="up" icon={TrendingUp} description="Average per invoice amount" />
        <KPIItem label="New Customers" value={revenueStats.newCustomers} growth="-2.1%" trend="down" icon={Users} description="Net new unique customers" />
        <KPIItem label="Conversion Rate" value="64.2%" growth="+8.4%" trend="up" icon={Target} description="Proposal to invoice ratio" />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <RevenueChartSection />
        <CategoryBreakdownSection />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <TopCustomersSection />
        <InvoiceVolumeSection />
      </div>
    </div>
  );
}

function RevenueChartSection() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-8 bg-white border border-gray-200 rounded-[2rem] shadow-xl shadow-gray-200/50 p-8 flex flex-col gap-8">
      <div className="flex justify-between items-center px-2">
        <div><h3 className="text-xl font-black text-gray-900 tracking-tight">Revenue Trends</h3><p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-1">Monthly performance analysis</p></div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2"><div className="w-3 h-3 bg-primary rounded-full"></div><span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Revenue</span></div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 bg-emerald-400 rounded-full"></div><span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Invoices</span></div>
        </div>
      </div>
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs><linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#0077c5" stopOpacity={0.1} /><stop offset="95%" stopColor="#0077c5" stopOpacity={0} /></linearGradient></defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} tickFormatter={(val) => `$${val / 1000}k`} />
            <Tooltip contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '1rem' }} itemStyle={{ fontSize: '12px', fontWeight: 'bold' }} />
            <Area type="monotone" dataKey="revenue" stroke="#0077c5" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

function CategoryBreakdownSection() {
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-4 bg-white border border-gray-200 rounded-[2rem] shadow-xl shadow-gray-200/50 p-8 flex flex-col items-center justify-between">
      <div className="w-full text-left"><h3 className="text-xl font-black text-gray-900 tracking-tight">Revenue Mix</h3><p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-1">Breakdown by category</p></div>
      <div className="h-[280px] w-full flex items-center justify-center relative">
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"><span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Share</span><span className="text-3xl font-black text-gray-900 tracking-tighter">100%</span></div>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart><Pie data={categoryData} cx="50%" cy="50%" innerRadius={80} outerRadius={110} paddingAngle={8} dataKey="value" stroke="none">{categoryData.map((_, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}</Pie><Tooltip /></PieChart>
        </ResponsiveContainer>
      </div>
      <div className="w-full grid grid-cols-2 gap-y-4 gap-x-6 mt-4">
        {categoryData.slice(0, 4).map((cat, i) => (
          <div key={cat.name} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i] }}></div>
            <div className="flex flex-col"><span className="text-[10px] font-black text-gray-900 uppercase tracking-tight">{cat.name}</span><span className="text-[10px] text-gray-400 font-bold">{Math.round((cat.value / categoryData.reduce((a, b) => a + b.value, 0)) * 100)}%</span></div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function TopCustomersSection() {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="lg:col-span-5 bg-white border border-gray-200 rounded-[2rem] shadow-xl shadow-gray-200/50 p-8">
      <div className="flex justify-between items-center mb-8 px-2">
        <div><h3 className="text-xl font-black text-gray-900 tracking-tight">Key Accounts</h3><p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-1">Highest value customers</p></div>
        <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline px-4 py-2 bg-primary/5 rounded-xl">View All</button>
      </div>
      <div className="space-y-4">
        {topCustomers.map((customer, i) => (
          <div key={customer.name} className="flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-2xl group hover:border-primary/30 transition-all cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-primary shadow-sm group-hover:bg-primary group-hover:text-white transition-all"><UserIcon index={i} /></div>
              <div><p className="text-sm font-black text-gray-900">{customer.name}</p><p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{customer.count} Invoices</p></div>
            </div>
            <div className="text-right">
              <p className="text-sm font-black text-gray-900">{formatCurrency(customer.total)}</p>
              <div className={cn("text-[10px] font-bold flex items-center justify-end gap-1", customer.growth > 0 ? "text-emerald-500" : "text-rose-500")}>
                {customer.growth > 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}{Math.abs(customer.growth)}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function InvoiceVolumeSection() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-7 bg-white border border-gray-200 rounded-[2rem] shadow-xl shadow-gray-200/50 p-8">
      <div className="flex justify-between items-center mb-8 px-2">
        <div><h3 className="text-xl font-black text-gray-900 tracking-tight">Invoice Volume</h3><p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-1">Transaction frequency count</p></div>
        <div className="p-2 h-fit bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"><MoreVertical size={16} className="text-gray-400" /></div>
      </div>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
            <Tooltip cursor={{ fill: '#f8fafc', radius: 10 }} contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} />
            <Bar dataKey="invoices" fill="#0ea5e9" radius={[6, 6, 0, 0]} barSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
