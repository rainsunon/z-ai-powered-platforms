import React from 'react';
import { Progress, ProgressTrack, ProgressIndicator } from '@/components/ui/progress';

interface SymptomFrequencyItemProps {
  name: string;
  episodes: number;
  percentage: number;
}

export function SymptomFrequencyItem({ name, episodes, percentage }: SymptomFrequencyItemProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm font-bold">
        <span className="text-stone-600">{name}</span>
        <span className="text-emerald-800">{episodes} {episodes === 1 ? 'episode' : 'episodes'}</span>
      </div>
      <Progress value={percentage}>
        <ProgressTrack className="h-3 bg-stone-200/50 rounded-full">
          <ProgressIndicator className="bg-emerald-500 rounded-full" />
        </ProgressTrack>
      </Progress>
    </div>
  );
}
