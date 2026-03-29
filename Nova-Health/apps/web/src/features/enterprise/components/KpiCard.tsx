import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface KpiCardProps {
  icon: string;
  iconBgClass: string;
  title: string;
  value: string;
  trendLabel: string;
  trendBgClass: string;
  highlighted?: boolean;
}

export function KpiCard({ icon, iconBgClass, title, value, trendLabel, trendBgClass, highlighted }: KpiCardProps) {
  return (
    <Card className={`bg-surface-container-lowest/70 backdrop-blur-xl p-8 rounded-[2rem] shadow-[0px_20px_40px_rgba(21,30,18,0.06)] flex flex-col justify-between ring-0 ${highlighted ? 'border-2 border-primary/5' : 'border-0'}`}>
      <CardContent className="p-0">
        <div className="flex justify-between items-start mb-6">
          <div className={`p-3 ${iconBgClass} rounded-2xl`}>
            <span className="material-symbols-outlined text-3xl">{icon}</span>
          </div>
          <Badge className={`${trendBgClass} text-xs font-bold px-3 py-1 rounded-full h-auto border-0`}>{trendLabel}</Badge>
        </div>
        <div>
          <h3 className="font-headline text-on-surface-variant text-sm font-semibold uppercase tracking-widest mb-1">{title}</h3>
          <p className="font-headline text-4xl font-extrabold text-primary">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
