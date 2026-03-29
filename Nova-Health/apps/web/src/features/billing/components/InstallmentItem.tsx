import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface InstallmentItemProps {
  index: number;
  label: string;
  dueDate: string;
  amount: string;
  status: 'due-today' | 'upcoming';
}

export function InstallmentItem({
  index,
  label,
  dueDate,
  amount,
  status,
}: InstallmentItemProps) {
  const isDueToday = status === 'due-today';

  return (
    <Card className="rounded-[1.5rem] border-0 hover:translate-y-[-2px] hover:shadow-[0px_20px_40px_rgba(21,30,18,0.06)] transition-all">
      <CardContent className="p-6 flex flex-wrap md:flex-nowrap items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
              isDueToday
                ? 'bg-primary-container/20 text-primary'
                : 'bg-surface-container text-on-surface-variant'
            }`}
          >
            {index}
          </div>
          <div>
            <p className="font-bold text-on-surface">{label}</p>
            <p className="text-sm text-on-surface-variant">{dueDate}</p>
          </div>
        </div>
        <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end">
          <p className="text-lg font-bold text-on-surface">{amount}</p>
          <Badge
            className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
              isDueToday
                ? 'bg-primary text-on-primary hover:bg-primary'
                : 'bg-surface-container text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            {isDueToday ? 'Due Today' : 'Upcoming'}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
