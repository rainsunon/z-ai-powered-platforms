import React from 'react';
import { MemberData } from './health-summary-data';

interface HealthStatusIndicatorsProps {
  member: MemberData;
}

export function HealthStatusIndicators({ member }: HealthStatusIndicatorsProps) {
  const statusIndicators = [
    {
      label: 'Blood Oxygen',
      value: `${member.bloodOxygen}%`,
      icon: 'spo2',
      status: 'Normal',
      statusColor: 'text-primary bg-primary/10'
    },
    {
      label: 'Blood Pressure',
      value: member.bp,
      icon: 'blood_pressure',
      status: 'Normal',
      statusColor: 'text-primary bg-primary/10'
    },
    {
      label: 'Temperature',
      value: `${member.temp}°F`,
      icon: 'thermostat',
      status: 'Normal',
      statusColor: 'text-primary bg-primary/10'
    },
    {
      label: 'Respiratory',
      value: `${member.respiratory} rpm`,
      icon: 'pulmonology',
      status: 'Normal',
      statusColor: 'text-primary bg-primary/10'
    },
  ];

  return (
    <div className="bg-surface-container-lowest p-8 rounded-[2rem] shadow-sm">
      <h3 className="font-headline font-bold text-xl text-on-surface mb-6 flex items-center gap-2">
        <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
          vital_signs
        </span>
        Health Status Indicators
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statusIndicators.map(({ label, value, icon, status, statusColor }) => (
          <div key={label} className="bg-surface-container rounded-2xl p-5 text-center">
            <span className="material-symbols-outlined text-primary text-2xl mb-3 block" style={{ fontVariationSettings: "'FILL' 1" }}>
              {icon}
            </span>
            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{label}</p>
            <p className="text-2xl font-extrabold font-headline text-on-surface mt-1">{value}</p>
            <span className={`inline-block mt-2 px-3 py-1 rounded-full text-[10px] font-bold ${statusColor}`}>
              {status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
