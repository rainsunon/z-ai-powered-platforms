import React from "react";
import { motion } from "motion/react";
import {
  ChevronRight,
  Check,
  ExternalLink,
  Plus,
  MoreHorizontal,
  ShoppingBag,
  Tag,
} from "lucide-react";
import { formatCurrency, cn } from "@/src/lib/utils";
import { Purchase } from "../types";
import { PurchaseStatusBadge } from "./PurchaseStatusBadge";
import { PurchaseDetailPanel } from "./PurchaseDetailPanel";
import { PurchasesFilters } from "./PurchasesFilters";

interface PurchasesTableProps {
  purchases: Purchase[];
  filteredPurchases: Purchase[];
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
  onEdit: (purchase: Purchase) => void;
  onDelete: (id: string) => void;
  onReminderConfigure: (purchase: Purchase) => void;
}

export function PurchasesTable({
  purchases,
  filteredPurchases,
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
}: PurchasesTableProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <PurchasesFilters
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
              <th className="py-4 px-6 w-12 text-center" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={onToggleSelectAll}
                  className={cn(
                    "w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center mx-auto",
                    selectedIds.length === filteredPurchases.length && filteredPurchases.length > 0
                      ? "bg-primary border-primary text-white"
                      : "border-gray-400 hover:border-primary bg-white shadow-sm"
                  )}
                >
                  {selectedIds.length === filteredPurchases.length && filteredPurchases.length > 0 && <Check size={12} strokeWidth={4} />}
                  {selectedIds.length > 0 && selectedIds.length < filteredPurchases.length && (
                    <div className="w-2.5 h-0.5 bg-primary rounded-full" />
                  )}
                </button>
              </th>
              <th className="py-4 px-6 w-8"></th>
              <th className="py-4 px-6">Vendor</th>
              <th className="py-4 px-6">PO #</th>
              <th className="py-4 px-6">Date</th>
              <th className="py-4 px-6">Due Date</th>
              <th className="py-4 px-6">Category</th>
              <th className="py-4 px-6">Amount</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredPurchases.length > 0 ? (
              filteredPurchases.map((purchase) => (
                <React.Fragment key={purchase.id}>
                  <PurchaseRow
                    purchase={purchase}
                    isExpanded={expandedRow === purchase.id}
                    isSelected={selectedIds.includes(purchase.id)}
                    onToggleRow={onToggleRow}
                    onToggleSelect={onToggleSelect}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                  {expandedRow === purchase.id && (
                    <PurchaseDetailPanel
                      purchase={purchase}
                      allPurchases={purchases}
                      onReminderConfigure={onReminderConfigure}
                    />
                  )}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan={10} className="py-20 text-center">
                  <div className="flex flex-col items-center">
                    <ShoppingBag size={40} className="text-gray-200 mb-4" />
                    <p className="text-gray-400 font-medium tracking-tight">No purchases found matching your search</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="p-5 border-t border-gray-100 flex justify-between items-center text-xs text-gray-400">
        <p>Showing {filteredPurchases.length} of {purchases.length} results</p>
        <div className="flex gap-2">
          <button disabled className="px-3 py-1 border border-gray-100 rounded opacity-50 cursor-not-allowed">Previous</button>
          <button disabled className="px-3 py-1 border border-gray-100 rounded opacity-50 cursor-not-allowed">Next</button>
        </div>
      </div>
    </div>
  );
}

function PurchaseRow({ purchase, isExpanded, isSelected, onToggleRow, onToggleSelect, onEdit, onDelete }: {
  purchase: Purchase;
  isExpanded: boolean;
  isSelected: boolean;
  onToggleRow: (id: string) => void;
  onToggleSelect: (e: React.MouseEvent, id: string) => void;
  onEdit: (purchase: Purchase) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <tr
      onClick={() => onToggleRow(purchase.id)}
      className={cn(
        "hover:bg-gray-50/50 transition-colors group cursor-pointer",
        isExpanded && "bg-gray-50/80",
        isSelected && "bg-primary/5"
      )}
    >
      <td className="py-4 px-6 text-center w-12" onClick={(e) => onToggleSelect(e, purchase.id)}>
        <div className={cn(
          "w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center mx-auto",
          isSelected
            ? "bg-primary border-primary text-white shadow-sm shadow-primary/20"
            : "border-gray-400 group-hover:border-primary bg-white"
        )}>
          {isSelected && <Check size={12} strokeWidth={4} />}
        </div>
      </td>
      <td className="py-4 px-6 text-center w-8">
        <motion.div
          animate={{ rotate: isExpanded ? 90 : 0 }}
          className="text-gray-300"
        >
          <ChevronRight size={16} />
        </motion.div>
      </td>
      <td className="py-4 px-6">
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-gray-900 group-hover:text-primary transition-colors">{purchase.vendor}</span>
          <span className="text-xs text-gray-400">{purchase.id}</span>
        </div>
      </td>
      <td className="py-4 px-6">
        <span className="text-sm font-medium text-gray-600 font-mono tracking-tighter uppercase">{purchase.reference}</span>
      </td>
      <td className="py-4 px-6">
        <span className="text-sm text-gray-600">{purchase.date}</span>
      </td>
      <td className="py-4 px-6">
        <span className="text-sm text-gray-600">{purchase.dueDate}</span>
      </td>
      <td className="py-4 px-6">
        <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-100 rounded-md w-fit">
          <Tag size={10} className="text-gray-400" />
          <span className="text-[10px] font-bold text-gray-600 uppercase tracking-tight">{purchase.category}</span>
        </div>
      </td>
      <td className="py-4 px-6">
        <span className="text-sm font-bold text-gray-900 tracking-tight">{formatCurrency(purchase.amount)}</span>
      </td>
      <td className="py-4 px-6">
        <PurchaseStatusBadge status={purchase.status} />
      </td>
      <td className="py-4 px-6 text-right">
        <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => onEdit(purchase)}
            className="p-1.5 text-gray-400 hover:text-primary transition-colors"
            title="Edit"
          >
            <ExternalLink size={14} />
          </button>
          <button
            onClick={() => {
              if (confirm("Are you sure you want to delete this record?")) {
                onDelete(purchase.id);
              }
            }}
            className="p-1.5 text-gray-400 hover:text-rose-500 transition-colors"
            title="Delete"
          >
            <Plus className="rotate-45" size={14} />
          </button>
          <button className="p-1.5 text-gray-400 hover:text-gray-900 transition-colors">
            <MoreHorizontal size={14} />
          </button>
        </div>
      </td>
    </tr>
  );
}
