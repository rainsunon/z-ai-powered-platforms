import React from 'react';
import { Badge } from '@/components/ui/badge';

interface SymptomCardProps {
  symptom: {
    id: number;
    name: string;
    date: string;
    severity: string;
    resolved: boolean;
  };
  onToggleResolved: (id: number) => void;
}

export function SymptomCard({ symptom, onToggleResolved }: SymptomCardProps) {
  const severityVariant = symptom.severity === 'Severe' ? 'destructive' : symptom.severity === 'Moderate' ? 'outline' : 'secondary';

  return (
    <div className={`bg-surface-container-lowest p-6 rounded-[2rem] border transition-all ${symptom.resolved ? 'border-primary/30 bg-primary/5' : 'border-transparent hover:shadow-md'}`}>
      <div className="flex justify-between items-start mb-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${symptom.resolved ? 'bg-primary/20 text-primary' : 'bg-secondary-container/30 text-on-surface'}`}>
          <span className="material-symbols-outlined">{symptom.resolved ? 'check_circle' : 'healing'}</span>
        </div>
        <button 
          onClick={() => onToggleResolved(symptom.id)}
          className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${symptom.resolved ? 'bg-primary text-white shadow-md shadow-primary/20' : 'bg-surface-container-high text-on-surface-variant hover:bg-primary/10 hover:text-primary'}`}
        >
          {symptom.resolved && <span className="material-symbols-outlined text-[14px]">check</span>}
          {symptom.resolved ? 'Resolved' : 'Mark Resolved'}
        </button>
      </div>
      <h5 className={`text-xl font-bold font-headline mb-2 transition-all ${symptom.resolved ? 'line-through text-on-surface-variant opacity-70' : 'text-on-surface'}`}>{symptom.name}</h5>
      <div className={`flex items-center gap-3 text-sm font-medium transition-all ${symptom.resolved ? 'text-on-surface-variant opacity-70' : 'text-on-surface-variant'}`}>
        <span>{symptom.date}</span>
        <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
        <Badge variant={severityVariant} className={`${symptom.severity === 'Moderate' ? 'border-orange-300 text-orange-600' : ''}`}>
          {symptom.severity}
        </Badge>
      </div>
    </div>
  );
}
