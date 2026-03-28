import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { StepperBar } from './components/StepperBar';
import { SavedCardItem } from './components/SavedCardItem';
import { PaymentOptionRow } from './components/PaymentOptionRow';
import { PaymentSummaryPanel } from './components/PaymentSummaryPanel';

const VISA_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBy7bsGXeSzHcRS5_pkAO94xnaf2HKZnFzcv4LxyAaq3sxjaoC35hTesJstN5SajvbJk2v8doQChig2j4soyBT1nwah7P6JJoM6XDDdS4oyQ7gy3M8l3IlJkdqy9iMptzSy9lSWHgBKRGvFuavqsaheu58PosrDAvSDAKKvO3k7_7AK5FGIIbsdnKWtUYcSJv9caNEdhW0wPijJPPHL0O4Dtkl09XT_scQ6lIAdo_rP3X2IYyF8C5t2eJTYSa_KqELKH1HKWJA5uBI';

export function BulkPaymentMethod() {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState<'full' | 'installments'>('full');

  const handlePay = () => {
    navigate(paymentMethod === 'full' ? '/billing/bulk-pay/success' : '/billing/bulk-pay/schedule');
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto">
      <StepperBar step={2} totalSteps={3} label="Payment" />

      <div className="px-6 md:px-12 py-8 flex-1">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Payment Methods Selection */}
          <div className="lg:col-span-7 space-y-6">
            <section>
              <h3 className="text-lg font-bold font-headline mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">credit_card</span>
                Saved Cards
              </h3>
              <SavedCardItem
                brand="Visa"
                last4="4242"
                expires="08/26"
                imageUrl={VISA_IMAGE}
                selected
              />
            </section>

            <section className="space-y-4">
              <h3 className="text-lg font-bold font-headline mb-4">Other Options</h3>
              <PaymentOptionRow icon="add_card" label="Add new credit or debit card" />
              <PaymentOptionRow icon="account_balance" label="Link a bank account (ACH)" />
            </section>

            {/* Trust Device */}
            <Card className="rounded-3xl bg-secondary-container/20 border-0">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="mt-1">
                  <input
                    type="checkbox"
                    id="trust-device"
                    className="w-5 h-5 rounded border-outline text-primary focus:ring-primary-container transition-all"
                  />
                </div>
                <Label htmlFor="trust-device" className="cursor-pointer space-y-0.5">
                  <span className="block font-bold text-on-surface">Trust this device</span>
                  <span className="block text-sm text-on-surface/60 font-normal">
                    Skip the 2-step verification code for future payments on this browser.
                  </span>
                </Label>
              </CardContent>
            </Card>
          </div>

          <PaymentSummaryPanel
            paymentMethod={paymentMethod}
            onMethodChange={setPaymentMethod}
            onPay={handlePay}
          />
        </div>
      </div>
    </div>
  );
}
