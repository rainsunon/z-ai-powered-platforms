import React from 'react';
import { Separator } from '@/components/ui/separator';

interface PrescriptionField {
  label: string;
  value: string;
  valueClass?: string;
}

interface PrescriptionInfoCardProps {
  fields: PrescriptionField[];
}

export function PrescriptionInfoCard({ fields }: PrescriptionInfoCardProps) {
  return (
    <div className="bg-surface-container-lowest p-8 rounded-[2rem] shadow-sm">
      <h3 className="font-headline font-bold text-xl mb-6 flex items-center gap-2">
        <span className="material-symbols-outlined text-primary">clinical_notes</span>
        Prescription Info
      </h3>
      <div className="space-y-4">
        {fields.map((field) => (
          <div key={field.label} className="flex justify-between items-center">
            <span className="text-sm text-on-surface-variant">{field.label}</span>
            <span className={`text-sm font-bold ${field.valueClass || 'text-on-surface'}`}>{field.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
