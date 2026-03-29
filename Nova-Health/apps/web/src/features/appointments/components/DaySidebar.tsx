import React from 'react';
import { useNavigate } from 'react-router-dom';
import { type Appointment } from '@/store/useAppointmentStore';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { statusColors, buildMonthPrefix } from './calendar-utils';

interface DaySidebarProps {
  selectedDate: string | null;
  selectedAppointments: Appointment[];
  allAppointments: Appointment[];
  year: number;
  month: number;
}

export function DaySidebar({ selectedDate, selectedAppointments, allAppointments, year, month }: DaySidebarProps) {
  const navigate = useNavigate();
  const prefix = buildMonthPrefix(year, month);
  const monthApts = allAppointments.filter((a) => a.date.startsWith(prefix));

  return (
    <div className="space-y-6">
      {/* Selected Date Details */}
      <Card className="rounded-3xl border-surface-variant/50 bg-surface-container-lowest shadow-sm">
        <CardHeader>
          <CardTitle className="font-headline font-bold text-lg text-on-surface">
            {selectedDate
              ? new Date(selectedDate + 'T00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
              : 'Select a Date'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedDate ? (
            selectedAppointments.length > 0 ? (
              <div className="space-y-3">
                {selectedAppointments.map((apt) => (
                  <div key={apt.id} className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={cn('text-[10px] px-2 py-0.5 rounded-full font-bold uppercase border-none h-auto', statusColors[apt.status])}>
                        {apt.status}
                      </Badge>
                      <span className="text-xs text-outline">{apt.time} ({apt.duration} min)</span>
                    </div>
                    <p className="font-headline font-bold text-on-surface">{apt.title}</p>
                    <p className="text-sm text-on-surface-variant">{apt.doctor}</p>
                    <p className="text-xs text-outline mt-1">{apt.location}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <span className="material-symbols-outlined text-3xl text-outline mb-2 block">event_busy</span>
                <p className="text-outline text-sm">No appointments on this date</p>
                <Button variant="link" onClick={() => navigate('/appointments')} className="text-primary font-bold text-sm mt-2">
                  Schedule one
                </Button>
              </div>
            )
          ) : (
            <p className="text-outline text-sm">Click on a date to see appointment details.</p>
          )}
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Card className="rounded-3xl border-surface-variant/50 bg-surface-container-lowest shadow-sm">
        <CardHeader>
          <CardTitle className="font-headline font-bold text-lg text-on-surface">This Month</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-on-surface-variant">Total Appointments</span>
            <span className="font-bold text-on-surface">{monthApts.length}</span>
          </div>
          <Separator className="bg-surface-variant/30" />
          <div className="flex items-center justify-between">
            <span className="text-sm text-on-surface-variant">Upcoming</span>
            <span className="font-bold text-primary">
              {monthApts.filter((a) => a.status === 'upcoming').length}
            </span>
          </div>
          <Separator className="bg-surface-variant/30" />
          <div className="flex items-center justify-between">
            <span className="text-sm text-on-surface-variant">Completed</span>
            <span className="font-bold text-secondary">
              {monthApts.filter((a) => a.status === 'completed').length}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
