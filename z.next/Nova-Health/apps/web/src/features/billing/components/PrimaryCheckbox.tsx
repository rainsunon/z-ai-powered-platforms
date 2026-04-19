import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

export function PrimaryCheckbox() {
  return (
    <Card className="rounded-3xl border-outline-variant/10 bg-surface-container-low">
      <CardContent className="p-6 flex items-center gap-4">
        <input
          type="checkbox"
          id="primary-method"
          className="w-6 h-6 rounded-lg border-outline-variant text-primary focus:ring-primary/20"
        />
        <Label htmlFor="primary-method" className="flex-1 cursor-pointer space-y-0.5">
          <span className="block font-bold text-on-surface">Set as Primary</span>
          <span className="block text-sm text-on-surface-variant font-normal">
            Use this card for all future recurring billing and appointments.
          </span>
        </Label>
      </CardContent>
    </Card>
  );
}
