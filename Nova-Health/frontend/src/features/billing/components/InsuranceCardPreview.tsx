import React from 'react';

export function InsuranceCardPreview() {
  return (
    <div className="relative w-full aspect-[1.6/1] bg-stone-900 rounded-2xl p-6 text-white flex flex-col justify-between shadow-2xl overflow-hidden mb-8">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute -bottom-10 -right-10 w-48 h-48 border-[20px] border-white/20 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-white/10 rounded-full" />
      </div>
      <div className="flex justify-between items-start z-10">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-emerald-400 font-bold">Primary Carrier</p>
          <p className="text-lg font-bold">Luminous Shield PPO</p>
        </div>
        <div className="w-10 h-10 bg-white/20 rounded-full backdrop-blur-sm flex items-center justify-center">
          <span className="material-symbols-outlined text-emerald-400">eco</span>
        </div>
      </div>
      <div className="z-10">
        <p className="text-[8px] uppercase tracking-tighter opacity-60">Member Name</p>
        <p className="text-md font-medium tracking-tight">ELENA MARIE VANCE</p>
        <div className="flex gap-4 mt-4">
          <div>
            <p className="text-[8px] uppercase tracking-tighter opacity-60">Member ID</p>
            <p className="text-xs font-mono">LX-0092-8812</p>
          </div>
          <div>
            <p className="text-[8px] uppercase tracking-tighter opacity-60">Group #</p>
            <p className="text-xs font-mono">G-4451</p>
          </div>
        </div>
      </div>
    </div>
  );
}
