import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export function HealthScoreCard() {
  const healthMetrics = [
    { label: 'Physical', value: 96, color: 'bg-primary' },
    { label: 'Mental', value: 91, color: 'bg-secondary' },
    { label: 'Nutrition', value: 88, color: 'bg-tertiary' },
  ];

  return (
    <Card className="bg-surface-container-lowest border-0 shadow-sm rounded-[2.5rem]">
      <CardHeader className="pb-6">
        <CardTitle className="font-headline font-bold flex items-center gap-2">
          <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
          Health Score
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          <div className="relative w-32 h-32 mb-4">
            <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
              <circle cx="60" cy="60" r="50" fill="none" stroke="currentColor" className="text-surface-container" strokeWidth="8" />
              <circle cx="60" cy="60" r="50" fill="none" stroke="currentColor" className="text-primary" strokeWidth="8" strokeLinecap="round" strokeDasharray={`${(94 / 100) * 314.16} ${314.16}`} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-extrabold font-headline text-primary">94</span>
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">/100</span>
            </div>
          </div>
          <p className="text-sm text-on-surface-variant text-center">Your overall health score is <span className="text-primary font-bold">Excellent</span></p>
        </div>
        <div className="mt-6 space-y-3">
          {healthMetrics.map((item) => (
            <div key={item.label}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-on-surface-variant">{item.label}</span>
                <span className="font-bold text-on-surface">{item.value}%</span>
              </div>
              <Progress value={item.value} className="h-2">
                <div className={`h-full ${item.color} rounded-full transition-all`} style={{ width: `${item.value}%` }} />
              </Progress>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
