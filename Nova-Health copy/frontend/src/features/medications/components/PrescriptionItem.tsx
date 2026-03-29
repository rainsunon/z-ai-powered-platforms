import React from 'react';
import { cn } from '@/lib/utils';
import type { Medication } from '@/store/useMedicationStore';

interface PrescriptionItemProps {
  medication: Medication;
}

export function PrescriptionItem({ medication }: PrescriptionItemProps) {
  return (
    <div className="p-5 rounded-2xl bg-surface-container-low border border-outline-variant/30 group hover:border-primary/30 transition-colors">
      <div className="flex justify-between items-start mb-3">
        <div>
          <p className="font-headline font-bold text-on-surface">{medication.name}</p>
          <p className="font-body text-sm text-outline">{medication.dosage}</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-surface-container-lowest flex items-center justify-center text-primary shadow-sm">
          <span className="material-symbols-outlined">pill</span>
        </div>
      </div>
      {medication.prescribedBy && (
        <p className="font-body text-xs text-outline mb-3">Prescribed by {medication.prescribedBy}</p>
      )}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-outline-variant/20">
        <div>
          <p className="font-body text-xs text-outline mb-0.5">Refills left</p>
          <p className={cn('font-headline font-semibold text-sm', medication.refillsLeft === 0 ? 'text-error' : 'text-on-surface')}>{medication.refillsLeft}</p>
        </div>
        <div className="text-right">
          <p className="font-body text-xs text-outline mb-0.5">Next refill</p>
          <p className={cn('font-headline font-semibold text-sm', medication.refillsLeft === 0 ? 'text-error' : 'text-on-surface')}>{medication.nextRefill}</p>
        </div>
      </div>
      {medication.refillsLeft === 0 && (
        <button className="w-full mt-4 py-2 rounded-xl bg-error-container text-on-error-container font-headline font-semibold text-sm hover:bg-error/20 transition-colors">
          Request Refill
        </button>
      )}
    </div>
  );
}
