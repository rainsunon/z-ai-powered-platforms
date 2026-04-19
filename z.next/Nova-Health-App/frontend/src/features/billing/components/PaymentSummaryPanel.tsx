import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const LINE_ITEMS = [
  { label: 'General Consultation', amount: '$89.50' },
  { label: 'Specialized Lab Panel', amount: '$750.00' },
  { label: 'Insurance Coverage', amount: '-$145.00', amountClass: 'text-primary' },
] as const;

interface PaymentSummaryPanelProps {
  paymentMethod: 'full' | 'installments';
  onMethodChange: (method: 'full' | 'installments') => void;
  onPay: () => void;
}

export function PaymentSummaryPanel({ paymentMethod, onMethodChange, onPay }: PaymentSummaryPanelProps) {
  return (
    <div className="lg:col-span-5">
      <Card className="sticky top-24 glass-panel rounded-[2.5rem] shadow-[0px_20px_40px_rgba(21,30,18,0.06)] border-white/50">
        <CardContent className="p-8">
          <h3 className="text-xl font-bold font-headline mb-6">Payment Summary</h3>

          {/* Payment Options */}
          <div className="space-y-3 mb-8">
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
              Payment Options
            </p>
            <div className="grid grid-cols-1 gap-3">
              <label
                className={`relative flex items-center p-4 cursor-pointer rounded-2xl transition-all ${
                  paymentMethod === 'full'
                    ? 'border-2 border-primary bg-primary/5'
                    : 'border border-outline-variant/30 bg-surface-container-low hover:bg-surface-container'
                }`}
              >
                <input
                  type="radio"
                  name="payment_method"
                  value="full"
                  className="hidden"
                  checked={paymentMethod === 'full'}
                  onChange={() => onMethodChange('full')}
                />
                <div className="flex-1">
                  <p className="text-sm font-bold text-on-surface">Pay in Full</p>
                  <p className="text-xs text-on-surface-variant">One-time payment of $694.50</p>
                </div>
                {paymentMethod === 'full' ? (
                  <span
                    className="material-symbols-outlined text-primary"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    check_circle
                  </span>
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-outline-variant" />
                )}
              </label>

              <label
                className={`relative flex items-center p-4 cursor-pointer rounded-2xl transition-all ${
                  paymentMethod === 'installments'
                    ? 'border-2 border-primary bg-primary/5'
                    : 'border border-outline-variant/30 bg-surface-container-low hover:bg-surface-container'
                }`}
              >
                <input
                  type="radio"
                  name="payment_method"
                  value="installments"
                  className="hidden"
                  checked={paymentMethod === 'installments'}
                  onChange={() => onMethodChange('installments')}
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm font-bold text-on-surface">Pay by Installments</p>
                    <Badge className="bg-secondary-container text-on-secondary-container text-[9px] font-black px-1.5 py-0.5 rounded-md uppercase">
                      0% APR
                    </Badge>
                  </div>
                  <p className="text-xs text-on-surface-variant">
                    4 interest-free payments of $173.63
                  </p>
                </div>
                {paymentMethod === 'installments' ? (
                  <span
                    className="material-symbols-outlined text-primary"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    check_circle
                  </span>
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-outline-variant" />
                )}
              </label>
            </div>
          </div>

          {/* Line Items */}
          <div className="space-y-4 mb-8">
            {LINE_ITEMS.map(({ label, amount, ...rest }) => (
              <div key={label} className="flex justify-between text-on-surface/70">
                <span>{label}</span>
                <span className={'amountClass' in rest ? (rest as { amountClass: string }).amountClass : ''}>
                  {amount}
                </span>
              </div>
            ))}

            <Separator className="bg-outline-variant/30" />
            <div className="flex justify-between items-end">
              <div>
                <p className="text-sm font-bold uppercase tracking-wider text-on-surface/40">
                  Total Amount
                </p>
                <p className="text-4xl font-extrabold font-headline text-primary">$694.50</p>
              </div>
              <Badge
                variant="outline"
                className="text-[10px] font-bold text-on-surface/40 bg-surface-container rounded uppercase border-0"
              >
                USD
              </Badge>
            </div>
          </div>

          {/* CTA */}
          <Button
            onClick={onPay}
            className="w-full bg-gradient-to-br from-[#066e00] to-[#1dcc0d] text-white py-5 rounded-2xl gap-3 shadow-lg shadow-primary/20 hover:shadow-xl hover:scale-[1.02] active:scale-95 h-auto"
          >
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              lock
            </span>
            <span className="text-lg font-bold">Pay Now ($694.50)</span>
          </Button>
          <p className="mt-6 text-center text-xs text-on-surface/50 leading-relaxed px-4">
            By clicking Pay Now, you authorize NovaHealth to charge your selected payment method.
            Your data is protected by bank-level encryption.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
