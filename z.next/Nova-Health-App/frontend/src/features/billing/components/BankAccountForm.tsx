import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const inputClass =
  'w-full px-6 py-4 rounded-xl border-0 bg-surface-container-lowest focus:ring-2 focus:ring-primary-container text-on-surface font-body placeholder:text-outline/50 shadow-sm h-auto';

interface BankAccountFormProps {
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export function BankAccountForm({ onSubmit, onCancel }: BankAccountFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Account Holder */}
      <div className="space-y-2">
        <Label htmlFor="holder_name" className="font-headline text-sm font-bold text-on-surface-variant px-2">
          Account Holder Name
        </Label>
        <Input
          type="text"
          id="holder_name"
          className={inputClass}
          placeholder="Full Legal Name"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Routing Number */}
        <div className="space-y-2">
          <Label htmlFor="routing_number" className="font-headline text-sm font-bold text-on-surface-variant px-2">
            Routing Number
          </Label>
          <Input
            type="text"
            id="routing_number"
            className={inputClass}
            placeholder="9-digit code"
            required
          />
        </div>

        {/* Account Number */}
        <div className="space-y-2">
          <Label htmlFor="account_number" className="font-headline text-sm font-bold text-on-surface-variant px-2">
            Account Number
          </Label>
          <Input
            type="text"
            id="account_number"
            className={inputClass}
            placeholder="Up to 17 digits"
            required
          />
        </div>
      </div>

      {/* Verification Microcopy */}
      <Card className="rounded-2xl border-outline-variant/10 bg-surface-container-high">
        <CardContent className="p-6 flex gap-4">
          <span
            className="material-symbols-outlined text-primary"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            verified_user
          </span>
          <div className="space-y-1">
            <p className="font-headline text-sm font-bold text-primary">Verify account</p>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              To protect your sanctuary, we use instant verification. By continuing, you agree to
              securely link your institution. Alternatively, we can send two micro-deposits (under
              $0.99) to your account within 1-2 business days to verify ownership.
            </p>
          </div>
        </CardContent>
      </Card>

      <Separator className="bg-transparent" />

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          className="flex-1 px-8 py-4 bg-surface-container-highest text-primary font-headline font-bold rounded-full hover:bg-surface-dim h-auto order-2 sm:order-1"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="flex-[2] px-8 py-4 primary-gradient text-white font-headline font-bold rounded-full shadow-lg hover:shadow-xl active:scale-95 h-auto order-1 sm:order-2"
        >
          Link Account Securely
        </Button>
      </div>
    </form>
  );
}
