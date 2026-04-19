import React from 'react';
import { Button } from '@/components/ui/button';

interface MedicationsHeaderProps {
  onAdd: () => void;
}

export function MedicationsHeader({ onAdd }: MedicationsHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="font-headline font-bold text-3xl text-on-surface">Medications</h1>
        <p className="font-body text-outline mt-1">Track your daily prescriptions and supplements.</p>
      </div>
      <Button
        onClick={onAdd}
        className="px-6 py-3 rounded-2xl primary-gradient text-on-primary font-headline font-bold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all flex items-center gap-2 self-start sm:self-auto"
      >
        <span className="material-symbols-outlined">add</span>
        Add Medication
      </Button>
    </div>
  );
}
