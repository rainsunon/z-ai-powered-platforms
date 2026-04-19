import React from 'react';

interface ReportStatCardProps {
  icon: string;
  label: string;
  value: string;
  unit?: string;
  change: string;
  changeDirection: 'up' | 'down';
}

export function ReportStatCard({ icon, label, value, unit, change, changeDirection }: ReportStatCardProps) {
  const changeColor = changeDirection === 'up' ? 'text-emerald-600 bg-emerald-50' : 'text-tertiary bg-tertiary-fixed';

  return (
    <div className="bg-surface-container-lowest p-8 rounded-3xl shadow-sm border-b-4 border-emerald-500">
      <div className="flex justify-between items-start mb-4">
        <span className="material-symbols-outlined text-emerald-600 bg-emerald-50 p-3 rounded-2xl">{icon}</span>
        <span className={`text-xs font-bold ${changeColor} px-2 py-1 rounded-full`}>{change}</span>
      </div>
      <p className="text-stone-500 text-sm font-medium mb-1">{label}</p>
      <h3 className="text-3xl font-bold font-headline">
        {value}
        {unit && <span className="text-lg font-normal text-stone-400"> {unit}</span>}
      </h3>
    </div>
  );
}
