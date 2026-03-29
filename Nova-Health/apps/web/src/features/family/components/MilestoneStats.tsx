import React from 'react';

interface StatItem {
  label: string;
  value: string;
}

interface MilestoneStatsProps {
  stats?: StatItem[];
}

const defaultStats: StatItem[] = [
  { label: 'Time Period', value: '7 Days' },
  { label: 'Effort Rank', value: 'Top 1%' }
];

export function MilestoneStats({ stats = defaultStats }: MilestoneStatsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white/40 backdrop-blur-xl p-6 rounded-3xl border border-outline-variant/15 text-left">
          <p className="text-on-surface-variant text-sm font-medium mb-1">{stat.label}</p>
          <p className="font-headline font-bold text-xl text-primary">{stat.value}</p>
        </div>
      ))}
    </div>
  );
}
