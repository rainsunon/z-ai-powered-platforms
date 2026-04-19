import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface MedicationBreadcrumbProps {
  medicationName?: string;
}

export function MedicationBreadcrumb({ medicationName = 'Lisinopril' }: MedicationBreadcrumbProps) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-2 text-sm text-on-surface-variant">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => navigate('/medications')}
        className="hover:text-primary transition-colors flex items-center gap-1"
      >
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span>{medicationName}</span>
      </Button>
    </div>
  );
}
