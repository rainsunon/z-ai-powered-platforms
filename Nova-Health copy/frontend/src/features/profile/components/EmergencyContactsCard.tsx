import React from 'react';
import { useProfileStore } from '@/store/useProfileStore';

interface EmergencyContactsCardProps {
  onAddContact: () => void;
}

export function EmergencyContactsCard({ onAddContact }: EmergencyContactsCardProps) {
  const { emergencyContacts, removeEmergencyContact } = useProfileStore();

  return (
    <div className="bg-surface-container-lowest p-8 rounded-[2rem] shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-headline font-bold text-xl flex items-center gap-2">
          <span className="material-symbols-outlined text-error" style={{ fontVariationSettings: "'FILL' 1" }}>emergency</span>
          Emergency Contacts
        </h3>
        <button
          onClick={onAddContact}
          className="text-primary text-sm font-bold hover:underline flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-[16px]">add</span>
          Add New
        </button>
      </div>
      <div className="space-y-4">
        {emergencyContacts.map((contact) => (
          <div key={contact.id} className="flex items-center gap-4 p-5 rounded-2xl bg-surface-container/50 group hover:bg-surface-container transition-colors">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${contact.isPrimary ? 'bg-primary/15' : 'bg-secondary/15'}`}>
              <span className={`material-symbols-outlined ${contact.isPrimary ? 'text-primary' : 'text-secondary'}`} style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-headline font-bold text-on-surface">{contact.name}</p>
                {contact.isPrimary && (
                  <span className="text-[10px] font-black uppercase tracking-tighter bg-primary-container/40 text-primary px-2 py-0.5 rounded-full">Primary</span>
                )}
              </div>
              <p className="text-sm text-on-surface-variant">{contact.relationship} · {contact.phone}</p>
            </div>
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="w-9 h-9 rounded-xl bg-surface-container-high flex items-center justify-center hover:bg-surface-container-highest transition-colors">
                <span className="material-symbols-outlined text-[18px] text-on-surface-variant">edit</span>
              </button>
              <button
                onClick={() => removeEmergencyContact(contact.id)}
                className="w-9 h-9 rounded-xl bg-error/10 flex items-center justify-center hover:bg-error/20 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px] text-error">delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
