import React from 'react';
import { Progress } from '@/components/ui/progress';

interface StepperBarProps {
  step: number;
  totalSteps: number;
  label: string;
}

export function StepperBar({ step, totalSteps, label }: StepperBarProps) {
  const percent = Math.round((step / totalSteps) * 100);

  return (
    <div className="px-6 md:px-12 py-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-primary uppercase tracking-widest">
            Step {step} of {totalSteps}: {label}
          </span>
          <span className="text-xs font-medium text-on-surface-variant">{percent}% Complete</span>
        </div>
        <Progress value={percent} className="h-2" />
      </div>
    </div>
  );
}
