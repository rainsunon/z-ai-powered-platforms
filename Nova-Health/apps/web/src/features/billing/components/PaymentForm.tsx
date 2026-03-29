import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { IconField, inputClass, labelClass } from './IconField';
import { BillingAddressFields } from './BillingAddressFields';
import { PrimaryCheckbox } from './PrimaryCheckbox';

interface PaymentFormProps {
  onSubmit: (e: React.FormEvent) => void;
}

export function PaymentForm({ onSubmit }: PaymentFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <IconField label="Cardholder Name" icon="person" placeholder="e.g. Alexander Mitchell" required />

      <IconField
        label="Card Number"
        icon="credit_card"
        placeholder="0000 0000 0000 0000"
        required
        rightElement={
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuD642hNtgcSimi4W3zl73QtX3KEg25s0x7U9gdbbULT6-t8Fru_o0IEKZT2EMlpsidxnLowVKEYebqx19j5hqsol4dM3zqVS2du057LlhEZlcMmwYuZ0KUxX0WSRxr-CSCQlTr1JHJ0zDZqlTjlYUEueCphtPEha8V08R0qn8ccPYliPqp4IseQNS0b6hU_pEMAl5Fadz3uLR5_bkzJAsH90_1tEt-jGlMyX7QkhwbWBhEna2ndO0Z4Q3pw93zmm8wWdGYEbbm2Yfo"
            alt="Visa"
            className="h-6 grayscale opacity-40"
          />
        }
      />

      {/* Expiry and CVV Row */}
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className={labelClass}>Expiry Date</Label>
          <Input type="text" className={inputClass} placeholder="MM / YY" required />
        </div>
        <div className="space-y-2">
          <Label className={labelClass}>CVV</Label>
          <div className="relative">
            <Input type="password" className={inputClass} placeholder="***" required />
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
              <span className="material-symbols-outlined text-outline text-lg cursor-help">info</span>
            </div>
          </div>
        </div>
      </div>

      <Separator className="bg-outline-variant/20" />

      <BillingAddressFields />

      <PrimaryCheckbox />

      {/* Action Buttons */}
      <div className="pt-6 flex flex-col gap-4">
        <Button
          type="submit"
          size="lg"
          className="w-full py-5 rounded-full primary-gradient text-white font-headline text-lg font-bold shadow-xl shadow-primary/20 hover:scale-[1.01] active:scale-[0.98] h-auto"
        >
          Save Payment Method
        </Button>
        <p className="text-center text-on-surface-variant text-sm flex items-center justify-center gap-2">
          <span className="material-symbols-outlined text-sm">lock</span>
          Your payment information is encrypted and never stored on our servers.
        </p>
      </div>
    </form>
  );
}
