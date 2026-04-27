import React from "react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { formatCurrency } from "@/src/lib/utils";
import {
  ReportHeader,
  ReportKPICard,
  ReportNavigation,
  ReportTable,
  RevenueTrendChart,
  NetWorthChart,
  PurchaseChart,
  ReportContent,
} from "../components";
import { revenueTrendData, netWorthTrendData, purchaseTrendData } from "../data/reportData";

export function ReportsPage() {
  const [reportType, setReportType] = React.useState("profit-loss");
  const [dateRange, setDateRange] = React.useState({ start: "2026-01-01", end: "2026-06-30" });

  const handleExport = () => {
    let dataToExport: any[] = [];
    const filename = `novastone-report-${reportType}-${dateRange.start}-to-${dateRange.end}.csv`;

    if (reportType === "profit-loss") {
      dataToExport = revenueTrendData.map(item => ({ Month: item.month, Revenue: item.revenue, Expenses: item.expenses, NetProfit: item.revenue - item.expenses }));
    } else if (reportType === "net-worth") {
      dataToExport = netWorthTrendData.map(item => ({ Month: item.month, Assets: item.assets, Liabilities: item.liabilities, NetWorth: item.equity }));
    } else if (reportType === "purchases") {
      dataToExport = purchaseTrendData.map(item => ({ Month: item.month, PurchaseAmount: item.amount }));
    } else {
      toast.error("Export for this report type is not yet implemented.");
      return;
    }

    try {
      const headers = Object.keys(dataToExport[0]);
      const csvContent = [headers.join(","), ...dataToExport.map(row => headers.map(header => row[header]).join(","))].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success(`${reportType.replace("-", " ").toUpperCase()} exported successfully!`);
    } catch (error) {
      toast.error("Failed to export report data.");
    }
  };

  const handleExportTable = (title: string, items: { label: string; amount: number }[], total: number) => {
    const filename = `novastone-${title.toLowerCase().replace(/\s+/g, '-')}-${dateRange.start}-to-${dateRange.end}.csv`;
    try {
      const csvContent = ["Category,Amount", ...items.map(item => `"${item.label}",${item.amount}`), `"Total ${title}",${total}`].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success(`${title} exported successfully!`);
    } catch (error) {
      toast.error(`Failed to export ${title}.`);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-8 space-y-8 bg-[#fcfcfc] min-h-screen">
      <ReportHeader dateRange={dateRange} onDateRangeChange={setDateRange} onExport={handleExport} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ReportKPICard title="Total Revenue" amount={328000} trend="+15.2%" isPositive={true} />
        <ReportKPICard title="Gross Profit" amount={184500} trend="+8.4%" isPositive={true} />
        <ReportKPICard title="Total Expenses" amount={143500} trend="+4.1%" isPositive={false} />
        <ReportKPICard title="Net Margin" amount={28.5} unit="%" trend="+2.3%" isPositive={true} />
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-3 no-print">
          <ReportNavigation activeReport={reportType} onReportChange={setReportType} />
        </div>

        <div className="col-span-12 lg:col-span-9 space-y-6">
          <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm min-h-[600px]">
            <div className="flex justify-between items-center mb-10 pb-6 border-b border-gray-100">
              <div>
                <h3 className="text-xl font-bold text-gray-900 capitalize">{reportType.replace("-", " ")}</h3>
                <p className="text-xs text-gray-500 mt-1">Period: {new Date(dateRange.start).toLocaleDateString()} - {new Date(dateRange.end).toLocaleDateString()}</p>
              </div>
              <div className="flex gap-2">
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-full text-[10px] font-bold text-gray-500"><div className="w-2 h-2 rounded-full bg-primary" /> Revenue</div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-full text-[10px] font-bold text-gray-500"><div className="w-2 h-2 rounded-full bg-red-500" /> Expenses</div>
              </div>
            </div>

            <div className="mb-10">
              {reportType === "net-worth" ? <NetWorthChart data={netWorthTrendData} /> : reportType === "purchases" ? <PurchaseChart data={purchaseTrendData} /> : <RevenueTrendChart data={revenueTrendData} />}
            </div>

            <ReportContent reportType={reportType} dateRange={dateRange} onExportTable={handleExportTable} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
