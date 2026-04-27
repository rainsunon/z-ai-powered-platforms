import React from "react";
import { ChevronDown, Search } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { motion } from "motion/react";

export function TabButton({ active, onClick, label, count }: { active: boolean; onClick: () => void; label: string; count?: number }) {
  return (
    <button onClick={onClick} className={cn("px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2", active ? "bg-white text-blue-600 shadow-sm" : "text-gray-400 hover:text-gray-600")}>
      {label}
      {count !== undefined && (
        <span className={cn("w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold", active ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500")}>{count}</span>
      )}
    </button>
  );
}
