import React from 'react';
import { Button } from '@/components/ui/button';

interface SuccessHeroProps {
  onDashboard: () => void;
  onViewMethods: () => void;
}

export function SuccessHero({ onDashboard, onViewMethods }: SuccessHeroProps) {
  return (
    <div className="md:col-span-7 space-y-8">
      <div className="relative inline-block">
        <div className="absolute inset-0 bg-primary-container opacity-20 blur-2xl rounded-full" />
        <div className="relative bg-gradient-to-br from-primary to-primary-container w-24 h-24 rounded-full flex items-center justify-center text-white shadow-xl">
          <span
            className="material-symbols-outlined text-5xl"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            check_circle
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-4xl md:text-5xl font-extrabold text-on-surface leading-tight tracking-tight">
          Bank Account <br />
          Linked Successfully
        </h2>
        <p className="text-lg text-on-surface-variant max-w-md leading-relaxed">
          Your bank account has been securely verified and is now ready for use in your{' '}
          <span className="text-primary font-semibold">Luminous Sanctuary.</span>
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <Button
          size="lg"
          onClick={onDashboard}
          className="px-8 py-4 primary-gradient text-white rounded-full font-bold text-sm shadow-lg hover:shadow-primary-container/20 hover:scale-[1.02] gap-2 h-auto"
        >
          Back to Dashboard
          <span className="material-symbols-outlined text-lg">arrow_forward</span>
        </Button>
        <Button
          variant="secondary"
          size="lg"
          onClick={onViewMethods}
          className="px-8 py-4 bg-surface-container-high text-primary rounded-full font-bold text-sm hover:bg-surface-container-highest h-auto"
        >
          View All Payment Methods
        </Button>
      </div>
    </div>
  );
}
