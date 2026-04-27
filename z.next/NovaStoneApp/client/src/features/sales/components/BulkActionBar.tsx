import React from "react";
import { motion } from "motion/react";
import { CheckCircle2, Download } from "lucide-react";

interface BulkActionBarProps {
  selectedCount: number;
  onMarkAsPaid: () => void;
  onExport: () => void;
  onClear: () => void;
}

export function BulkActionBar({ selectedCount, onMarkAsPaid, onExport, onClear }: BulkActionBarProps) {
  if (selectedCount === 0) return null;

  return (
    <motion.div 
      initial={{ y: 100, opacity: 0 }} 
      animate={{ y: 0, opacity: 1 }} 
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] bg-gray-950 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-8 backdrop-blur-md"
    >
      <div className="flex items-center gap-3 pr-8 border-r border-white/10">
        <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-[10px] font-black">
          {selectedCount}
        </div>
        <span className="text-xs font-bold uppercase text-gray-400">Selected</span>
      </div>
      <div className="flex items-center gap-4">
        <button 
          onClick={onMarkAsPaid} 
          className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-400 rounded-xl text-[10px] font-black uppercase hover:bg-emerald-500/20 transition-all"
        >
          <CheckCircle2 size={14} />
          Mark Paid
        </button>
        <button 
          onClick={onExport} 
          className="flex items-center gap-2 px-4 py-2 bg-white/5 text-white rounded-xl text-[10px] font-black uppercase hover:bg-white/10 transition-all"
        >
          <Download size={14} />
          Export
        </button>
        <button 
          onClick={onClear} 
          className="text-xs font-bold text-gray-500 hover:text-white transition-colors ml-4"
        >
          Clear
        </button>
      </div>
    </motion.div>
  );
}
