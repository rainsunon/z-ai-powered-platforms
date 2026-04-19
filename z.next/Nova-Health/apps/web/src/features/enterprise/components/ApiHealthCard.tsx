import React from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const endpoints = [
  { name: 'FHIR Endpoint', status: 'Live', value: 94 },
  { name: 'Auth Service', status: 'Live', value: 98 },
];

export function ApiHealthCard() {
  return (
    <Card className="bg-gradient-to-br from-inverse-surface to-[#2a3326] rounded-[2.5rem] p-8 text-white relative overflow-hidden border-0">
      <div className="relative z-10">
        <h4 className="text-lg font-bold font-headline mb-4">API Health Sync</h4>
        <div className="space-y-3">
          {endpoints.map((ep) => (
            <React.Fragment key={ep.name}>
              <div className="flex items-center justify-between text-xs">
                <span className="opacity-60">{ep.name}</span>
                <span className="text-secondary-fixed">{ep.status}</span>
              </div>
              <div className="w-full bg-white/10 h-1.5 rounded-full">
                <div
                  className="bg-secondary-fixed h-full rounded-full shadow-[0_0_8px_rgba(159,248,136,0.6)]"
                  style={{ width: `${ep.value}%` }}
                ></div>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl"></div>
    </Card>
  );
}
