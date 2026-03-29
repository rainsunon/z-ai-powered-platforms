import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { VerificationSpinner } from './components/VerificationSpinner';
import { VerificationStatus } from './components/VerificationStatus';

const TRUST_BADGES = [
  { icon: 'lock', label: '256-bit SSL' },
  { icon: 'verified_user', label: 'HIPAA Compliant' },
] as const;

export function ACHVerification() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/billing/methods/bank-success');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex-1 flex items-center justify-center p-6 relative">
      <div className="absolute inset-0 bg-surface/40 backdrop-blur-sm z-10" />

      <Card className="relative z-20 w-full max-w-md rounded-[2rem] shadow-[0px_20px_40px_rgba(21,30,18,0.06)] border-outline-variant/15 bg-surface-container-lowest">
        <CardContent className="p-10 text-center">
          <VerificationSpinner icon="account_balance" />

          <h1 className="font-headline text-2xl font-bold text-on-surface mb-4 tracking-tight">
            Verifying Your Account
          </h1>
          <p className="font-body text-on-surface-variant leading-relaxed text-sm mb-10 px-4">
            Our secure system is linking your bank account to your sanctuary. This usually takes
            just a few moments.
          </p>

          <VerificationStatus message="Establishing secure handshake..." />

          <Separator className="bg-outline-variant/15" />
          <div className="flex items-center justify-center gap-6 pt-6">
            {TRUST_BADGES.map(({ icon, label }) => (
              <div key={label} className="flex items-center gap-1.5 grayscale opacity-60">
                <span className="material-symbols-outlined text-sm">{icon}</span>
                <span className="font-label text-[10px] font-bold uppercase tracking-widest text-on-surface">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
