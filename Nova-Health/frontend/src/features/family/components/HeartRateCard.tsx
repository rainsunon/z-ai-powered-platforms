import React from 'react';
import { MemberData } from './health-summary-data';

interface HeartRateCardProps {
  member: MemberData;
}

export function HeartRateCard({ member }: HeartRateCardProps) {
  const maxHR = Math.max(...member.heartRateHistory);
  const barWidth = 100 / member.heartRateHistory.length;

  return (
    <div className="bg-surface-container-lowest p-8 rounded-[2rem] shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-error/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-error" style={{ fontVariationSettings: "'FILL' 1" }}>
              favorite
            </span>
          </div>
          <div>
            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Heart Rate</p>
            <p className="text-3xl font-extrabold font-headline text-on-surface">
              {member.heartRate} <span className="text-sm font-normal text-on-surface-variant">BPM</span>
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
          <span className="material-symbols-outlined text-sm">check_circle</span> Normal
        </span>
      </div>
      {/* Heart Rate Bar Chart */}
      <div className="flex items-end gap-1 h-24">
        {member.heartRateHistory.map((hr, i) => (
          <div
            key={i}
            className="flex-1 bg-error/20 rounded-t-lg hover:bg-error/40 transition-colors relative group"
            style={{ height: `${(hr / maxHR) * 100}%` }}
          >
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-on-surface text-surface text-[10px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {hr}
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between text-[10px] text-on-surface-variant mt-2">
        <span>12 AM</span><span>6 AM</span><span>12 PM</span><span>6 PM</span>
      </div>
    </div>
  );
}
