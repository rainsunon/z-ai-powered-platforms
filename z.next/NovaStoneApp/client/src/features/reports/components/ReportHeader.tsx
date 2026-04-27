import React from "react";
import { Download, Printer } from "lucide-react";

interface ReportHeaderProps {
  dateRange: { start: string; end: string };
  onDateRangeChange: (range: { start: string; end: string }) => void;
  onExport: () => void;
}

export function ReportHeader({ dateRange, onDateRangeChange, onExport }: ReportHeaderProps) {
  return (
    <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
      <div>
        <h2 className="text-3xl font-semibold text-gray-900 tracking-tight">Financial Reports</h2>
        <p className="text-gray-500 mt-1">Deep dive into your business's fiscal health.</p>
      </div>
      <div className="flex flex-wrap items-center gap-3 bg-white p-2 rounded-lg border border-gray-100 shadow-sm">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-md border border-gray-200">
          <span className="text-[10px] font-bold text-gray-400 uppercase">From</span>
          <input 
            type="date" 
            value={dateRange.start}
            onChange={(e) => onDateRangeChange({ ...dateRange, start: e.target.value })}
            className="bg-transparent text-sm font-semibold text-gray-700 outline-none focus:ring-0 cursor-pointer"
          />
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-md border border-gray-200">
          <span className="text-[10px] font-bold text-gray-400 uppercase">To</span>
          <input 
            type="date" 
            value={dateRange.end}
            onChange={(e) => onDateRangeChange({ ...dateRange, end: e.target.value })}
            className="bg-transparent text-sm font-semibold text-gray-700 outline-none focus:ring-0 cursor-pointer"
          />
        </div>
        <div className="h-8 w-px bg-gray-200 mx-1 hidden sm:block"></div>
        <button 
          onClick={onExport}
          className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-500 hover:text-primary transition-colors"
        >
          <Download size={16} />
          Export
        </button>
        <button 
          onClick={() => window.print()}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md text-sm font-semibold hover:bg-opacity-90 transition-all shadow-sm shadow-primary/20"
        >
          <Printer size={16} />
          Print
        </button>
      </div>
    </div>
  );
}
