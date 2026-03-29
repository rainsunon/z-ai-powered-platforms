import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

export interface SummaryItem {
  label: string;
  value: string;
  subtitle: string;
  variant?: 'default' | 'accent' | 'highlight';
}

interface ConfirmedSummaryGridProps {
  items: SummaryItem[];
}

const VARIANT_STYLES: Record<string, string> = {
  default: 'bg-surface-container-low hover:bg-surface-container',
  accent: 'bg-secondary-container hover:bg-surface-container-highest',
  highlight: 'bg-surface-container-lowest shadow-sm hover:bg-white',
};

const TEXT_STYLES: Record<string, { value: string; subtitle: string; label: string }> = {
  default: { value: 'text-on-surface', subtitle: 'text-on-surface-variant', label: 'text-on-surface-variant' },
  accent: { value: 'text-on-secondary-container', subtitle: 'text-on-secondary-container/80', label: 'text-on-secondary-container' },
  highlight: { value: 'text-primary', subtitle: 'text-on-surface-variant', label: 'text-primary' },
};

export function ConfirmedSummaryGrid({ items }: ConfirmedSummaryGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {items.map((item) => {
        const v = item.variant ?? 'default';
        const ts = TEXT_STYLES[v];
        return (
          <Card
            key={item.label}
            className={`rounded-3xl border-0 transition-colors duration-300 ${VARIANT_STYLES[v]}`}
          >
            <CardContent className="p-8 flex flex-col justify-between">
              <span
                className={`font-label ${ts.label} font-medium uppercase tracking-widest text-xs mb-4`}
              >
                {item.label}
              </span>
              <div>
                <span className={`text-4xl font-headline font-bold ${ts.value}`}>
                  {item.value}
                </span>
                <p className={`text-sm ${ts.subtitle} mt-2`}>{item.subtitle}</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
