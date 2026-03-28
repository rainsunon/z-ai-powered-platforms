import React from 'react';
import { DrugInteractionItem } from './DrugInteractionItem';

interface Interaction {
  icon: string;
  iconColor: string;
  name: string;
  severity: string;
  description: string;
  borderClass: string;
  bgClass: string;
}

interface DrugInteractionsCardProps {
  interactions: Interaction[];
}

export function DrugInteractionsCard({ interactions }: DrugInteractionsCardProps) {
  return (
    <div className="bg-surface-container-lowest p-8 rounded-[2rem] shadow-sm">
      <h3 className="font-headline font-bold text-xl mb-6 flex items-center gap-2">
        <span className="material-symbols-outlined text-tertiary">warning</span>
        Drug Interactions
      </h3>
      <div className="space-y-4">
        {interactions.map((item) => (
          <DrugInteractionItem key={item.name} {...item} />
        ))}
      </div>
    </div>
  );
}
