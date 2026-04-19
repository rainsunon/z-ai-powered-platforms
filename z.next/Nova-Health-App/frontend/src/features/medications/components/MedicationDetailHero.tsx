import React from 'react';
import { Badge } from '@/components/ui/badge';

interface MedicationDetailHeroProps {
  medicationName?: string;
  medicationType?: string;
  dosage?: string;
  doctorName?: string;
  sinceDate?: string;
}

export function MedicationDetailHero({
  medicationName = 'Lisinopril',
  medicationType = 'ACE Inhibitor',
  dosage = '10mg Oral Tablet',
  doctorName = 'Dr. Sarah Mitchell',
  sinceDate = 'Mar 15, 2024'
}: MedicationDetailHeroProps) {
  return (
    <section className="flex flex-col md:flex-row justify-between items-start gap-6">
      <div className="flex items-start gap-6">
        <div className="w-20 h-20 rounded-[1.5rem] bg-primary/10 flex items-center justify-center shadow-sm">
          <span className="material-symbols-outlined text-4xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>pill</span>
        </div>
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-4xl md:text-5xl font-headline font-extrabold text-on-surface tracking-tight">{medicationName}</h2>
            <Badge variant="secondary" className="bg-secondary-container text-secondary text-[10px] font-black uppercase tracking-tighter px-3 py-1 rounded-full">Active</Badge>
          </div>
          <p className="text-on-surface-variant mt-1">{medicationType} • {dosage}</p>
          <p className="text-on-surface-variant text-sm mt-1">Prescribed by <span className="font-bold text-on-surface">{doctorName}</span> • Since {sinceDate}</p>
        </div>
      </div>
      <div className="flex gap-3">
        <button className="bg-surface-container-high text-primary font-bold px-6 py-3 rounded-full hover:bg-surface-container-highest transition-colors flex items-center gap-2">
          <span className="material-symbols-outlined">edit</span> Edit
        </button>
        <button className="primary-gradient text-white font-bold px-8 py-3 rounded-full shadow-lg hover:opacity-95 transition-opacity flex items-center gap-2">
          <span className="material-symbols-outlined">refresh</span> Request Refill
        </button>
      </div>
    </section>
  );
}
