import React from 'react';

export function HealthScoreCard() {
  return (
    <div className="bg-surface-container-lowest p-8 rounded-[2.5rem] shadow-sm">
      <h4 className="font-headline font-bold mb-6 flex items-center gap-2">
        <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
        Health Score
      </h4>
      <div className="flex flex-col items-center">
        <div className="relative w-32 h-32 mb-4">
          <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
            <circle cx="60" cy="60" r="50" fill="none" stroke="currentColor" className="text-surface-container" strokeWidth="8" />
            <circle cx="60" cy="60" r="50" fill="none" stroke="currentColor" className="text-primary" strokeWidth="8" strokeLinecap="round" strokeDasharray={`${(94 / 100) * 314.16} ${314.16}`} />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-extrabold font-headline text-primary">94</span>
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">/100</span>
          </div>
        </div>
        <p className="text-sm text-on-surface-variant text-center">Your overall health score is <span className="text-primary font-bold">Excellent</span></p>
      </div>
      <div className="mt-6 space-y-3">
        {[
          { label: 'Physical', value: 96, color: 'bg-primary' },
          { label: 'Mental', value: 91, color: 'bg-secondary' },
          { label: 'Nutrition', value: 88, color: 'bg-tertiary' },
        ].map((item) => (
          <div key={item.label}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-on-surface-variant">{item.label}</span>
              <span className="font-bold text-on-surface">{item.value}%</span>
            </div>
            <div className="h-2 bg-surface-container rounded-full overflow-hidden">
              <div className={`h-full ${item.color} rounded-full transition-all`} style={{ width: `${item.value}%` }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
