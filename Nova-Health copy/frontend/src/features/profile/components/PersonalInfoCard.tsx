import React from 'react';
import { useProfileStore } from '@/store/useProfileStore';
import { InfoCard } from '@/components/InfoCard';

export function PersonalInfoCard() {
  const { profile } = useProfileStore();

  const fields = [
    { label: 'Full Name', value: profile.fullName, icon: 'person' },
    { label: 'Date of Birth', value: profile.dateOfBirth, icon: 'cake' },
    { label: 'Gender', value: profile.gender, icon: 'wc' },
    { label: 'Blood Type', value: profile.bloodType, icon: 'bloodtype' },
  ];

  return (
    <InfoCard icon="badge" iconStyle="filled" title="Personal Information">
      <div className="flex items-center justify-between mb-6 -mt-6">
        <div />
        <button className="text-primary text-sm font-bold hover:underline flex items-center gap-1">
          <span className="material-symbols-outlined text-[16px]">edit</span>
          Edit
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {fields.map((field) => (
          <div key={field.label} className="p-4 rounded-2xl bg-surface-container/50">
            <div className="flex items-center gap-2 mb-1">
              <span className="material-symbols-outlined text-primary text-[16px]">{field.icon}</span>
              <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">{field.label}</span>
            </div>
            <p className="font-headline font-bold text-on-surface text-lg mt-1">{field.value}</p>
          </div>
        ))}
      </div>
    </InfoCard>
  );
}
