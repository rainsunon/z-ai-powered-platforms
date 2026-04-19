import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface InsuranceCardProps {
  coverage: number;
}

export function InsuranceCard({ coverage }: InsuranceCardProps) {
  return (
    <Card className="bg-surface-container rounded-[2rem] p-8 border-0">
      <CardContent className="p-0 flex flex-col justify-between h-full">
        <div>
          <p className="text-sm font-medium text-on-surface-variant uppercase tracking-widest">
            Insurance Applied
          </p>
          <h3 className="text-3xl font-bold mt-1">{coverage}%</h3>
        </div>
        <div className="flex items-center gap-2 text-primary text-sm font-bold">
          <span className="material-symbols-outlined text-[18px]">verified</span>
          <span>Avg. Coverage</span>
        </div>
      </CardContent>
    </Card>
  );
}
