import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function SecurityStatusWidget() {
  const items = [
    { label: 'Two-Factor Authentication', status: 'Enabled', icon: 'lock' },
    { label: 'Last Password Change', status: '14 days ago', icon: 'key' },
    { label: 'Active Sessions', status: '2 devices', icon: 'devices' },
  ];

  return (
    <Card className="bg-surface-container-lowest border-0 shadow-sm rounded-[2.5rem]">
      <CardHeader className="pb-6">
        <CardTitle className="font-headline font-bold flex items-center gap-2">
          <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
          Security Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.label} className="flex items-center gap-3 p-3 rounded-xl bg-surface-container/50">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>{item.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-on-surface">{item.label}</p>
                <p className="text-xs text-on-surface-variant">{item.status}</p>
              </div>
              <span className="material-symbols-outlined text-primary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
