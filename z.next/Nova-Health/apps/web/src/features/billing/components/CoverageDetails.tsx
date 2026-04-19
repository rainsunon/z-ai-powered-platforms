import React from 'react';
import { Separator } from '@/components/ui/separator';

const COVERAGE_ITEMS = [
  { label: 'Coverage Type', value: 'Platinum Individual' },
  { label: 'Deductible Met', value: '$2,500 / $3,000' },
  { label: 'Co-pay', value: '$25.00 / Visit' },
] as const;

export function CoverageDetails() {
  return (
    <div className="space-y-4">
      {COVERAGE_ITEMS.map(({ label, value }) => (
        <div key={label}>
          <div className="flex justify-between text-sm py-2">
            <span className="text-on-surface-variant">{label}</span>
            <span className="font-bold">{value}</span>
          </div>
          <Separator className="bg-outline-variant/20" />
        </div>
      ))}
    </div>
  );
}
