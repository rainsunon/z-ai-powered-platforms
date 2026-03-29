import React from 'react';
import { Input } from '@/components/ui/input';
import type { Medication } from '@/store/useMedicationStore';

interface MedicationFormModalProps {
  mode: 'add' | 'edit';
  form: Omit<Medication, 'id'>;
  onFormChange: (form: Omit<Medication, 'id'>) => void;
  onSave: () => void;
  onCancel: () => void;
}

export function MedicationFormModal({
  mode,
  form,
  onFormChange,
  onSave,
  onCancel
}: MedicationFormModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onCancel}>
      <div className="bg-surface-container-lowest rounded-3xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <h2 className="font-headline font-bold text-2xl text-on-surface mb-6">
          {mode === 'add' ? 'Add Medication' : 'Edit Medication'}
        </h2>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-body text-sm font-medium text-on-surface-variant mb-1">Name *</label>
              <Input
                type="text"
                value={form.name}
                onChange={(e) => onFormChange({ ...form, name: e.target.value })}
                className="w-full px-4 py-3 h-auto rounded-xl bg-surface-container border border-outline-variant/30 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                placeholder="e.g. Lisinopril"
              />
            </div>
            <div>
              <label className="block font-body text-sm font-medium text-on-surface-variant mb-1">Dosage *</label>
              <Input
                type="text"
                value={form.dosage}
                onChange={(e) => onFormChange({ ...form, dosage: e.target.value })}
                className="w-full px-4 py-3 h-auto rounded-xl bg-surface-container border border-outline-variant/30 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                placeholder="e.g. 10mg"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-body text-sm font-medium text-on-surface-variant mb-1">Type</label>
              <select
                value={form.type}
                onChange={(e) => onFormChange({ ...form, type: e.target.value as Medication['type'] })}
                className="w-full px-4 py-3 rounded-xl bg-surface-container border border-outline-variant/30 text-on-surface focus:border-primary outline-none"
              >
                <option value="Tablet">Tablet</option>
                <option value="Capsule">Capsule</option>
                <option value="Liquid">Liquid</option>
                <option value="Injection">Injection</option>
                <option value="Topical">Topical</option>
              </select>
            </div>
            <div>
              <label className="block font-body text-sm font-medium text-on-surface-variant mb-1">Frequency</label>
              <select
                value={form.frequency}
                onChange={(e) => onFormChange({ ...form, frequency: e.target.value as Medication['frequency'] })}
                className="w-full px-4 py-3 rounded-xl bg-surface-container border border-outline-variant/30 text-on-surface focus:border-primary outline-none"
              >
                <option value="morning">Morning</option>
                <option value="evening">Evening</option>
                <option value="both">Both (AM & PM)</option>
                <option value="as-needed">As needed</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-body text-sm font-medium text-on-surface-variant mb-1">Time</label>
              <Input
                type="time"
                value={form.time}
                onChange={(e) => onFormChange({ ...form, time: e.target.value })}
                className="w-full px-4 py-3 h-auto rounded-xl bg-surface-container border border-outline-variant/30 text-on-surface focus:border-primary outline-none"
              />
            </div>
            <div>
              <label className="block font-body text-sm font-medium text-on-surface-variant mb-1">Refills Left</label>
              <Input
                type="number"
                min={0}
                value={form.refillsLeft}
                onChange={(e) => onFormChange({ ...form, refillsLeft: Number(e.target.value) })}
                className="w-full px-4 py-3 h-auto rounded-xl bg-surface-container border border-outline-variant/30 text-on-surface focus:border-primary outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block font-body text-sm font-medium text-on-surface-variant mb-1">Prescribed By</label>
            <Input
              type="text"
              value={form.prescribedBy}
              onChange={(e) => onFormChange({ ...form, prescribedBy: e.target.value })}
              className="w-full px-4 py-3 h-auto rounded-xl bg-surface-container border border-outline-variant/30 text-on-surface focus:border-primary outline-none"
              placeholder="e.g. Dr. Smith"
            />
          </div>
          <div>
            <label className="block font-body text-sm font-medium text-on-surface-variant mb-1">Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => onFormChange({ ...form, notes: e.target.value })}
              rows={2}
              className="w-full px-4 py-3 rounded-xl bg-surface-container border border-outline-variant/30 text-on-surface focus:border-primary outline-none resize-none"
              placeholder="Any special instructions..."
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-8">
          <button
            onClick={onCancel}
            className="px-6 py-3 rounded-xl bg-surface-container text-on-surface-variant font-headline font-bold hover:bg-surface-container-high transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={!form.name || !form.dosage}
            className="px-6 py-3 rounded-xl primary-gradient text-on-primary font-headline font-bold shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {mode === 'add' ? 'Add Medication' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
