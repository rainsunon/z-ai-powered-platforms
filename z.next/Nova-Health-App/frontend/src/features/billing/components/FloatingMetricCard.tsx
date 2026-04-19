import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface FloatingMetricCardProps {
  icon: string;
  iconBg: string;
  iconColor?: string;
  label: string;
  value: string;
  className?: string;
}

export function FloatingMetricCard({
  icon,
  iconBg,
  iconColor,
  label,
  value,
  className = '',
}: FloatingMetricCardProps) {
  return (
    <Card
      className={`bg-surface-container-lowest/80 backdrop-blur-md rounded-[2rem] shadow-[0px_20px_40px_rgba(21,30,18,0.06)] border-outline-variant/15 ${className}`}
    >
      <CardContent className="p-6 flex items-center gap-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${iconBg}`}>
          <span className={`material-symbols-outlined ${iconColor ?? ''}`}>{icon}</span>
        </div>
        <div>
          <p className="text-xs font-bold text-on-surface-variant/50">{label}</p>
          <p className="text-base font-bold text-on-surface">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
