import React from "react";
import { cn } from "@/src/lib/utils";
import { Filter, X } from "lucide-react";

interface FilterOption {
  label: string;
  value: string;
}

interface FilterBarProps {
  filters: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: FilterOption[];
  }[];
  activeFiltersCount?: number;
  onClearAll?: () => void;
}

export function FilterBar({ filters, activeFiltersCount, onClearAll }: FilterBarProps) {
  return (
    <div className="flex items-center gap-3 mb-4 flex-wrap">
      <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
        <Filter size={16} />
        <span>Filters:</span>
      </div>
      
      {filters.map((filter, index) => (
        <select
          key={index}
          value={filter.value}
          onChange={(e) => filter.onChange(e.target.value)}
          className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none"
        >
          {filter.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ))}
      
      {activeFiltersCount && activeFiltersCount > 0 && onClearAll && (
        <button
          onClick={onClearAll}
          className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <X size={14} />
          Clear All
        </button>
      )}
    </div>
  );
}

interface FilterChipProps {
  label: string;
  onRemove: () => void;
}

export function FilterChip({ label, onRemove }: FilterChipProps) {
  return (
    <div className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
      {label}
      <button onClick={onRemove} className="hover:bg-blue-100 rounded-full p-0.5">
        <X size={12} />
      </button>
    </div>
  );
}
