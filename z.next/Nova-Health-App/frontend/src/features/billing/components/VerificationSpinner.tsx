import React from 'react';

interface VerificationSpinnerProps {
  icon: string;
}

export function VerificationSpinner({ icon }: VerificationSpinnerProps) {
  return (
    <div className="relative w-32 h-32 mx-auto mb-10">
      <svg className="w-full h-full transform -rotate-90">
        <circle
          className="text-surface-container"
          cx="64"
          cy="64"
          fill="transparent"
          r="58"
          stroke="currentColor"
          strokeWidth="6"
        />
        <circle
          className="text-primary-container animate-[spin_2s_linear_infinite]"
          cx="64"
          cy="64"
          fill="transparent"
          r="58"
          stroke="currentColor"
          strokeDasharray="364"
          strokeDashoffset="100"
          strokeLinecap="round"
          strokeWidth="6"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="material-symbols-outlined text-primary-container text-4xl">{icon}</span>
      </div>
    </div>
  );
}
