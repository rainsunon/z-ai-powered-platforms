import React from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface SalesFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterStatus: string;
  onFilterStatusChange: (value: string) => void;
  filterCategory: string;
  onFilterCategoryChange: (value: string) => void;
  categories: string[];
}

export function SalesFilters({
  searchTerm,
  onSearchChange,
  filterStatus,
  onFilterStatusChange,
  filterCategory,
  onFilterCategoryChange,
  categories,
}: SalesFiltersProps) {
  return (
    <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
      <div className="relative w-full sm:w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        <input 
          type="text" 
          placeholder="Search customer or invoice..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50/50 focus:bg-white transition-all outline-none focus:ring-2 focus:ring-primary/10"
        />
      </div>
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <div className="flex border border-gray-200 rounded-lg overflow-hidden p-1 bg-gray-50/50">
          {["all", "unpaid", "overdue"].map((status) => (
            <button 
              key={status}
              onClick={() => onFilterStatusChange(status)}
              className={cn(
                "px-3 py-1 text-xs font-bold rounded-md transition-all capitalize",
                filterStatus === status ? "bg-white text-primary shadow-sm" : "text-gray-500 hover:text-gray-900"
              )}
            >
              {status}
            </button>
          ))}
        </div>
        <select 
          value={filterCategory}
          onChange={(e) => onFilterCategoryChange(e.target.value)}
          className="pl-3 pr-8 py-2 bg-gray-50/50 border border-gray-200 rounded-lg text-xs font-bold text-gray-600 outline-none focus:ring-2 focus:ring-primary/10 transition-all appearance-none cursor-pointer hover:bg-white"
        >
          <option value="all">All Categories</option>
          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
      </div>
    </div>
  );
}
