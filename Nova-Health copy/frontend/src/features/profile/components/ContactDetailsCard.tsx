import React from 'react';
import { useProfileStore } from '@/store/useProfileStore';

export function ContactDetailsCard() {
  const { profile } = useProfileStore();

  const fields = [
    { label: 'Email Address', value: profile.email, icon: 'mail' },
    { label: 'Phone Number', value: profile.phone, icon: 'phone' },
    { label: 'Address', value: profile.address, icon: 'location_on' },
  ];

  return (
    <div className="bg-surface-container-lowest p-8 rounded-[2rem] shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-headline font-bold text-xl flex items-center gap-2">
          <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>contact_mail</span>
          Contact Details
        </h3>
        <button className="text-primary text-sm font-bold hover:underline flex items-center gap-1">
          <span className="material-symbols-outlined text-[16px]">edit</span>
          Edit
        </button>
      </div>
      <div className="space-y-4">
        {fields.map((field) => (
          <div key={field.label} className="flex items-start gap-4 p-4 rounded-2xl bg-surface-container/50">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-primary text-lg">{field.icon}</span>
            </div>
            <div>
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">{field.label}</p>
              <p className="font-headline font-bold text-on-surface mt-1">{field.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
