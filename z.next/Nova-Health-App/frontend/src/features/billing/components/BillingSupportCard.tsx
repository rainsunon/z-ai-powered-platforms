import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

export function BillingSupportCard() {
  return (
    <Card className="bg-primary/5 rounded-[2rem] border-primary/10">
      <CardContent className="p-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-primary text-white rounded-full">
            <span className="material-symbols-outlined">help_center</span>
          </div>
          <h5 className="font-bold">Billing Support</h5>
        </div>
        <p className="text-sm text-on-surface-variant mb-6">
          Have questions about a recent charge or your insurance coverage?
        </p>
        <a
          className="inline-flex items-center gap-2 text-primary font-bold text-sm"
          href="#"
        >
          Chat with a specialist{' '}
          <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </a>
      </CardContent>
    </Card>
  );
}
