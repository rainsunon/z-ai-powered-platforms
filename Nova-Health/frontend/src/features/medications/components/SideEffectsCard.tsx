import React from 'react';

interface SideEffectsCardProps {
  common: string[];
  serious: string[];
}

export function SideEffectsCard({ common, serious }: SideEffectsCardProps) {
  return (
    <div className="bg-surface rounded-2xl p-6">
      <h2 className="text-xl font-bold text-on-surface mb-6 flex items-center gap-2">
        <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
          warning
        </span>
        Side Effects
      </h2>
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-bold text-on-surface mb-3">Common</h3>
          <div className="space-y-2">
            {common.map((effect, index) => (
              <div key={index} className="flex items-center gap-2 text-sm text-on-surface-variant">
                <span className="material-symbols-outlined text-[16px] text-tertiary">fiber_manual_record</span>
                {effect}
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-bold text-error mb-3">Serious</h3>
          <div className="space-y-2">
            {serious.map((effect, index) => (
              <div key={index} className="flex items-center gap-2 text-sm text-on-surface-variant">
                <span className="material-symbols-outlined text-[16px] text-error">error</span>
                {effect}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
