import React from 'react';
import type { Medication } from '@/store/useMedicationStore';
import { MedicationItem } from './MedicationItem';

interface TimeSectionProps {
  title: string;
  time: string;
  icon: string;
  iconBgClass: string;
  iconTextClass: string;
  medications: Medication[];
  onToggleTaken: (id: string) => void;
  onEdit: (med: Medication) => void;
  onDelete: (id: string) => void;
}

export function TimeSection({
  title,
  time,
  icon,
  iconBgClass,
  iconTextClass,
  medications,
  onToggleTaken,
  onEdit,
  onDelete
}: TimeSectionProps) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-8 h-8 rounded-full ${iconBgClass} ${iconTextClass} flex items-center justify-center`}>
          <span className="material-symbols-outlined text-[18px]">{icon}</span>
        </div>
        <h3 className="font-headline font-semibold text-lg text-on-surface">{title}</h3>
        <span className="font-body text-xs text-outline ml-auto">{time}</span>
      </div>
      <div className="space-y-3">
        {medications.length > 0 ? medications.map((med) => (
          <MedicationItem
            key={med.id}
            medication={med}
            onToggleTaken={onToggleTaken}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        )) : (
          <p className="text-outline text-sm italic p-4">No {title.toLowerCase()} medications scheduled.</p>
        )}
      </div>
    </div>
  );
}
