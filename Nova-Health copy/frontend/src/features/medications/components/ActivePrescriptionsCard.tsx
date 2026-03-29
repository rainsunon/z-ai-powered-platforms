import React from 'react';
import type { Medication } from '@/store/useMedicationStore';
import { PrescriptionItem } from './PrescriptionItem';

interface ActivePrescriptionsCardProps {
  medications: Medication[];
}

export function ActivePrescriptionsCard({ medications }: ActivePrescriptionsCardProps) {
  return (
    <div className="p-8 rounded-3xl bg-surface-container-lowest border border-surface-variant/50 shadow-sm">
      <h2 className="font-headline font-bold text-xl text-on-surface mb-6">Active Prescriptions</h2>
      <div className="space-y-4">
        {medications.map((med) => (
          <PrescriptionItem key={med.id} medication={med} />
        ))}
      </div>
    </div>
  );
}
