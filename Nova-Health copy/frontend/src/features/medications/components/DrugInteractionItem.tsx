import React from 'react';
import { Badge } from '@/components/ui/badge';

interface DrugInteractionItemProps {
  icon: string;
  iconColor: string;
  name: string;
  description: string;
  severity: 'High' | 'Moderate' | 'Safe';
  borderClass: string;
  bgClass: string;
}

const severityConfig = {
  High: { variant: 'destructive' as const, className: 'bg-error-container text-error' },
  Moderate: { variant: 'outline' as const, className: 'bg-tertiary-container text-on-tertiary-container border-none' },
  Safe: { variant: 'secondary' as const, className: 'bg-secondary-container text-secondary' },
};

export function DrugInteractionItem({ icon, iconColor, name, description, severity, borderClass, bgClass }: DrugInteractionItemProps) {
  const config = severityConfig[severity];

  return (
    <div className={`p-4 rounded-2xl border ${borderClass} ${bgClass}`}>
      <div className="flex items-start gap-3">
        <span className={`material-symbols-outlined ${iconColor} mt-0.5`}>{icon}</span>
        <div>
          <p className="font-bold text-on-surface text-sm">{name}</p>
          <p className="text-xs text-on-surface-variant mt-1">{description}</p>
        </div>
        <Badge variant={config.variant} className={`${config.className} text-[10px] font-black uppercase tracking-tighter ml-auto shrink-0`}>
          {severity}
        </Badge>
      </div>
    </div>
  );
}
