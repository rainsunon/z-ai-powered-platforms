import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const PROVIDER_DETAILS = [
  { label: 'Facility', value: 'Luminous Health Center' },
  { label: 'Date of Service', value: 'Oct 05, 2024' },
  { label: 'Claim Status', value: 'Processed', valueClass: 'text-primary font-bold' },
  { label: 'Authorization #', value: 'AUTH-2024-77291', valueClass: 'font-mono text-xs' },
] as const;

export function ProviderInfoCard() {
  return (
    <Card className="bg-surface-container-lowest rounded-[2.5rem] shadow-sm border-0">
      <CardContent className="p-8">
        <h4 className="font-headline font-bold mb-6 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">person</span>
          Provider Information
        </h4>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl primary-gradient flex items-center justify-center text-white text-lg font-bold">
            SM
          </div>
          <div>
            <p className="font-headline font-bold">Dr. Sarah Mitchell</p>
            <p className="text-xs text-on-surface-variant">Board Certified Dermatologist</p>
          </div>
        </div>
        <div className="space-y-3 text-sm">
          {PROVIDER_DETAILS.map(({ label, value, ...rest }, i) => (
            <div key={label}>
              <div className="flex justify-between py-2">
                <span className="text-on-surface-variant">{label}</span>
                <span className={'valueClass' in rest ? (rest as { valueClass: string }).valueClass : 'font-medium'}>
                  {value}
                </span>
              </div>
              {i < PROVIDER_DETAILS.length - 1 && <Separator className="bg-outline-variant/15" />}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
