import React from 'react';
import type { Medication } from '@/store/useMedicationStore';
import { TimeSection } from './TimeSection';

interface TodayScheduleCardProps {
  morningMeds: Medication[];
  eveningMeds: Medication[];
  onToggleTaken: (id: string) => void;
  onEdit: (med: Medication) => void;
  onDelete: (id: string) => void;
}

export function TodayScheduleCard({
  morningMeds,
  eveningMeds,
  onToggleTaken,
  onEdit,
  onDelete
}: TodayScheduleCardProps) {
  return (
    <div className="p-8 rounded-3xl bg-surface-container-lowest border border-surface-variant/50 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-headline font-bold text-xl text-on-surface">Today's Schedule</h2>
        <div className="flex items-center gap-2 bg-surface-container-low px-3 py-1.5 rounded-full border border-outline-variant/30">
          <span className="material-symbols-outlined text-outline text-[18px]">calendar_today</span>
          <span className="font-body text-sm font-medium text-on-surface-variant">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
        </div>
      </div>

      {/* Morning */}
      <div className="mb-8">
        <TimeSection
          title="Morning"
          time="8:00 AM"
          icon="light_mode"
          iconBgClass="bg-secondary-container"
          iconTextClass="text-on-secondary-container"
          medications={morningMeds}
          onToggleTaken={onToggleTaken}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </div>

      {/* Evening */}
      <div>
        <TimeSection
          title="Evening"
          time="8:00 PM"
          icon="dark_mode"
          iconBgClass="bg-surface-container-highest"
          iconTextClass="text-on-surface-variant"
          medications={eveningMeds}
          onToggleTaken={onToggleTaken}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </div>
    </div>
  );
}
