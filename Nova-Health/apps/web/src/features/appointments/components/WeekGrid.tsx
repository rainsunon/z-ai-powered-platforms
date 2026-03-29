import React from 'react';
import { type Appointment } from '@/store/useAppointmentStore';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { statusColors, getTodayKey, buildWeekDates } from './calendar-utils';

interface WeekGridProps {
  currentDate: Date;
  selectedDate: string | null;
  appointmentsByDate: Record<string, Appointment[]>;
  onSelectDate: (dateKey: string) => void;
}

export function WeekGrid({ currentDate, selectedDate, appointmentsByDate, onSelectDate }: WeekGridProps) {
  const todayKey = getTodayKey();
  const weekDates = buildWeekDates(currentDate);

  return (
    <Card className="rounded-3xl border-surface-variant/50 bg-surface-container-lowest shadow-sm overflow-hidden">
      <CardContent className="p-0">
        <div className="grid grid-cols-7">
          {weekDates.map((wd) => {
            const isToday = wd.dateKey === todayKey;
            const dayApts = appointmentsByDate[wd.dateKey] || [];
            const isSelected = wd.dateKey === selectedDate;
            return (
              <button
                key={wd.dateKey}
                onClick={() => onSelectDate(wd.dateKey)}
                className={cn(
                  'p-4 min-h-[300px] border-r border-surface-variant/15 text-center transition-colors hover:bg-surface-container/50',
                  isSelected && 'bg-primary/5',
                )}
              >
                <div className="mb-3">
                  <div className="text-xs text-outline font-bold uppercase">{wd.label}</div>
                  <div className={cn('text-2xl font-bold font-headline mt-1', isToday && 'text-primary')}>{wd.day}</div>
                  <div className="text-[10px] text-outline">{wd.monthLabel}</div>
                </div>
                <div className="space-y-1">
                  {dayApts.map((apt) => (
                    <div key={apt.id} className={cn('text-[10px] px-2 py-1 rounded-lg text-left', statusColors[apt.status])}>
                      <div className="font-bold">{apt.time}</div>
                      <div className="truncate">{apt.title}</div>
                    </div>
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
