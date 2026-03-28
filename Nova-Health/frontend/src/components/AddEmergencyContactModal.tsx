import React, { useState } from 'react';
import { Input } from '@/components/ui/input';

interface AddEmergencyContactModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; relationship: string; phone: string }) => void;
}

const relationships = ['Spouse', 'Parent', 'Sibling', 'Guardian', 'Friend', 'Physician'];

export function AddEmergencyContactModal({ open, onClose, onSubmit }: AddEmergencyContactModalProps) {
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [phone, setPhone] = useState('');

  if (!open) return null;

  const handleSubmit = () => {
    if (!name.trim() || !relationship || !phone.trim()) return;
    onSubmit({ name: name.trim(), relationship, phone: phone.trim() });
    setName('');
    setRelationship('');
    setPhone('');
  };

  const isValid = name.trim() && relationship && phone.trim();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative w-full max-w-md bg-surface-container-lowest rounded-[2rem] shadow-2xl border border-surface-variant/50 overflow-hidden">
        {/* Header */}
        <div className="px-8 py-6 border-b border-surface-variant/50 flex items-center justify-between bg-surface-container-low/50">
          <div>
            <h2 className="font-headline font-bold text-2xl text-on-surface">Add Emergency Contact</h2>
            <p className="font-body text-sm text-outline mt-1">Add a new emergency contact to your profile</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full flex items-center justify-center text-outline hover:bg-surface-container hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-8 space-y-6">
          {/* Full Name */}
          <div>
            <label className="font-headline font-semibold text-sm text-on-surface-variant block mb-2">Full Name</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-lg">person</span>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter full name"
                className="w-full bg-surface border border-outline-variant/50 rounded-xl py-3 h-auto pl-11 pr-4 font-body text-sm text-on-surface placeholder:text-outline focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>

          {/* Relationship */}
          <div>
            <label className="font-headline font-semibold text-sm text-on-surface-variant block mb-2">Relationship</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-lg">group</span>
              <select
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                className="w-full bg-surface border border-outline-variant/50 rounded-xl py-3 pl-11 pr-4 font-body text-sm text-on-surface appearance-none focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
              >
                <option value="" disabled>Select relationship</option>
                {relationships.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
              <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-lg pointer-events-none">expand_more</span>
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label className="font-headline font-semibold text-sm text-on-surface-variant block mb-2">Phone Number</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-lg">phone</span>
              <Input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full bg-surface border border-outline-variant/50 rounded-xl py-3 h-auto pl-11 pr-4 font-body text-sm text-on-surface placeholder:text-outline focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>

          {/* Info Note */}
          <div className="p-4 rounded-2xl bg-secondary-container/30 border border-secondary-container flex gap-3">
            <span className="material-symbols-outlined text-secondary mt-0.5">info</span>
            <p className="font-body text-sm text-on-surface-variant leading-relaxed">
              This contact will be listed as a secondary emergency contact and may be reached if the primary contact is unavailable.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-surface-variant/50 bg-surface-container-lowest flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl text-on-surface-variant font-headline font-semibold hover:bg-surface-container transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isValid}
            className="px-8 py-2.5 rounded-xl primary-gradient text-on-primary font-headline font-bold shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-md flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">person_add</span>
            Add Contact
          </button>
        </div>
      </div>
    </div>
  );
}
