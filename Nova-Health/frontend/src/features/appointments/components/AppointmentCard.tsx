import React from 'react';
import { type Appointment } from '@/store/useAppointmentStore';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

const typeConfig: Record<Appointment['type'], { label: string; className: string }> = {
  'in-person': { label: 'In-person', className: 'bg-secondary-container text-on-secondary-container' },
  telehealth: { label: 'Telehealth', className: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' },
  lab: { label: 'Lab Work', className: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200' },
};

const statusConfig: Record<Appointment['status'], { label: string; className: string }> = {
  upcoming: { label: 'Upcoming', className: 'bg-primary/10 text-primary' },
  completed: { label: 'Completed', className: 'bg-secondary-container text-secondary' },
  cancelled: { label: 'Cancelled', className: 'bg-error-container text-error' },
};

interface AppointmentCardProps {
  appointment: Appointment;
  onEdit: (appointment: Appointment) => void;
  onDelete: (id: string) => void;
  onCancel: (id: string) => void;
  onExport: (appointment: Appointment) => void;
}

export function AppointmentCard({ appointment: apt, onEdit, onDelete, onCancel, onExport }: AppointmentCardProps) {
  return (
    <Card
      className={cn(
        'rounded-3xl border-surface-variant/50 bg-surface-container-lowest shadow-sm hover:shadow-md transition-all',
        apt.status === 'cancelled' && 'opacity-60',
      )}
    >
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-surface-container flex items-center justify-center text-primary shrink-0">
              <span className="material-symbols-outlined text-2xl">{apt.icon}</span>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-headline font-bold text-lg text-on-surface">{apt.title}</h3>
                <Badge className={cn('text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-widest border-none h-auto', statusConfig[apt.status].className)}>
                  {statusConfig[apt.status].label}
                </Badge>
                <Badge className={cn('text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-widest border-none h-auto', typeConfig[apt.type].className)}>
                  {typeConfig[apt.type].label}
                </Badge>
              </div>
              <p className="font-body text-sm text-on-surface-variant mt-1">
                {apt.doctor} • {apt.specialty}
              </p>
              <div className="flex items-center gap-4 mt-2 text-sm text-outline">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                  {apt.date}
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">schedule</span>
                  {apt.time} ({apt.duration} min)
                </span>
                <span className="items-center gap-1 hidden sm:flex">
                  <span className="material-symbols-outlined text-[16px]">location_on</span>
                  {apt.location}
                </span>
              </div>
              {apt.notes && (
                <p className="font-body text-xs text-outline mt-2 italic">{apt.notes}</p>
              )}
            </div>
          </div>
          <TooltipProvider>
            <div className="flex items-center gap-1 shrink-0">
              <Tooltip>
                <TooltipTrigger render={
                  <Button variant="ghost" size="icon" onClick={() => onExport(apt)} className="rounded-xl" />
                }>
                  <span className="material-symbols-outlined text-primary">download</span>
                </TooltipTrigger>
                <TooltipContent>Export to calendar</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger render={
                  <Button variant="ghost" size="icon" onClick={() => onEdit(apt)} className="rounded-xl" />
                }>
                  <span className="material-symbols-outlined text-on-surface-variant">edit</span>
                </TooltipTrigger>
                <TooltipContent>Edit</TooltipContent>
              </Tooltip>

              {apt.status === 'upcoming' && (
                <Tooltip>
                  <TooltipTrigger render={
                    <Button variant="ghost" size="icon" onClick={() => onCancel(apt.id)} className="rounded-xl hover:bg-error-container" />
                  }>
                    <span className="material-symbols-outlined text-error">cancel</span>
                  </TooltipTrigger>
                  <TooltipContent>Cancel appointment</TooltipContent>
                </Tooltip>
              )}

              <Tooltip>
                <TooltipTrigger render={
                  <Button variant="ghost" size="icon" onClick={() => onDelete(apt.id)} className="rounded-xl hover:bg-error-container" />
                }>
                  <span className="material-symbols-outlined text-error">delete</span>
                </TooltipTrigger>
                <TooltipContent>Delete</TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        </div>
      </CardContent>
    </Card>
  );
}
