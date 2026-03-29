import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const SERVICE_ITEMS = [
  { title: 'Dermatology Consultation', detail: 'Dr. Sarah Mitchell • 45 min session', amount: 200 },
  { title: 'Skin Biopsy — Punch Technique', detail: 'Lab processing included', amount: 350 },
  { title: 'Topical Treatment Application', detail: 'Cryotherapy — 3 areas', amount: 125 },
  { title: 'Follow-up Scheduling Fee', detail: 'Priority booking, 2-week follow-up', amount: 25 },
] as const;

export function ServiceBreakdown() {
  return (
    <Card className="bg-surface-container-lowest rounded-[2rem] shadow-sm border-0">
      <CardContent className="p-8">
        <h3 className="font-headline font-bold text-xl mb-6 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">receipt_long</span>
          Service Breakdown
        </h3>
        <div>
          {SERVICE_ITEMS.map(({ title, detail, amount }, i) => (
            <div key={title}>
              {i > 0 && <Separator className="bg-outline-variant/15" />}
              <div className="flex justify-between items-center py-4">
                <div>
                  <p className="font-bold text-on-surface">{title}</p>
                  <p className="text-xs text-on-surface-variant mt-1">{detail}</p>
                </div>
                <span className="font-headline font-bold text-lg">${amount.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
