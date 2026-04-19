import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const COST_LINES = [
  { label: 'Subtotal', value: '$700.00' },
  { label: 'Insurance Adjustment (Luminous Shield PPO)', value: '-$480.00', valueClass: 'text-primary' },
  { label: 'Co-pay Applied', value: '-$25.00' },
  { label: 'Deductible Remaining', value: '-$45.00' },
] as const;

export function CostSummary() {
  return (
    <Card className="bg-surface-container-low rounded-[2rem] border-0">
      <CardContent className="p-8">
        <h3 className="font-headline font-bold text-xl mb-6">Cost Summary</h3>
        <div className="space-y-3">
          {COST_LINES.map(({ label, value, ...rest }) => (
            <div key={label} className="flex justify-between text-sm">
              <span className="text-on-surface-variant">{label}</span>
              <span className={`font-bold ${'valueClass' in rest ? (rest as { valueClass: string }).valueClass : ''}`}>
                {value}
              </span>
            </div>
          ))}
          <Separator className="bg-outline-variant/20 mt-4" />
          <div className="pt-4 flex justify-between items-center">
            <span className="font-headline font-bold text-lg">Patient Responsibility</span>
            <span className="font-headline font-extrabold text-2xl text-primary">$150.00</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
