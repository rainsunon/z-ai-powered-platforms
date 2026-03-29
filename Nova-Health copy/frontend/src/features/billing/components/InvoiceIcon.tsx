import React from 'react';

interface InvoiceIconProps {
  icon: string;
  className?: string;
}

export function InvoiceIcon({ icon, className }: InvoiceIconProps) {
  return (
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${className ?? ''}`}>
      <span className="material-symbols-outlined">{icon}</span>
    </div>
  );
}
