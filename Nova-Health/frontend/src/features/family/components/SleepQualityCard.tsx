import React from 'react';
import { MemberData } from './health-summary-data';

interface SleepQualityCardProps {
  member: MemberData;
}

export function SleepQualityCard({ member }: SleepQualityCardProps) {
  const sleepBreakdown = [
    { label: 'Deep Sleep', value: member.deepSleep, color: 'bg-tertiary', percent: 27 },
    { label: 'REM Sleep', value: member.remSleep, color: 'bg-primary', percent: 22 },
    { label: 'Light Sleep', value: member.lightSleep, color: 'bg-secondary', percent: 44 },
    { label: 'Awake', value: member.awake, color: 'bg-outline-variant', percent: 7 },
  ];

  return (
    <div className="bg-surface-container-lowest p-8 rounded-[2rem] shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-tertiary/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>
              bedtime
            </span>
          </div>
          <div>
            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Sleep Quality</p>
            <p className="text-3xl font-extrabold font-headline text-on-surface">
              {member.sleepHours}h {member.sleepMinutes}m
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
          <span className="material-symbols-outlined text-sm">trending_up</span> Excellent
        </span>
      </div>
      {/* Sleep Breakdown */}
      <div className="space-y-3">
        {sleepBreakdown.map(({ label, value, color, percent }) => (
          <div key={label}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-on-surface-variant">{label}</span>
              <span className="text-sm font-bold text-on-surface">{value}</span>
            </div>
            <div className="h-2 bg-surface-container rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${color}`} style={{ width: `${percent}%` }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
