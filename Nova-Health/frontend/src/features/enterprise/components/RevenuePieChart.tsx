import React from 'react';
import { Card, CardContent, CardTitle } from '@/components/ui/card';

interface TierData {
  label: string;
  percentage: string;
  colorClass: string;
}

const tiers: TierData[] = [
  { label: 'Yearly', percentage: '60%', colorClass: 'bg-primary' },
  { label: 'Monthly', percentage: '25%', colorClass: 'bg-secondary-container' },
  { label: 'Daily', percentage: '15%', colorClass: 'bg-primary-container' },
];

export function RevenuePieChart() {
  return (
    <Card className="col-span-12 lg:col-span-5 bg-surface-container-high p-10 rounded-[2.5rem] ring-0 border-0">
      <CardTitle className="font-headline text-2xl font-bold text-on-surface mb-8">Revenue by Subscription Tier</CardTitle>
      <CardContent className="p-0 flex items-center justify-between">
        <div className="relative w-48 h-48">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#dbe6d3" strokeWidth="3" />
            <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#066e00" strokeWidth="3.5" strokeDasharray="60 40" strokeDashoffset="0" />
            <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#9ff888" strokeWidth="3.5" strokeDasharray="25 75" strokeDashoffset="-60" />
            <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#1dcc0d" strokeWidth="3.5" strokeDasharray="15 85" strokeDashoffset="-85" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xs text-on-surface-variant font-bold uppercase">Total</span>
            <span className="text-xl font-bold text-primary">$1.42M</span>
          </div>
        </div>
        <div className="space-y-4 flex-1 ml-10">
          {tiers.map((tier) => (
            <div key={tier.label} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${tier.colorClass}`}></div>
                <span className="text-sm font-semibold">{tier.label}</span>
              </div>
              <span className="text-sm font-bold">{tier.percentage}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
