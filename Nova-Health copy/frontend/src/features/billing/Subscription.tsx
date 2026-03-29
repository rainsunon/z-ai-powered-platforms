import React from 'react';
import { usePageTitle } from '@/hooks/usePageTitle';
import { PersonalDetailsCard } from './components/PersonalDetailsCard';
import { SecurityCard } from './components/SecurityCard';
import { PremiumPlansSection } from './components/PremiumPlansSection';
import { DangerZone } from './components/DangerZone';

export function Subscription() {
  usePageTitle('Account & Billing');

  return (
    <div className="space-y-12 max-w-6xl mx-auto pb-20">
      {/* Page Header */}
      <header className="space-y-2">
        <h1 className="text-5xl font-extrabold font-headline text-on-surface tracking-tight">
          Account &amp; Billing
        </h1>
        <p className="text-on-surface-variant text-lg max-w-2xl">
          Manage your personal sanctuary settings, security preferences, and premium vitality plans.
        </p>
      </header>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Profile & Security Column */}
        <div className="lg:col-span-4 space-y-8">
          <PersonalDetailsCard />
          <SecurityCard />
        </div>

        {/* Premium Subscription Column */}
        <div className="lg:col-span-8 space-y-8">
          <PremiumPlansSection />
          <DangerZone />
        </div>
      </div>
    </div>
  );
}
