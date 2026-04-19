import React from 'react';

interface PrescriptionField {
  label: string;
  value: string;
  valueClass?: string;
}

interface PrescriptionInfoCardProps {
  fields: PrescriptionField[];
}

export function PrescriptionInfoCard({ fields }: PrescriptionInfoCardProps) {
  return (
    <div className="bg-surface rounded-2xl p-6">
      <h2 className="text-xl font-bold text-on-surface mb-6 flex items-center gap-2">
        <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
          description
        </span>
        Prescription Info
      </h2>
      <div className="space-y-4">
        {fields.map((field, index) => (
          <div key={index} className="flex items-start gap-3">
            <span className="material-symbols-outlined text-on-surface-variant mt-0.5">label</span>
            <div>
              <p className="text-sm text-on-surface-variant">{field.label}</p>
              <p className={`text-on-surface font-medium ${field.valueClass || ''}`}>{field.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
