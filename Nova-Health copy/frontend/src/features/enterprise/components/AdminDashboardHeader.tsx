import React from 'react';
import { Badge } from '@/components/ui/badge';

interface AdminDashboardHeaderProps {
  subtitle?: string;
  title?: string;
  statusText?: string;
  statusIndicator?: 'nominal' | 'warning' | 'critical';
}

const statusColors = {
  nominal: 'bg-primary',
  warning: 'bg-amber-500',
  critical: 'bg-red-500'
};

export function AdminDashboardHeader({
  subtitle = 'NovaHealth Lumina',
  title = 'Admin Command Center',
  statusText = 'All Systems Nominal',
  statusIndicator = 'nominal'
}: AdminDashboardHeaderProps) {
  return (
    <div className="flex justify-between items-end">
      <div>
        <span className="text-primary font-bold text-sm tracking-widest uppercase">{subtitle}</span>
        <h2 className="text-4xl font-extrabold font-headline text-on-surface tracking-tight mt-1">{title}</h2>
      </div>
      <div className="flex gap-3">
        <Badge className="bg-surface-container-highest px-4 py-2 rounded-xl flex items-center gap-2">
          <span className={`w-2 h-2 ${statusColors[statusIndicator]} rounded-full`}></span>
          <span className="text-xs font-bold text-on-surface-variant uppercase">{statusText}</span>
        </Badge>
      </div>
    </div>
  );
}
