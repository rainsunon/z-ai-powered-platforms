import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const metrics = [
  {
    icon: 'pending_actions',
    label: 'Real-time',
    value: '24',
    description: 'Active Support Tickets',
  },
  {
    icon: 'timer',
    label: 'Average',
    value: '12m 40s',
    description: 'Response Time',
  },
  {
    icon: 'forum',
    label: 'Active Now',
    value: '8',
    description: 'Open User Chats',
  },
];

export function ServiceMetricsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {metrics.map((m) => (
        <Card key={m.icon} className="bg-surface-container-lowest p-8 rounded-[2rem] flex flex-col justify-between h-48 group hover:bg-secondary-container transition-all duration-500 cursor-default border-0">
          <div className="flex justify-between items-start">
            <span className="material-symbols-outlined text-primary group-hover:text-on-secondary-container" style={{ fontSize: 32 }}>{m.icon}</span>
            <span className="text-xs font-bold font-headline uppercase tracking-widest text-on-surface-variant opacity-60">{m.label}</span>
          </div>
          <div>
            <p className="text-4xl font-black font-headline text-on-surface">{m.value}</p>
            <p className="text-sm font-semibold text-on-surface-variant group-hover:text-on-secondary-container/80">{m.description}</p>
          </div>
        </Card>
      ))}
    </div>
  );
}
