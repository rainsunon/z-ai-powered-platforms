import React from 'react';
import { ToggleRow } from '@/components/ToggleRow';

export function PreferencesTab() {
  return (
    <div className="space-y-8 max-w-3xl">
      {/* Notification Settings */}
      <div className="bg-surface-container-lowest p-8 rounded-[2rem] shadow-sm">
        <h3 className="font-headline font-bold text-xl flex items-center gap-2 mb-6">
          <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>notifications</span>
          Notification Settings
        </h3>
        <div className="space-y-4">
          {[
            { label: 'Email Health Reports', desc: 'Receive weekly health summary via email', defaultOn: true },
            { label: 'SMS Appointment Alerts', desc: 'Get text reminders before appointments', defaultOn: true },
            { label: 'Data Sharing with Providers', desc: 'Allow providers to access your health data', defaultOn: false },
            { label: 'Emergency Contact Access', desc: 'Let emergency contacts view your records', defaultOn: true },
          ].map((setting) => (
            <ToggleRow key={setting.label} label={setting.label} desc={setting.desc} defaultOn={setting.defaultOn} />
          ))}
        </div>
      </div>

      {/* Display Preferences */}
      <div className="bg-surface-container-lowest p-8 rounded-[2rem] shadow-sm">
        <h3 className="font-headline font-bold text-xl flex items-center gap-2 mb-6">
          <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>palette</span>
          Display Preferences
        </h3>
        <div className="space-y-4">
          {[
            { label: 'Compact Mode', desc: 'Reduce spacing for denser information', defaultOn: false },
            { label: 'Show Health Score', desc: 'Display health score on dashboard', defaultOn: true },
          ].map((setting) => (
            <ToggleRow key={setting.label} label={setting.label} desc={setting.desc} defaultOn={setting.defaultOn} />
          ))}
        </div>
      </div>
    </div>
  );
}
