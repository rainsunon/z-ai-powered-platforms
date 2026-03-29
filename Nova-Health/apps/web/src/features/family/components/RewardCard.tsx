import React from 'react';

interface RewardCardProps {
  title?: string;
  subtitle?: string;
  badgeText?: string;
  pointsSpent?: string;
  balanceRemaining?: string;
  icon?: string;
}

export function RewardCard({
  title = 'Signature Spa Retreat',
  subtitle = 'Valid for 6 months • Premium Access',
  badgeText = 'REDEEMED',
  pointsSpent = '4,500',
  balanceRemaining = '7,950',
  icon = 'spa'
}: RewardCardProps) {
  return (
    <div className="relative group">
      <div className="absolute -inset-4 bg-primary-container/20 blur-3xl rounded-full opacity-50"></div>
      <div className="relative overflow-hidden bg-surface-container-lowest rounded-[2.5rem] shadow-xl">
        {/* Image Section */}
        <div className="aspect-[4/3] w-full relative bg-surface-container flex items-center justify-center">
          <span className="material-symbols-outlined text-[120px] text-primary/15">{icon}</span>
          {/* Redeemed Badge Overlay */}
          <div className="absolute top-6 right-6">
            <div className="bg-primary px-6 py-2 rounded-full shadow-lg transform rotate-3">
              <span className="text-on-primary font-headline font-black text-sm tracking-widest">
                {badgeText}
              </span>
            </div>
          </div>
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
          <div className="absolute bottom-6 left-8">
            <h3 className="text-white font-headline text-2xl font-bold">{title}</h3>
            <p className="text-white/80 text-sm">{subtitle}</p>
          </div>
        </div>
        {/* Tonal Stats Section */}
        <div className="bg-surface-container-low p-8 grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-[11px] font-headline font-semibold uppercase tracking-widest text-on-surface-variant/70">
              Points Spent
            </p>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-tertiary">token</span>
              <span className="text-xl font-headline font-extrabold text-on-surface">{pointsSpent}</span>
            </div>
          </div>
          <div className="space-y-1 border-l border-outline-variant/30 pl-6">
            <p className="text-[11px] font-headline font-semibold uppercase tracking-widest text-on-surface-variant/70">
              Balance Remaining
            </p>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">account_balance_wallet</span>
              <span className="text-xl font-headline font-extrabold text-on-surface">{balanceRemaining}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
