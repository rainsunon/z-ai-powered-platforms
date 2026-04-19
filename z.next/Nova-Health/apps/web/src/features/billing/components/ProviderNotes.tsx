import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

export function ProviderNotes() {
  return (
    <Card className="bg-surface-container-high/50 rounded-[2rem] border-0">
      <CardContent className="p-8">
        <h3 className="font-headline font-bold text-xl mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">clinical_notes</span>
          Provider Notes
        </h3>
        <p className="text-on-surface-variant text-sm leading-relaxed">
          Patient presented with multiple suspicious moles on the upper back region. Punch biopsy
          performed on the largest lesion (8mm diameter). Results will be available within 5-7
          business days. Cryotherapy applied to three actinic keratoses. Follow-up appointment
          recommended in two weeks to review pathology results and assess treatment area healing.
        </p>
      </CardContent>
    </Card>
  );
}
