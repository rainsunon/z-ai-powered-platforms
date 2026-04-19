import React from 'react';

export function DosageScheduleCard() {
  return (
    <div className="bg-surface-container-lowest p-8 rounded-[2rem] shadow-sm">
      <h3 className="font-headline font-bold text-xl mb-6 flex items-center gap-2">
        <span className="material-symbols-outlined text-primary">schedule</span>
        Dosage Schedule
      </h3>
      <div className="divide-y divide-outline-variant/15">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-secondary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-on-secondary-container">light_mode</span>
            </div>
            <div>
              <p className="font-bold text-on-surface">Morning Dose</p>
              <p className="text-xs text-on-surface-variant mt-1">Take with breakfast • 8:00 AM</p>
            </div>
          </div>
          <div className="text-right">
            <span className="font-headline font-bold text-lg">10mg</span>
            <p className="text-xs text-secondary font-bold mt-1">1 tablet</p>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-surface-container rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <span className="material-symbols-outlined text-primary mt-0.5">info</span>
          <div>
            <p className="font-bold text-sm text-on-surface mb-1">How to take</p>
            <ul className="text-sm text-on-surface-variant space-y-1">
              <li>• Take at the same time each day</li>
              <li>• Swallow whole with a full glass of water</li>
              <li>• Can be taken with or without food</li>
              <li>• Do not crush or chew the tablet</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
