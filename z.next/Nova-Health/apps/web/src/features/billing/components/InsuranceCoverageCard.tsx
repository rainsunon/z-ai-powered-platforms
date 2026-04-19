import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const COVERAGE_DETAILS = [
  { label: 'Plan', value: 'Luminous Shield PPO', valueClass: 'font-bold' },
  { label: 'Member ID', value: 'LX-0092-8812', valueClass: 'font-mono text-xs' },
  { label: 'Coverage Rate', value: '68.5%', valueClass: 'font-bold text-primary' },
] as const;

export function InsuranceCoverageCard() {
  return (
    <Card className="bg-primary-container/10 rounded-[2.5rem] border-2 border-primary-container/20 relative overflow-hidden">
      <CardContent className="p-8 relative z-10">
        <h4 className="font-headline font-bold mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">verified_user</span>
          Insurance Coverage
        </h4>
        <div className="space-y-4 text-sm">
          {COVERAGE_DETAILS.map(({ label, value, valueClass }) => (
            <div key={label} className="flex justify-between">
              <span className="text-on-surface-variant">{label}</span>
              <span className={valueClass}>{value}</span>
            </div>
          ))}
        </div>
        <Card className="bg-surface-container-lowest rounded-2xl mt-6 border-0">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-xs text-on-surface-variant mb-2">
              <span className="material-symbols-outlined text-[14px] text-primary">info</span>
              Deductible Progress
            </div>
            <Progress value={83} className="h-2" />
            <p className="text-xs text-on-surface-variant mt-2">$2,500 / $3,000 met</p>
          </CardContent>
        </Card>
      </CardContent>
      <div className="absolute -right-12 -bottom-12 w-40 h-40 bg-primary-container/20 rounded-full blur-3xl" />
    </Card>
  );
}
