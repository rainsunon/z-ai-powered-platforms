import React from "react";
import { Plus, Download, Printer, Tag } from "lucide-react";

interface PurchasesHeaderProps {
  onNewPurchase: () => void;
  onExport: () => void;
  onManageCategories: () => void;
}

export function PurchasesHeader({ onNewPurchase, onExport, onManageCategories }: PurchasesHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h2 className="text-3xl font-semibold text-gray-900 tracking-tight">Purchases</h2>
        <p className="text-gray-500 mt-1">Manage your bills, expenses and vendor payments.</p>
      </div>
      <div className="flex items-center gap-3">
        <button 
          onClick={onManageCategories}
          className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-md text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all"
        >
          <Tag size={16} />
          Categories
        </button>
        <button 
          onClick={onExport}
          className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-md text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all"
        >
          <Download size={16} />
          Export CSV
        </button>
        <button 
          onClick={() => window.print()}
          className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-md text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all"
        >
          <Printer size={16} />
          Print PDF
        </button>
        <button 
          onClick={onNewPurchase}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md text-sm font-semibold hover:bg-opacity-90 transition-all shadow-sm shadow-primary/20"
        >
          <Plus size={16} />
          New Purchase
        </button>
      </div>
    </div>
  );
}
