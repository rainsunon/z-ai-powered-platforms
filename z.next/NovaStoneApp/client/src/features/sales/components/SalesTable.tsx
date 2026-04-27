import React from "react";
import { motion } from "motion/react";
import {
  ChevronRight,
  Check,
  ExternalLink,
  Plus,
  ShoppingBag,
  Tag,
} from "lucide-react";
import { formatCurrency, cn } from "@/src/lib/utils";
import { Sale } from "../types";
import { SaleStatusBadge } from "./SaleStatusBadge";
import { SaleDetailPanel } from "./SaleDetailPanel";
import { SalesFilters } from "./SalesFilters";

interface SalesTableProps {
  sales: Sale[];
  filteredSales: Sale[];
  categories: string[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterStatus: string;
  onFilterStatusChange: (status: string) => void;
  filterCategory: string;
  onFilterCategoryChange: (category: string) => void;
  expandedRow: string | null;
  onToggleRow: (id: string) => void;
  selectedIds: string[];
  onToggleSelect: (e: React.MouseEvent, id: string) => void;
  onToggleSelectAll: () => void;
  onEdit: (sale: Sale) => void;
  onDelete: (id: string) => void;
  onReminderConfigure: (sale: Sale) => void;
}

export function SalesTable({
  sales,
  filteredSales,
  categories,
  searchTerm,
  onSearchChange,
  filterStatus,
  onFilterStatusChange,
  filterCategory,
  onFilterCategoryChange,
  expandedRow,
  onToggleRow,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  onEdit,
  onDelete,
  onReminderConfigure,
}: SalesTableProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <SalesFilters
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
        filterStatus={filterStatus}
        onFilterStatusChange={onFilterStatusChange}
        filterCategory={filterCategory}
        onFilterCategoryChange={onFilterCategoryChange}
        categories={categories}
      />

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100 text-[10px] uppercase font-bold text-gray-400 tracking-wider">
              <th className="py-4 px-6 w-12 text-center">
                <button
                  onClick={onToggleSelectAll}
                  className={cn(
                    "w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center mx-auto",
                    selectedIds.length === filteredSales.length && filteredSales.length > 0 ? "bg-primary border-primary text-white" : "border-gray-400 bg-white"
                  )}
                >
                  {selectedIds.length === filteredSales.length && filteredSales.length > 0 && <Check size={12} strokeWidth={4} />}
                </button>
              </th>
              <th className="py-4 px-6 w-8"></th>
              <th className="py-4 px-6">Customer</th>
              <th className="py-4 px-6">Invoice #</th>
              <th className="py-4 px-6">Date</th>
              <th className="py-4 px-6">Due Date</th>
              <th className="py-4 px-6">Category</th>
              <th className="py-4 px-6">Amount</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredSales.map((sale) => (
              <React.Fragment key={sale.id}>
                <tr
                  onClick={() => onToggleRow(sale.id)}
                  className={cn(
                    "hover:bg-gray-50/50 transition-colors group cursor-pointer",
                    expandedRow === sale.id && "bg-gray-50/80",
                    selectedIds.includes(sale.id) && "bg-primary/5"
                  )}
                >
                  <td className="py-4 px-6 text-center" onClick={(e) => onToggleSelect(e, sale.id)}>
                    <div className={cn(
                      "w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center mx-auto",
                      selectedIds.includes(sale.id) ? "bg-primary border-primary text-white" : "border-gray-400 bg-white"
                    )}>
                      {selectedIds.includes(sale.id) && <Check size={12} strokeWidth={4} />}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <motion.div animate={{ rotate: expandedRow === sale.id ? 90 : 0 }}>
                      <ChevronRight size={16} className="text-gray-300" />
                    </motion.div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-900">{sale.customer}</span>
                      <span className="text-xs text-gray-400">{sale.id}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm font-medium text-gray-600 font-mono">{sale.reference}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm text-gray-600">{sale.date}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm text-gray-600">{sale.dueDate}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-100 rounded-md w-fit">
                      <Tag size={10} className="text-gray-400" />
                      <span className="text-[10px] font-bold text-gray-600 uppercase tracking-tight">{sale.category}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm font-bold text-gray-900">{formatCurrency(sale.amount)}</span>
                  </td>
                  <td className="py-4 px-6">
                    <SaleStatusBadge status={sale.status} />
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2" onClick={e => e.stopPropagation()}>
                      <button onClick={() => onEdit(sale)} className="p-1.5 text-gray-400 hover:text-primary transition-colors">
                        <ExternalLink size={14} />
                      </button>
                      <button onClick={() => onDelete(sale.id)} className="p-1.5 text-gray-400 hover:text-rose-500 transition-colors">
                        <Plus className="rotate-45" size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
                {expandedRow === sale.id && (
                  <SaleDetailPanel sale={sale} onReminderConfigure={onReminderConfigure} />
                )}
              </React.Fragment>
            ))}
            {filteredSales.length === 0 && (
              <tr>
                <td colSpan={10} className="py-20 text-center">
                  <ShoppingBag size={40} className="text-gray-200 mx-auto mb-4" />
                  <p className="text-gray-400 font-medium">No sales found matching your criteria</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
