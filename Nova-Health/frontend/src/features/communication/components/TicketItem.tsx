import React from 'react';
import { Badge } from '@/components/ui/badge';

interface TicketItemProps {
  id: string;
  status: string;
  statusVariant: 'secondary' | 'outline';
  title: string;
  description: string;
  isResolved?: boolean;
}

const statusConfig = {
  secondary: 'bg-secondary-container text-on-secondary-container',
  outline: 'bg-surface-container-highest text-on-surface-variant',
};

export function TicketItem({
  id,
  status,
  statusVariant,
  title,
  description,
  isResolved = false,
}: TicketItemProps) {
  return (
    <div className={`${isResolved ? 'bg-white/40 opacity-70' : 'bg-white'} p-5 rounded-2xl border border-outline-variant/10 hover:shadow-md transition-shadow cursor-pointer`}>
      <div className="flex justify-between items-start mb-2">
        <span className="text-xs font-bold text-on-surface/40 uppercase">{id}</span>
        <Badge variant={statusVariant} className={`${statusConfig[statusVariant]} text-[10px] font-bold uppercase tracking-wider`}>
          {status}
        </Badge>
      </div>
      <h5 className="font-bold text-sm mb-1">{title}</h5>
      <p className="text-xs text-on-surface-variant line-clamp-1">{description}</p>
    </div>
  );
}
