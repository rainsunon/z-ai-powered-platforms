import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface PaymentMethodBannerProps {
  brand: string;
  lastFour: string;
  logoSrc: string;
  onDashboard: () => void;
}

export function PaymentMethodBanner({
  brand,
  lastFour,
  logoSrc,
  onDashboard,
}: PaymentMethodBannerProps) {
  return (
    <Card className="rounded-[2rem] border-0 shadow-sm bg-gradient-to-r from-primary-container/20 to-secondary-container/20">
      <CardContent className="flex flex-col sm:flex-row items-center justify-between gap-6 p-8">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-surface-container-lowest flex items-center justify-center shadow-sm">
            <img src={logoSrc} alt={brand} className="w-10 h-6 object-contain" />
          </div>
          <div>
            <p className="text-sm text-on-surface-variant font-label">
              Payment Method
            </p>
            <p className="font-headline text-lg font-bold text-on-surface">
              {brand} ending in {lastFour}
            </p>
          </div>
        </div>

        <Button
          size="lg"
          className="rounded-full px-8 py-3 font-label font-bold tracking-wide bg-primary text-on-primary hover:bg-primary/90 shadow-md"
          onClick={onDashboard}
        >
          View My Dashboard
          <span className="material-symbols-outlined text-xl ml-2">
            arrow_forward
          </span>
        </Button>
      </CardContent>
    </Card>
  );
}
