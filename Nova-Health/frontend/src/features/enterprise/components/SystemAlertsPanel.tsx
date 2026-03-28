import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export function SystemAlertsPanel() {
  return (
    <Card className="bg-surface-container-highest rounded-[2.5rem] p-8 border-0">
      <h3 className="text-xl font-extrabold font-headline text-on-surface mb-6 flex items-center gap-2">
        <span className="material-symbols-outlined text-primary">warning</span>
        <span>System Alerts</span>
      </h3>
      <div className="space-y-4">
        <div className="bg-surface-container-lowest p-5 rounded-3xl border-l-4 border-primary">
          <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">Upcoming Maintenance</p>
          <p className="text-sm font-semibold text-on-surface">Database clustering optimization scheduled for 02:00 UTC.</p>
          <div className="mt-4 flex justify-between items-center">
            <span className="text-[10px] text-on-surface-variant">Ref: MH-4429</span>
            <Button variant="link" className="text-xs font-bold text-primary p-0 h-auto">Dismiss</Button>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-5 rounded-3xl border-l-4 border-error">
          <p className="text-xs font-bold text-error uppercase tracking-widest mb-1">Critical Storage</p>
          <p className="text-sm font-semibold text-on-surface">Cluster B-12 storage reaching 92% capacity threshold.</p>
          <div className="mt-4 flex justify-between items-center">
            <span className="text-[10px] text-on-surface-variant">Impact: Data Logging</span>
            <Button className="px-3 py-1 bg-error text-white rounded-full text-xs font-bold h-auto">Investigate</Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
