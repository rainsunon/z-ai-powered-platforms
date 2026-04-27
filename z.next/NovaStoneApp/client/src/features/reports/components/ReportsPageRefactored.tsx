import React from "react";
import { Download, Printer, FileText } from "lucide-react";
import { PageContainer, PageHeader, ActionBar, commonActions } from "@/shared";
import { ChartContainer, chartColors } from "@/shared/components/ui/ChartComponents";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
  LineChart,
  Line
} from "recharts";
import { formatCurrency } from "@/src/lib/utils";
import { toast } from "sonner";

// Mock data
const revenueTrendData = [
  { month: "Jan", revenue: 45000, expenses: 32000 },
  { month: "Feb", revenue: 52000, expenses: 35000 },
  { month: "Mar", revenue: 48000, expenses: 38000 },
  { month: "Apr", revenue: 61000, expenses: 40000 },
  { month: "May", revenue: 55000, expenses: 37000 },
  { month: "Jun", revenue: 67000, expenses: 42000 },
];

const expenseCategoryData = [
  { name: "Wages", value: 25000, color: chartColors.primary },
  { name: "Rent", value: 8000, color: chartColors.success },
  { name: "Marketing", value: 5000, color: chartColors.warning },
  { name: "Software", value: 3500, color: chartColors.danger },
  { name: "Utilities", value: 1200, color: chartColors.secondary },
];

export function ReportsPageRefactored() {
  const handleExport = () => {
    toast.success("Report exported successfully!");
  };

  const handlePrint = () => {
    window.print();
  };

  const handleGenerate = () => {
    toast.success("Report generated!");
  };

  const actions = [
    commonActions.export(handleExport),
    commonActions.print(handlePrint),
    commonActions.generate(handleGenerate),
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Financial Reports"
        subtitle="Comprehensive analytics and insights"
        icon={FileText}
        actions={<ActionBar actions={actions} />}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Revenue Trend Chart */}
        <ChartContainer title="Revenue vs Expenses" subtitle="Last 6 months" height={300}>
          <AreaChart data={revenueTrendData}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartColors.primary} stopOpacity={0.8} />
                <stop offset="95%" stopColor={chartColors.primary} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartColors.danger} stopOpacity={0.8} />
                <stop offset="95%" stopColor={chartColors.danger} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" stroke="#999" />
            <YAxis stroke="#999" tickFormatter={(value) => `$${value / 1000}k`} />
            <Tooltip formatter={(value: number) => formatCurrency(value)} />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke={chartColors.primary}
              fillOpacity={1}
              fill="url(#colorRevenue)"
            />
            <Area
              type="monotone"
              dataKey="expenses"
              stroke={chartColors.danger}
              fillOpacity={1}
              fill="url(#colorExpenses)"
            />
          </AreaChart>
        </ChartContainer>

        {/* Expense Categories Pie Chart */}
        <ChartContainer title="Expense Categories" subtitle="Current month breakdown" height={300}>
          <PieChart>
            <Pie
              data={expenseCategoryData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={(entry) => `${entry.name}: ${formatCurrency(entry.value)}`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {expenseCategoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => formatCurrency(value)} />
          </PieChart>
        </ChartContainer>
      </div>
    </PageContainer>
  );
}
