import React from "react";
import { Search, Filter, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PurchasesFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterStatus: string;
  onStatusChange: (status: string) => void;
  filterCategory: string;
  onCategoryChange: (category: string) => void;
  categories: string[];
}

export function PurchasesFilters({
  searchTerm,
  onSearchChange,
  filterStatus,
  onStatusChange,
  filterCategory,
  onCategoryChange,
  categories
}: PurchasesFiltersProps) {
  return (
    <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
      <div className="relative w-full sm:w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        <input 
          type="text" 
          placeholder="Search vendor or reference..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50/50 focus:bg-white transition-all outline-none focus:ring-2 focus:ring-primary/10"
        />
      </div>
      
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <div className="flex border border-gray-200 rounded-lg overflow-hidden p-1 bg-gray-50/50">
          <button 
            onClick={() => onStatusChange("all")}
            className={cn(
              "px-3 py-1 text-xs font-bold rounded-md transition-all",
              filterStatus === "all" ? "bg-white text-primary shadow-sm" : "text-gray-500 hover:text-gray-900"
            )}
          >
            All
          </button>
          <button 
            onClick={() => onStatusChange("unpaid")}
            className={cn(
              "px-3 py-1 text-xs font-bold rounded-md transition-all",
              filterStatus === "unpaid" ? "bg-white text-primary shadow-sm" : "text-gray-500 hover:text-gray-900"
            )}
          >
            Unpaid
          </button>
          <button 
            onClick={() => onStatusChange("overdue")}
            className={cn(
              "px-3 py-1 text-xs font-bold rounded-md transition-all",
              filterStatus === "overdue" ? "bg-white text-primary shadow-sm" : "text-gray-500 hover:text-gray-900"
            )}
          >
            Overdue
          </button>
        </div>

        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
          <select 
            value={filterCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="pl-9 pr-8 py-2 bg-gray-50/50 border border-gray-200 rounded-lg text-xs font-bold text-gray-600 outline-none focus:ring-2 focus:ring-primary/10 transition-all appearance-none cursor-pointer hover:bg-white min-w-[140px]"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-300">
            <ChevronRight size={14} className="rotate-90" />
          </div>
        </div>
      </div>
    </div>
  );
}
