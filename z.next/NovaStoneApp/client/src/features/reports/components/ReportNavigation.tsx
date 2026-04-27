import React from "react";
import { cn } from "@/src/lib/utils";

interface ReportNavigationProps {
  activeReport: string;
  onReportChange: (reportType: string) => void;
}

const reportTypes = [
  { id: "profit-loss", label: "Profit & Loss" },
  { id: "balance-sheet", label: "Balance Sheet" },
  { id: "cash-flow", label: "Cash Flow Statement" },
  { id: "tax-summary", label: "Tax Summary" },
  { id: "aged-receivables", label: "Aged Receivables" },
  { id: "net-worth", label: "Net Worth" },
  { id: "purchases", label: "Purchases Audit" },
];

export function ReportNavigation({ activeReport, onReportChange }: ReportNavigationProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50">
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500">Report Types</h3>
        </div>
        <nav className="p-2 space-y-1">
          {reportTypes.map((report) => (
            <ReportNavButton
              key={report.id}
              active={activeReport === report.id}
              onClick={() => onReportChange(report.id)}
              label={report.label}
            />
          ))}
        </nav>
      </div>

      <div className="bg-[#003c2a] rounded-xl p-6 text-white">
        <h4 className="font-semibold mb-2">Need a custom report?</h4>
        <p className="text-xs text-white/70 mb-4 leading-relaxed">
          Let NovaStone AI generate a specific analysis based on your requirements.
        </p>
        <button className="w-full py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded text-xs font-bold transition-all">
          Ask AI Assistant
        </button>
      </div>
    </div>
  );
}

function ReportNavButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all group relative",
        active
          ? "bg-primary/5 text-primary"
          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
      )}
    >
      {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />}
      {label}
    </button>
  );
}
