import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface PaymentOptionsCardProps {
  onPayNow: () => void;
  onSetupPlan: () => void;
}

export function PaymentOptionsCard({ onPayNow, onSetupPlan }: PaymentOptionsCardProps) {
  return (
    <Card className="bg-surface-container-low rounded-[2.5rem] border-0">
      <CardContent className="p-8">
        <h4 className="font-headline font-bold mb-6">Payment Options</h4>
        <div className="space-y-3">
          <Button
            onClick={onPayNow}
            className="w-full primary-gradient text-white rounded-[1.5rem] py-4 font-headline font-extrabold shadow-xl shadow-primary/30 gap-3 h-auto"
          >
            <span className="material-symbols-outlined">credit_card</span>
            Pay $150.00 Now
          </Button>
          <Button
            variant="secondary"
            onClick={onSetupPlan}
            className="w-full bg-surface-container-highest text-on-surface rounded-[1.5rem] py-4 font-headline font-extrabold gap-3 hover:bg-surface-dim h-auto"
          >
            <span className="material-symbols-outlined">calendar_month</span>
            Set Up Payment Plan
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
