import React from 'react';

interface PaymentOptionRowProps {
  icon: string;
  label: string;
  onClick?: () => void;
}

export function PaymentOptionRow({ icon, label, onClick }: PaymentOptionRowProps) {
  return (
    <div
      onClick={onClick}
      className="flex items-center justify-between p-5 rounded-2xl bg-surface-container hover:bg-surface-container-high transition-colors cursor-pointer group"
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-surface-container-highest flex items-center justify-center group-hover:bg-white transition-colors">
          <span className="material-symbols-outlined text-primary">{icon}</span>
        </div>
        <span className="font-semibold">{label}</span>
      </div>
      <span className="material-symbols-outlined text-on-surface/30">chevron_right</span>
    </div>
  );
}
