import React from 'react';

const prescriptions = [
  { time: '08:00 AM', name: 'Vitamin D3 Supplement', dose: '1 Capsule', status: 'Taken', active: true },
  { time: '12:30 PM', name: 'Omega-3 Fish Oil', dose: '2 Softgels', status: 'Upcoming', active: false },
  { time: '20:00 PM', name: 'Magnesium Glycinate', dose: '400mg', status: 'Upcoming', active: false },
];

export function PrescriptionsCard() {
  return (
    <div className="bg-surface-container-lowest p-8 rounded-[2rem] shadow-[0px_20px_40px_rgba(21,30,18,0.06)]">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-headline font-bold text-xl">Prescriptions</h3>
        <span className="material-symbols-outlined text-primary">medication</span>
      </div>
      <div className="space-y-6">
        {prescriptions.map((rx) => (
          <div key={rx.name} className="relative pl-8">
            <div className="absolute left-0 top-0 h-full w-0.5 bg-surface-variant"></div>
            <div
              className={`absolute left-[-4px] top-1 w-2.5 h-2.5 rounded-full ring-4 ring-white ${
                rx.active ? 'bg-primary' : 'bg-outline-variant'
              }`}
            ></div>
            <p
              className={`text-xs font-bold uppercase ${
                rx.active ? 'text-primary' : 'text-outline'
              }`}
            >
              {rx.time}
            </p>
            <p className="font-bold text-sm">{rx.name}</p>
            <p className="text-xs text-outline">
              {rx.dose} • {rx.status}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
