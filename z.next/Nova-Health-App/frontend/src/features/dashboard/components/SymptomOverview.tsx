import React from 'react';

const symptoms = [
  { name: 'Fatigue', severity: 'Mild', percentage: 30, color: 'bg-secondary' },
  { name: 'Headache', severity: 'Moderate', percentage: 60, color: 'bg-[#d97706]' },
  { name: 'Joint Pain', severity: 'None', percentage: 0, color: 'bg-surface-variant' },
];

export function SymptomOverview() {
  return (
    <div className="p-8 rounded-3xl bg-surface-container-lowest border border-surface-variant/50 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-headline font-bold text-xl text-on-surface">Symptom Overview</h2>
          <p className="font-body text-sm text-outline">Last 7 days pattern</p>
        </div>
        <button className="text-primary hover:text-primary-container font-headline font-semibold text-sm flex items-center gap-1 transition-colors">
          View Details
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>
      </div>

      <div className="space-y-6">
        {symptoms.map((symptom, idx) => (
          <div key={idx}>
            <div className="flex justify-between items-end mb-2">
              <span className="font-headline font-semibold text-on-surface">{symptom.name}</span>
              <span className="font-body text-xs font-medium text-outline">{symptom.severity}</span>
            </div>
            <div className="h-3 w-full bg-surface-container rounded-full overflow-hidden">
              <div className={`h-full ${symptom.color} rounded-full transition-all duration-1000`} style={{ width: `${symptom.percentage}%` }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
