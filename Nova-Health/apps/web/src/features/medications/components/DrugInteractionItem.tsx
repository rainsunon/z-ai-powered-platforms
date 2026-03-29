import React from 'react';
import { Badge } from '@/components/ui/badge';

interface DrugInteractionItemProps {
  icon: string;
  iconColor: string;
  name: string;
  severity: string;
  description: string;
  borderClass: string;
  bgClass: string;
}

export function DrugInteractionItem({ icon, iconColor, name, severity, description, borderClass, bgClass }: DrugInteractionItemProps) {
  return (
    <div className={`flex items-start gap-4 p-4 rounded-xl border ${borderClass} ${bgClass}`}>
      <span className={`material-symbols-outlined text-2xl mt-0.5 ${iconColor}`} style={{ fontVariationSettings: "'FILL' 1" }}>
        {icon}
      </span>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <h3 className="font-bold text-on-surface">{name}</h3>
          <Badge variant="secondary" className="text-xs font-medium px-2.5 py-0.5">
            {severity}
          </Badge>
        </div>
        <p className="text-sm text-on-surface-variant">{description}</p>
      </div>
    </div>
  );
}
