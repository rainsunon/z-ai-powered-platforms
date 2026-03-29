import React from 'react';
import { cn } from '@/lib/utils';
import type { Medication } from '@/store/useMedicationStore';

interface MedicationItemProps {
  medication: Medication;
  onToggleTaken: (id: string) => void;
  onEdit: (med: Medication) => void;
  onDelete: (id: string) => void;
}

export function MedicationItem({ medication, onToggleTaken, onEdit, onDelete }: MedicationItemProps) {
  return (
    <div className={cn('p-4 rounded-2xl border transition-all flex items-center gap-4', medication.taken ? 'bg-surface-container border-transparent opacity-70' : 'bg-surface-container-lowest border-outline-variant/50 hover:border-primary/50')}>
      <button
        onClick={() => onToggleTaken(medication.id)}
        className={cn('w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors shrink-0', medication.taken ? 'bg-primary border-primary text-on-primary' : 'border-outline hover:border-primary')}
      >
        {medication.taken && <span className="material-symbols-outlined text-[16px]">check</span>}
      </button>
      <div className="flex-1 min-w-0">
        <p className={cn('font-headline font-semibold text-sm', medication.taken ? 'text-on-surface-variant line-through' : 'text-on-surface')}>{medication.name}</p>
        <p className="font-body text-xs text-outline">{medication.dosage} • {medication.type} • {medication.time}</p>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <button onClick={() => onEdit(medication)} className="p-1.5 rounded-lg hover:bg-surface-container transition-colors">
          <span className="material-symbols-outlined text-[18px] text-on-surface-variant">edit</span>
        </button>
        <button onClick={() => onDelete(medication.id)} className="p-1.5 rounded-lg hover:bg-error-container transition-colors">
          <span className="material-symbols-outlined text-[18px] text-error">delete</span>
        </button>
      </div>
    </div>
  );
}
