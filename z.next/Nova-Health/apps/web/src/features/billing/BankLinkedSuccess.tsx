import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SuccessHero } from './components/SuccessHero';
import { BankDetailCard } from './components/BankDetailCard';

const SECURITY_BADGES = [
  { icon: 'lock', label: '256-BIT SSL' },
  { icon: 'health_and_safety', label: 'HIPAA COMPLIANT' },
  { icon: 'credit_card', label: 'PCI DSS SECURE' },
] as const;

export function BankLinkedSuccess() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12">
      <div className="max-w-4xl w-full grid md:grid-cols-12 gap-12 items-center">
        <SuccessHero
          onDashboard={() => navigate('/')}
          onViewMethods={() => navigate('/billing/methods')}
        />
        <BankDetailCard />
      </div>

      <footer className="mt-20 w-full max-w-4xl border-t border-outline-variant/10 pt-10">
        <div className="flex flex-wrap justify-center md:justify-between items-center gap-8 opacity-60">
          {SECURITY_BADGES.map(({ icon, label }) => (
            <div key={label} className="flex items-center gap-2">
              <span className="material-symbols-outlined text-xl">{icon}</span>
              <span className="font-manrope font-bold text-xs tracking-widest uppercase">{label}</span>
            </div>
          ))}
        </div>
      </footer>
    </div>
  );
}
