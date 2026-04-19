import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SymptomFrequencyItem } from './SymptomFrequencyItem';

export interface SymptomEntry {
  name: string;
  episodes: number;
  percentage: number;
}

interface SymptomFrequencyPanelProps {
  items: SymptomEntry[];
}

export function SymptomFrequencyPanel({ items }: SymptomFrequencyPanelProps) {
  return (
    <Card className="col-span-12 lg:col-span-5 rounded-3xl border-0 bg-surface-container-high">
      <CardHeader className="p-10 pb-0">
        <CardTitle className="text-2xl font-bold font-headline text-emerald-900">
          Symptom Frequency
        </CardTitle>
      </CardHeader>
      <CardContent className="p-10 pt-6">
        <div className="space-y-6">
          {items.map((item) => (
            <SymptomFrequencyItem key={item.name} {...item} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
