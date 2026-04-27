import React from "react";
import { motion } from "motion/react";
import { ArrowUpRight, ArrowDownRight, Trophy, Activity, Receipt, Users } from "lucide-react";
import { cn } from "@/src/lib/utils";

export function KPIItem({ label, value, growth, trend, icon: Icon, description }: any) {
  return (
    <motion.div whileHover={{ y: -5 }} className="bg-white p-6 rounded-[2rem] border border-gray-200 shadow-xl shadow-gray-200/20 flex flex-col gap-4 relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.07] transition-all rotate-12 group-hover:rotate-0 group-hover:scale-125"><Icon size={120} /></div>
      <div className="flex justify-between items-start">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary"><Icon size={24} /></div>
        <div className={cn("px-2 py-1 rounded-lg text-[10px] font-black flex items-center gap-1", trend === "up" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600")}>
          {trend === "up" ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}{growth}
        </div>
      </div>
      <div>
        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-2">{label}</h4>
        <p className="text-3xl font-black text-gray-900 tracking-tighter leading-none">{value}</p>
        <p className="text-[9px] text-gray-400 font-bold mt-3 uppercase tracking-tight">{description}</p>
      </div>
    </motion.div>
  );
}

export function UserIcon({ index }: { index: number }) {
  const icons = [Trophy, Activity, Receipt, Users];
  const ColorIcon = icons[index % icons.length];
  return <ColorIcon size={20} />;
}
