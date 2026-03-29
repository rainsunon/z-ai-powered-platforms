import React from 'react';
import { ToggleRow } from '@/components/ToggleRow';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function PreferencesTab() {
  return (
    <div className="space-y-8 max-w-3xl">
      {/* Notification Settings */}
      <Card className="bg-surface-container-lowest border-0 shadow-sm rounded-[2rem]">
        <CardHeader>
          <CardTitle className="font-headline font-bold text-xl flex items-center gap-2">
            <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>notifications</span>
            Notification Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>

      {/* Display Preferences */}
      <Card className="bg-surface-container-lowest border-0 shadow-sm rounded-[2rem]">
        <CardHeader>
          <CardTitle className="font-headline font-bold text-xl flex items-center gap-2">
            <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>palette</span>
            Display Preferences
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { label: 'Compact Mode', desc: 'Reduce spacing for denser information', defaultOn: false },
              { label: 'Show Health Score', desc: 'Display health score on dashboard', defaultOn: true },
            ].map((setting) => (
              <ToggleRow key={setting.label} label={setting.label} desc={setting.desc} defaultOn={setting.defaultOn} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
