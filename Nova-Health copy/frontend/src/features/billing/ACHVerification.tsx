import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function ACHVerification() {
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate verification delay
    const timer = setTimeout(() => {
      navigate('/billing/methods/bank-success');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex-1 flex items-center justify-center p-6 relative">
      {/* Modal/Loader Overlay Backdrop */}
      <div className="absolute inset-0 bg-surface/40 backdrop-blur-sm z-10"></div>

      {/* Verification Card */}
      <div className="relative z-20 w-full max-w-md bg-surface-container-lowest rounded-[2rem] p-10 text-center shadow-[0px_20px_40px_rgba(21,30,18,0.06)] border border-outline-variant/15">
        {/* Circular Progress Ring Container */}
        <div className="relative w-32 h-32 mx-auto mb-10">
          {/* Stationary background circle */}
          <svg className="w-full h-full transform -rotate-90">
            <circle className="text-surface-container" cx="64" cy="64" fill="transparent" r="58" stroke="currentColor" strokeWidth="6"></circle>
            {/* Animated progress circle */}
            <circle className="text-primary-container animate-[spin_2s_linear_infinite]" cx="64" cy="64" fill="transparent" r="58" stroke="currentColor" strokeDasharray="364" strokeDashoffset="100" strokeLinecap="round" strokeWidth="6"></circle>
          </svg>
          
          {/* Central Icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary-container text-4xl">account_balance</span>
          </div>
        </div>

        {/* Textual Content */}
        <h1 className="font-headline text-2xl font-bold text-on-surface mb-4 tracking-tight">Verifying Your Account</h1>
        <p className="font-body text-on-surface-variant leading-relaxed text-sm mb-10 px-4">
          Our secure system is linking your bank account to your sanctuary. This usually takes just a few moments.
        </p>

        {/* Status Elements (Bento-style chips) */}
        <div className="flex flex-col gap-3 mb-10">
          <div className="flex items-center gap-3 p-4 bg-surface-container-low rounded-2xl">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">Establishing secure handshake...</span>
          </div>
        </div>

        {/* Footer Trust Badges */}
        <div className="flex items-center justify-center gap-6 pt-6 border-t border-outline-variant/15">
          <div className="flex items-center gap-1.5 grayscale opacity-60">
            <span className="material-symbols-outlined text-sm">lock</span>
            <span className="font-label text-[10px] font-bold uppercase tracking-widest text-on-surface">256-bit SSL</span>
          </div>
          <div className="flex items-center gap-1.5 grayscale opacity-60">
            <span className="material-symbols-outlined text-sm">verified_user</span>
            <span className="font-label text-[10px] font-bold uppercase tracking-widest text-on-surface">HIPAA Compliant</span>
          </div>
        </div>
      </div>
    </div>
  );
}
