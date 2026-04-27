import React from "react";
import { Trash2, Edit3, GitMerge, Check, Filter, ArrowDownUp, Sparkles, Search, ChevronDown } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface TransactionActionBarProps {
  selectedCount: number;
  totalCount: number;
  onSelectAll: () => void;
  isAllSelected: boolean;
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export function TransactionActionBar({ selectedCount, totalCount, onSelectAll, isAllSelected, searchTerm, onSearchChange }: TransactionActionBarProps) {
  return (
    <div className="p-4 flex flex-wrap items-center gap-4 border-b border-gray-100 bg-gray-50/50">
      <div className="flex items-center gap-3">
        <input type="checkbox" checked={isAllSelected} onChange={onSelectAll} className="w-5 h-5 rounded border-gray-300 text-[#0077c5] focus:ring-[#0077c5]" />
        <span className="text-sm font-semibold text-gray-600">Select all</span>
      </div>
      <div className="flex items-center gap-2 border-l border-gray-200 pl-4">
        <ActionButton icon={Trash2} />
        <ActionButton icon={Edit3} />
        <ActionButton icon={GitMerge} />
        <ActionButton icon={Check} disabled={selectedCount === 0} />
      </div>
      <div className="flex-1" />
      <div className="flex items-center gap-2">
        <button className="flex items-center gap-2 px-4 py-2 border border-[#cfe6ff] bg-white text-[#0077c5] rounded-full text-xs font-bold hover:bg-gray-50"><Filter size={14} />Filter</button>
        <button className="flex items-center gap-2 px-4 py-2 border border-[#cfe6ff] bg-white text-[#0077c5] rounded-full text-xs font-bold hover:bg-gray-50"><ArrowDownUp size={14} />Sort</button>
        <div className="relative">
          <button className="flex items-center gap-2 px-4 py-2 bg-[#f3edff] border border-[#e1d4ff] text-[#8b5cf6] rounded-full text-xs font-bold hover:bg-[#ede5ff]"><Sparkles size={14} />139 new auto-updates<ChevronDown size={14} /></button>
        </div>
        <div className="relative min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
          <input type="text" placeholder="Search transactions" className="w-full pl-10 pr-10 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#0077c5]/10 outline-none" value={searchTerm} onChange={(e) => onSearchChange(e.target.value)} />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-gray-100 rounded flex items-center justify-center text-gray-400"><Search size={12} /></div>
        </div>
      </div>
    </div>
  );
}

function ActionButton({ icon: Icon, disabled = false }: { icon: any; disabled?: boolean }) {
  return (
    <button disabled={disabled} className={cn("p-2 rounded-lg border transition-all", disabled ? "border-gray-100 text-gray-200 cursor-not-allowed" : "border-gray-200 text-gray-400 hover:border-[#0077c5] hover:text-[#0077c5] hover:bg-[#0077c5]/5")}>
      <Icon size={16} />
    </button>
  );
}
