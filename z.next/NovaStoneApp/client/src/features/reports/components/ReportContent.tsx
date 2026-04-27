import React from "react";
import { formatCurrency } from "@/src/lib/utils";
import { ReportTable, ExpensePieChart } from "../components";
import {
  revenueTrendData, expenseCategoryData, netWorthTrendData, purchaseTrendData,
  currentAssetItems, fixedAssetItems, liabilityItems, purchaseItems,
} from "../data/reportData";

const assetTotal = [...currentAssetItems, ...fixedAssetItems].reduce((acc, curr) => acc + curr.amount, 0);
const liabilityTotal = liabilityItems.reduce((acc, curr) => acc + curr.amount, 0);
const purchaseTotal = purchaseItems.reduce((acc, curr) => acc + curr.amount, 0);

interface ReportContentProps {
  reportType: string;
  dateRange: { start: string; end: string };
  onExportTable: (title: string, items: { label: string; amount: number }[], total: number) => void;
}

export function ReportContent({ reportType, dateRange, onExportTable }: ReportContentProps) {
  if (reportType === "net-worth") return <NetWorthContent onExportTable={onExportTable} />;
  if (reportType === "purchases") return <PurchasesContent onExportTable={onExportTable} />;
  return <ProfitLossContent />;
}

function NetWorthContent({ onExportTable }: { onExportTable: (title: string, items: { label: string; amount: number }[], total: number) => void }) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-10 gap-y-12">
        <div className="space-y-8">
          <ReportTable title="Current Assets" items={currentAssetItems} total={currentAssetItems.reduce((acc, curr) => acc + curr.amount, 0)} onExport={() => onExportTable("Current Assets", currentAssetItems, currentAssetItems.reduce((acc, curr) => acc + curr.amount, 0))} />
          <ReportTable title="Non-Current Assets" items={fixedAssetItems} total={fixedAssetItems.reduce((acc, curr) => acc + curr.amount, 0)} onExport={() => onExportTable("Non-Current Assets", fixedAssetItems, fixedAssetItems.reduce((acc, curr) => acc + curr.amount, 0))} />
          <div className="bg-primary/5 p-4 rounded-lg flex justify-between items-center border border-primary/10">
            <span className="text-xs font-bold text-primary uppercase tracking-widest">Total Assets</span>
            <span className="text-lg font-black text-primary">{formatCurrency(assetTotal)}</span>
          </div>
        </div>
        <div className="space-y-12">
          <ReportTable title="Liabilities" items={liabilityItems} total={liabilityTotal} onExport={() => onExportTable("Liabilities", liabilityItems, liabilityTotal)} />
          <div className="pt-10 border-t border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest">Expense Allocation</h4>
              <span className="text-[10px] font-bold text-gray-400">OPERATIONAL VIEW</span>
            </div>
            <ExpensePieChart data={expenseCategoryData} size="sm" showLegend />
          </div>
        </div>
      </div>
      <div className="pt-8 border-t-2 border-gray-900 bg-gray-50/30 p-6 rounded-b-xl flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex flex-col">
          <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">Shareholder Equity</span>
          <span className="text-xl font-black text-gray-900 uppercase tracking-tighter">Total Net Worth</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-3xl font-black text-primary tracking-tighter">{formatCurrency(assetTotal - liabilityTotal)}</span>
          <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full mt-1">+12.4% From Last Period</span>
        </div>
      </div>
    </div>
  );
}

function PurchasesContent({ onExportTable }: { onExportTable: (title: string, items: { label: string; amount: number }[], total: number) => void }) {
  return (
    <div className="space-y-8">
      <ReportTable title="Procurement Breakdown" items={purchaseItems} total={purchaseTotal} onExport={() => onExportTable("Purchases", purchaseItems, purchaseTotal)} />
      <div className="pt-8 border-t-2 border-gray-900 bg-gray-50/30 p-6 rounded-b-xl flex justify-between items-center">
        <div className="flex flex-col">
          <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">Acquisition Metrics</span>
          <span className="text-xl font-black text-gray-900 uppercase tracking-tighter">Total Purchases</span>
        </div>
        <span className="text-3xl font-black text-primary tracking-tighter">{formatCurrency(purchaseTotal)}</span>
      </div>
    </div>
  );
}

function ProfitLossContent() {
  return (
    <>
      <div className="border-b border-gray-100 pb-10 mb-10">
        <h4 className="text-sm font-bold text-gray-900 mb-6 uppercase tracking-widest">Expense Allocation</h4>
        <ExpensePieChart data={expenseCategoryData} size="md" showLegend />
      </div>
      <div className="space-y-4">
        <ReportTable title="Operating Income" items={[{ label: "Sales Revenue", amount: 285400 }, { label: "Consulting Fees", amount: 42600 }, { label: "Other Income", amount: 1500 }]} total={329500} />
        <ReportTable title="Operating Expenses" items={[{ label: "Cost of Goods Sold", amount: 82400 }, { label: "Salaries & Wages", amount: 45000 }, { label: "Rent & Utilities", amount: 12500 }, { label: "Marketing & Advertising", amount: 3600 }, { label: "Software Subscriptions", amount: 5200 }, { label: "Insurance", amount: 1800 }]} total={150500} />
        <div className="pt-6 border-t-2 border-gray-900 flex justify-between items-center mt-8">
          <span className="text-lg font-black text-gray-900 uppercase tracking-tighter">Net Operating Income</span>
          <span className="text-2xl font-black text-primary tracking-tighter">{formatCurrency(179000)}</span>
        </div>
      </div>
    </>
  );
}
