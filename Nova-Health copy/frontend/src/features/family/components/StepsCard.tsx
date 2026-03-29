import React from 'react';
import { MemberData } from './health-summary-data';

interface StepsCardProps {
  member: MemberData;
}

export function StepsCard({ member }: StepsCardProps) {
  const stepPercent = Math.min((member.steps / member.stepGoal) * 100, 100);

  return (
    <div className="bg-surface-container-lowest p-8 rounded-[2rem] shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-secondary/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>
              footprint
            </span>
          </div>
          <div>
            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Steps Today</p>
            <p className="text-3xl font-extrabold font-headline text-on-surface">
              {member.steps.toLocaleString()}
            </p>
          </div>
        </div>
        <span className="text-sm text-on-surface-variant font-bold">
          / {member.stepGoal.toLocaleString()}
        </span>
      </div>
      {/* Progress Ring */}
      <div className="flex items-center gap-8">
        <div className="relative w-28 h-28 flex-shrink-0">
          <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
            <circle cx="60" cy="60" r="50" fill="none" stroke="currentColor" className="text-surface-container" strokeWidth="10" />
            <circle cx="60" cy="60" r="50" fill="none" stroke="currentColor" className="text-secondary" strokeWidth="10" strokeLinecap="round" strokeDasharray={`${(stepPercent / 100) * 314.16} 314.16`} />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-extrabold font-headline text-on-surface">
              {Math.round(stepPercent)}%
            </span>
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Goal</span>
          </div>
        </div>
        <div className="space-y-3 flex-1">
          <div className="flex items-center justify-between">
            <span className="text-sm text-on-surface-variant">Distance</span>
            <span className="text-sm font-bold text-on-surface">{(member.steps * 0.000473).toFixed(1)} mi</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-on-surface-variant">Calories</span>
            <span className="text-sm font-bold text-on-surface">{Math.round(member.steps * 0.04)} kcal</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-on-surface-variant">Active Minutes</span>
            <span className="text-sm font-bold text-on-surface">{Math.round(member.steps / 100)} min</span>
          </div>
        </div>
      </div>
    </div>
  );
}
