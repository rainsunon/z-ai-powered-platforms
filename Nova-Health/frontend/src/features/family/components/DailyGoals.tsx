import React from 'react';
import { Button } from '@/components/ui/button';
import { DailyGoal } from './wellness-challenge-data';

interface DailyGoalsProps {
  goals: DailyGoal[];
  onToggleGoal: (index: number) => void;
  onReset?: () => void;
}

export function DailyGoals({ goals, onToggleGoal, onReset }: DailyGoalsProps) {
  return (
    <section className="bg-surface-container rounded-[2rem] p-8">
      <div className="flex items-center justify-between mb-8">
        <h3 className="font-headline text-xl font-bold">Quick Daily Goals</h3>
        <Button
          variant="ghost"
          className="text-primary text-sm font-bold flex items-center gap-1"
          onClick={onReset}
        >
          <span>Reset daily</span>
          <span className="material-symbols-outlined text-sm">autorenew</span>
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {goals.map((goal, idx) => (
          <div key={idx} className="bg-surface-container-lowest p-6 rounded-2xl border border-transparent hover:border-primary-container/30 transition-all group">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl ${goal.bg} flex items-center justify-center ${goal.color} group-hover:scale-110 transition-transform`}>
                <span className="material-symbols-outlined text-3xl">{goal.icon}</span>
              </div>
              <button
                onClick={() => onToggleGoal(idx)}
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${goal.checked ? 'bg-primary border-primary text-white' : 'border-outline-variant hover:border-primary'}`}
              >
                {goal.checked && <span className="material-symbols-outlined text-[16px]">check</span>}
              </button>
            </div>
            <h4 className="font-bold text-lg mb-1">{goal.title}</h4>
            <p className="text-sm text-on-surface-variant">{goal.subtitle}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
