import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { inputClass, labelClass } from './IconField';

export function BillingAddressFields() {
  return (
    <div className="space-y-4">
      <Label className={labelClass}>Billing Address</Label>
      <div className="grid grid-cols-1 gap-4">
        <Input
          type="text"
          className={`${inputClass} px-6`}
          placeholder="Street Address"
          required
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            type="text"
            className={`${inputClass} px-6`}
            placeholder="City"
            required
          />
          <Input
            type="text"
            className={`${inputClass} px-6`}
            placeholder="Postal Code"
            required
          />
        </div>
      </div>
    </div>
  );
}
