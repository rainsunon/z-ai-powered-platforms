import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface PrimaryMethodSummaryProps {
  brand: string;
  last4: string;
  expires: string;
}

export function PrimaryMethodSummary({ brand, last4, expires }: PrimaryMethodSummaryProps) {
  return (
    <Card className="w-full rounded-[2rem] border-outline-variant/10 bg-surface-container-low">
      <CardContent className="p-8 flex items-center gap-6">
        <div className="w-16 h-12 bg-surface-container-highest rounded-lg flex items-center justify-center">
          <span className="material-symbols-outlined text-on-surface-variant">credit_card</span>
        </div>
        <div className="text-left flex-1">
          <p className="text-sm font-label font-bold text-primary tracking-widest uppercase mb-1">
            Primary Method
          </p>
          <p className="text-xl font-headline font-bold text-on-surface">
            {brand} ending in {last4}
          </p>
          <p className="text-on-surface-variant text-sm">Expires {expires}</p>
        </div>
        <div className="hidden sm:block">
          <span
            className="material-symbols-outlined text-primary-container"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            verified
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
