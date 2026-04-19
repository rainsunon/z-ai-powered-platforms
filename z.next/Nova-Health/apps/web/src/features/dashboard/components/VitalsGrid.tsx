import React from 'react';

export function VitalsGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      {/* Heart Rate */}
      <div className="p-6 rounded-3xl bg-surface-container-lowest border border-surface-variant/50 shadow-sm hover:shadow-md transition-shadow group">
        <div className="flex justify-between items-start mb-4">
          <div className="w-12 h-12 rounded-2xl bg-error-container text-on-error-container flex items-center justify-center group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined">monitor_heart</span>
          </div>
          <span className="flex items-center gap-1 text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-full">
            <span className="material-symbols-outlined text-[14px]">trending_up</span>
            2%
          </span>
        </div>
        <h3 className="font-body text-outline text-sm font-medium mb-1">Heart Rate</h3>
        <div className="flex items-baseline gap-2">
          <span className="font-headline font-bold text-4xl text-on-surface">72</span>
          <span className="font-body text-outline text-sm">BPM</span>
        </div>
        <div className="mt-4 h-1.5 w-full bg-surface-variant rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary to-primary-container w-[70%] rounded-full"></div>
        </div>
      </div>

      {/* Blood Oxygen */}
      <div className="p-6 rounded-3xl bg-secondary-fixed text-on-secondary-fixed shadow-sm hover:shadow-md transition-shadow group">
        <div className="flex justify-between items-start mb-4">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>water_drop</span>
        </div>
        <h3 className="text-sm font-medium uppercase tracking-wider opacity-70 mb-1">Blood Oxygen</h3>
        <div className="flex items-baseline gap-2">
          <span className="font-headline font-bold text-4xl">98</span>
          <span className="text-sm">%</span>
        </div>
        <p className="text-[10px] mt-4 font-bold bg-white/30 inline-block px-2 py-0.5 rounded-full">OPTIMAL</p>
      </div>

      {/* Sleep */}
      <div className="p-6 rounded-3xl bg-surface-container-lowest border border-surface-variant/50 shadow-sm hover:shadow-md transition-shadow group">
        <div className="flex justify-between items-start mb-4">
          <div className="w-12 h-12 rounded-2xl bg-secondary-container text-on-secondary-container flex items-center justify-center group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined">bedtime</span>
          </div>
        </div>
        <h3 className="font-body text-outline text-sm font-medium mb-1">Sleep Quality</h3>
        <div className="flex items-baseline gap-2">
          <span className="font-headline font-bold text-4xl text-on-surface">8.4</span>
          <span className="font-body text-outline text-sm">Hrs</span>
        </div>
        <p className="text-xs mt-4 text-primary font-semibold flex items-center">
          <span className="material-symbols-outlined text-xs mr-1">trending_up</span> +12% vs Avg
        </p>
      </div>
    </div>
  );
}
