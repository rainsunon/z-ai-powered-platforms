import React from 'react';
import { Button } from '@/components/ui/button';
import { MedicationBreadcrumb } from './MedicationBreadcrumb';

interface MedicationHeroProps {
  medicationName?: string;
}

export function MedicationHero({ medicationName = 'Lisinopril' }: MedicationHeroProps) {
  return (
    <section className="flex flex-col md:flex-row justify-between items-start gap-6">
      <div className="flex items-start gap-6">
        <div className="w-20 h-20 rounded-[1.5rem] bg-primary/10 flex items-center justify-center shadow-sm">
          <span className="material-symbols-outlined text-4xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
            pill
          </span>
        </div>
        <div>
          <h1 className="text-4xl md:text-5xl font-headline font-extrabold text-on-surface tracking-tight">
            {medicationName}
          </h1>
          <p className="text-lg text-on-surface-variant mt-2">
            Track dosage, schedule, and manage your daily prescriptions efficiently.
          </p>
        </div>
      </div>
      <Button
        variant="outline"
        size="icon"
        className="bg-surface-container-high text-primary font-bold px-6 py-3 rounded-full hover:bg-surface-container-highest transition-colors"
      >
        <span className="material-symbols-outlined">add</span>
        Add Medication
      </Button>
    </section>
  );
}
