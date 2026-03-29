import React from 'react';

const signals = [
  { icon: 'lock', label: '256-BIT SSL' },
  { icon: 'encrypted', label: 'HIPAA COMPLIANT' },
  { icon: 'security', label: 'PCI DSS' },
];

export function TrustSignals() {
  return (
    <div className="mt-12 flex justify-center items-center gap-8 opacity-40 grayscale">
      {signals.map(({ icon, label }) => (
        <div key={label} className="flex items-center gap-1">
          <span className="material-symbols-outlined text-sm">{icon}</span>
          <span className="text-[10px] font-bold tracking-widest uppercase">{label}</span>
        </div>
      ))}
    </div>
  );
}
