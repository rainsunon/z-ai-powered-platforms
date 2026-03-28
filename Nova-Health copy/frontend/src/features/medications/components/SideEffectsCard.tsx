import React from 'react';
import { Badge } from '@/components/ui/badge';

interface SideEffectsCardProps {
  common: string[];
  serious: string[];
}

export function SideEffectsCard({ common, serious }: SideEffectsCardProps) {
  return (
    <div className="bg-surface-container-lowest p-8 rounded-[2rem] shadow-sm">
      <h3 className="font-headline font-bold text-xl mb-6 flex items-center gap-2">
        <span className="material-symbols-outlined text-primary">health_and_safety</span>
        Side Effects
      </h3>
      <div className="space-y-4">
        <div>
          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-3">Common</p>
          <div className="flex flex-wrap gap-2">
            {common.map((effect) => (
              <Badge key={effect} variant="ghost" className="bg-surface-container text-on-surface-variant text-xs font-bold px-3 py-1.5 rounded-full">
                {effect}
              </Badge>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-3">Serious (Contact Doctor)</p>
          <div className="flex flex-wrap gap-2">
            {serious.map((effect) => (
              <Badge key={effect} variant="destructive" className="bg-error-container/50 text-error text-xs font-bold px-3 py-1.5 rounded-full border-none">
                {effect}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
