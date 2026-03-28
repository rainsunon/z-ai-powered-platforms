import React from 'react';

export function Medications() {
  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline font-bold text-3xl text-on-surface">Medications</h1>
          <p className="font-body text-outline mt-1">Track your daily prescriptions and supplements.</p>
        </div>
        <button className="px-6 py-3 rounded-2xl primary-gradient text-on-primary font-headline font-bold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all flex items-center gap-2 self-start sm:self-auto">
          <span className="material-symbols-outlined">add</span>
          Add Medication
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Daily Tracker */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-8 rounded-3xl bg-surface-container-lowest border border-surface-variant/50 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-headline font-bold text-xl text-on-surface">Today's Schedule</h2>
              <div className="flex items-center gap-2 bg-surface-container-low px-3 py-1.5 rounded-full border border-outline-variant/30">
                <span className="material-symbols-outlined text-outline text-[18px]">calendar_today</span>
                <span className="font-body text-sm font-medium text-on-surface-variant">Oct 24</span>
              </div>
            </div>

            {/* Morning */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">light_mode</span>
                </div>
                <h3 className="font-headline font-semibold text-lg text-on-surface">Morning</h3>
                <span className="font-body text-xs text-outline ml-auto">8:00 AM</span>
              </div>
              
              <div className="space-y-3">
                {[
                  { name: 'Lisinopril', dosage: '10mg', type: 'Tablet', taken: true },
                  { name: 'Vitamin D3', dosage: '2000 IU', type: 'Capsule', taken: true }
                ].map((med, idx) => (
                  <div key={idx} className={`p-4 rounded-2xl border transition-all flex items-center gap-4 ${med.taken ? 'bg-surface-container border-transparent opacity-70' : 'bg-surface-container-lowest border-outline-variant/50 hover:border-primary/50'}`}>
                    <button className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${med.taken ? 'bg-primary border-primary text-on-primary' : 'border-outline hover:border-primary'}`}>
                      {med.taken && <span className="material-symbols-outlined text-[16px]">check</span>}
                    </button>
                    <div className="flex-1">
                      <p className={`font-headline font-semibold text-sm ${med.taken ? 'text-on-surface-variant line-through' : 'text-on-surface'}`}>{med.name}</p>
                      <p className="font-body text-xs text-outline">{med.dosage} • {med.type}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Evening */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-surface-container-highest text-on-surface-variant flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">dark_mode</span>
                </div>
                <h3 className="font-headline font-semibold text-lg text-on-surface">Evening</h3>
                <span className="font-body text-xs text-outline ml-auto">8:00 PM</span>
              </div>
              
              <div className="space-y-3">
                {[
                  { name: 'Atorvastatin', dosage: '20mg', type: 'Tablet', taken: false }
                ].map((med, idx) => (
                  <div key={idx} className={`p-4 rounded-2xl border transition-all flex items-center gap-4 ${med.taken ? 'bg-surface-container border-transparent opacity-70' : 'bg-surface-container-lowest border-outline-variant/50 hover:border-primary/50'}`}>
                    <button className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${med.taken ? 'bg-primary border-primary text-on-primary' : 'border-outline hover:border-primary'}`}>
                      {med.taken && <span className="material-symbols-outlined text-[16px]">check</span>}
                    </button>
                    <div className="flex-1">
                      <p className={`font-headline font-semibold text-sm ${med.taken ? 'text-on-surface-variant line-through' : 'text-on-surface'}`}>{med.name}</p>
                      <p className="font-body text-xs text-outline">{med.dosage} • {med.type}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Active Prescriptions */}
        <div className="space-y-6">
          <div className="p-8 rounded-3xl bg-surface-container-lowest border border-surface-variant/50 shadow-sm">
            <h2 className="font-headline font-bold text-xl text-on-surface mb-6">Active Prescriptions</h2>
            
            <div className="space-y-4">
              {[
                { name: 'Lisinopril', dosage: '10mg', refills: 2, nextRefill: 'Nov 15' },
                { name: 'Atorvastatin', dosage: '20mg', refills: 0, nextRefill: 'Action Required' }
              ].map((rx, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-surface-container-low border border-outline-variant/30 group hover:border-primary/30 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-headline font-bold text-on-surface">{rx.name}</p>
                      <p className="font-body text-sm text-outline">{rx.dosage}</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-surface-container-lowest flex items-center justify-center text-primary shadow-sm">
                      <span className="material-symbols-outlined">pill</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-outline-variant/20">
                    <div>
                      <p className="font-body text-xs text-outline mb-0.5">Refills left</p>
                      <p className={`font-headline font-semibold text-sm ${rx.refills === 0 ? 'text-error' : 'text-on-surface'}`}>{rx.refills}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-body text-xs text-outline mb-0.5">Next refill</p>
                      <p className={`font-headline font-semibold text-sm ${rx.refills === 0 ? 'text-error' : 'text-on-surface'}`}>{rx.nextRefill}</p>
                    </div>
                  </div>
                  
                  {rx.refills === 0 && (
                    <button className="w-full mt-4 py-2 rounded-xl bg-error-container text-on-error-container font-headline font-semibold text-sm hover:bg-error/20 transition-colors">
                      Request Refill
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
