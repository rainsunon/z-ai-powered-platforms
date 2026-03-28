import React from 'react';

const barHeights = [40, 65, 55, 85, 45, 100, 20];

export function VitalRecoveryChart() {
  return (
    <div className="bg-surface-container-low p-6 rounded-[2rem] flex flex-col justify-between">
      <div>
        <h3 className="font-headline font-bold text-xl mb-1">Vital Recovery</h3>
        <p className="text-xs text-outline">Post-workout metrics analysis</p>
      </div>
      <div className="h-32 flex items-end justify-between gap-2 mt-4">
        {barHeights.map((h, i) => {
          const isHighest = h === Math.max(...barHeights);
          return (
            <div
              key={i}
              className={`flex-1 rounded-t-lg transition-all ${
                isHighest
                  ? 'bg-gradient-to-t from-primary to-primary-container'
                  : `bg-primary/${Math.round((h / 100) * 60 + 10)}`
              }`}
              style={{ height: `${h}%` }}
            ></div>
          );
        })}
      </div>
    </div>
  );
}
