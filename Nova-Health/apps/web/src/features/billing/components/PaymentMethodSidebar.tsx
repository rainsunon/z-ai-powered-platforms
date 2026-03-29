import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface PaymentMethodSidebarProps {
  onChangeMethod: () => void;
  onConfirm: () => void;
  onGoBack: () => void;
  firstPaymentAmount: string;
}

export function PaymentMethodSidebar({
  onChangeMethod,
  onConfirm,
  onGoBack,
  firstPaymentAmount,
}: PaymentMethodSidebarProps) {
  return (
    <aside className="lg:col-span-4 space-y-6">
      {/* Payment Method Card */}
      <Card className="rounded-[2rem] border-outline-variant/10 shadow-sm">
        <CardContent className="p-8">
          <h3 className="text-lg font-bold text-on-surface mb-6">Payment Method</h3>
          <div className="flex items-center gap-4 p-4 bg-surface-container-lowest rounded-2xl">
            <div className="w-12 h-8 bg-on-background rounded flex items-center justify-center text-[10px] text-white font-bold italic tracking-tighter">
              VISA
            </div>
            <div className="flex-1">
              <p className="font-bold text-on-surface">Visa ending in 4242</p>
              <p className="text-xs text-on-surface-variant">Expires 12/26</p>
            </div>
            <span className="material-symbols-outlined text-primary">check_circle</span>
          </div>
          <Button
            variant="link"
            onClick={onChangeMethod}
            className="w-full mt-4 text-sm font-semibold text-primary p-0 h-auto"
          >
            Change Method
          </Button>

          <div className="mt-8 p-4 bg-surface-variant/30 rounded-2xl border border-primary-container/20">
            <div className="flex gap-3">
              <span className="material-symbols-outlined text-primary shrink-0">info</span>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                You'll be charged{' '}
                <span className="font-bold text-on-surface">{firstPaymentAmount}</span> immediately
                upon confirmation. Subsequent payments will be automated monthly.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main CTA Actions */}
      <div className="flex flex-col gap-4">
        <Button
          onClick={onConfirm}
          className="w-full py-5 h-auto px-8 rounded-full bg-gradient-to-br from-primary to-primary-container text-white font-headline font-bold text-lg shadow-[0px_10px_20px_rgba(6,110,0,0.2)] hover:scale-[1.02] active:scale-95 transition-all"
        >
          Confirm &amp; Set Up Plan
        </Button>
        <Button
          variant="outline"
          onClick={onGoBack}
          className="w-full py-4 h-auto px-8 rounded-full font-semibold"
        >
          Go Back
        </Button>
      </div>

      {/* Secure Shield Info */}
      <div className="flex items-center justify-center gap-2 text-on-surface-variant text-xs font-medium uppercase tracking-widest">
        <span className="material-symbols-outlined text-base">verified_user</span>
        256-bit Secure Encryption
      </div>
    </aside>
  );
}
