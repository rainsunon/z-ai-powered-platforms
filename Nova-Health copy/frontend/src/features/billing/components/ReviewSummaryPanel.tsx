import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface SummaryLineItem {
  label: string;
  value: string;
  highlight?: boolean;
  icon?: string;
}

interface ReviewSummaryPanelProps {
  items: SummaryLineItem[];
  total: string;
  savingsLabel?: string;
  onContinue: () => void;
}

export function ReviewSummaryPanel({
  items,
  total,
  savingsLabel,
  onContinue,
}: ReviewSummaryPanelProps) {
  return (
    <div className="lg:col-span-5">
      <div className="sticky top-24 space-y-6">
        <Card className="rounded-[2.5rem] shadow-[0px_20px_60px_rgba(21,30,18,0.08)] border-outline-variant/10">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-on-surface mb-8">Payment Summary</h2>

            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.label} className="flex justify-between items-center">
                  <span
                    className={`font-medium ${item.highlight ? 'text-primary' : 'text-on-surface-variant'}`}
                  >
                    {item.label}
                    {item.icon && (
                      <span className="material-symbols-outlined text-sm text-primary ml-1 align-middle">
                        {item.icon}
                      </span>
                    )}
                  </span>
                  <span
                    className={`font-bold ${item.highlight ? 'text-primary' : 'text-on-surface'}`}
                  >
                    {item.value}
                  </span>
                </div>
              ))}

              <Separator />

              <div className="flex justify-between items-end pt-2">
                <div>
                  <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">
                    Total Due
                  </p>
                  <h3 className="text-4xl font-black text-on-surface tracking-tighter">{total}</h3>
                </div>
                {savingsLabel && (
                  <Badge
                    variant="secondary"
                    className="bg-secondary-container/50 text-on-secondary-container text-[10px] font-bold uppercase px-3 py-1.5 rounded-xl"
                  >
                    {savingsLabel}
                  </Badge>
                )}
              </div>

              <div className="pt-8">
                <Button
                  onClick={onContinue}
                  className="w-full py-5 h-auto bg-gradient-to-br from-primary to-primary-container text-white rounded-2xl font-bold shadow-xl shadow-primary/25 text-lg hover:scale-[1.02] active:scale-95 transition-all mb-4"
                >
                  Confirm &amp; Continue to Payment
                </Button>
                <p className="text-center text-[11px] text-on-surface-variant font-medium px-4">
                  By clicking "Confirm &amp; Continue", you agree to the NovaHealth Terms of
                  Service regarding automatic payment processing.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SSL Info */}
        <Card className="rounded-[1.5rem] bg-surface-container-low border-0">
          <CardContent className="px-6 py-4 flex items-center gap-4">
            <span className="material-symbols-outlined text-on-surface-variant">lock</span>
            <p className="text-xs font-semibold text-on-surface-variant">
              Secure SSL Encrypted Payment Environment
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
