import React from "react";
import { motion } from "motion/react";

export function AuthLayout({ children, title, subtitle }: { children: React.ReactNode; title: string; subtitle: string }) {
  return (
    <div className="min-h-screen bg-surface-bright flex items-center justify-center p-6 font-sans transition-colors duration-300">
      <div className="w-full max-w-md">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 flex flex-col items-center text-center"
        >
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center font-black text-2xl text-on-primary mb-4 shadow-xl shadow-primary/20">V</div>
          <h1 className="text-3xl font-bold tracking-tight text-on-surface mb-2">{title}</h1>
          <p className="text-on-surface-variant text-sm max-w-[280px] leading-relaxed">{subtitle}</p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-surface-container border border-outline-variant rounded-2xl p-8 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 opacity-[0.02] text-6xl font-black select-none pointer-events-none text-on-surface">SECURE</div>
          {children}
        </motion.div>

        <div className="mt-8 flex justify-center gap-6">
          <span className="text-[10px] font-bold uppercase tracking-widest text-outline hover:text-on-surface-variant cursor-pointer transition-colors">Security Protocol</span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-outline hover:text-on-surface-variant cursor-pointer transition-colors">Privacy Shield</span>
        </div>
      </div>
    </div>
  );
}
