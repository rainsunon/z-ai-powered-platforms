import React from 'react';
import { type Appointment } from '@/store/useAppointmentStore';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {
  WEEKDAYS,
  statusColors,
  getTodayKey,
  buildMonthCells,
} from './calendar-utils';

interface MonthGridProps {
  year: number;
  month: number;
  selectedDate: string | null;
  appointmentsByDate: Record<string, Appointment[]>;
  onSelectDate: (dateKey: string) => void;
}

export function MonthGrid({ year, month, selectedDate, appointmentsByDate, onSelectDate }: MonthGridProps) {
  const todayKey = getTodayKey();
  const cells = buildMonthCells(year, month);

  return (
    <Card className="rounded-3xl border-surface-variant/50 bg-surface-container-lowest shadow-sm overflow-hidden">
      <CardContent className="p-0">
        <div className="grid grid-cols-7">
          {WEEKDAYS.map((d) => (
            <div key={d} className="py-3 text-center font-headline font-bold text-xs text-outline uppercase tracking-widest border-b border-surface-variant/30">
              {d}
            </div>
          ))}
          {cells.map((cell, i) => {
            const isToday = cell.dateKey === todayKey;
            const dayApts = appointmentsByDate[cell.dateKey];
            const hasAppointments = dayApts?.length > 0;
            const isSelected = cell.dateKey === selectedDate;
            return (
              <button
                key={i}
                onClick={() => onSelectDate(cell.dateKey)}
                className={cn(
                  'relative p-2 min-h-[80px] border-b border-r border-surface-variant/15 text-left transition-colors hover:bg-surface-container/50',
                  !cell.isCurrentMonth && 'opacity-30',
                  isSelected && 'bg-primary/5 ring-2 ring-primary ring-inset',
                )}
              >
                <span className={cn(
                  'inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-bold',
                  isToday && 'bg-primary text-on-primary',
                )}>
                  {cell.day}
                </span>
                {hasAppointments && (
                  <div className="mt-1 space-y-0.5">
                    {dayApts.slice(0, 2).map((apt) => (
                      <div key={apt.id} className={cn('text-[9px] px-1.5 py-0.5 rounded truncate', statusColors[apt.status])}>
                        {apt.time} {apt.title}
                      </div>
                    ))}
                    {dayApts.length > 2 && (
                      <div className="text-[9px] text-outline font-bold">+{dayApts.length - 2} more</div>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
