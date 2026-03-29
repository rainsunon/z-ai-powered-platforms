import React from 'react';

interface HistoryEntry {
  date: string;
  change: string;
  provider: string;
  dosage: string;
}

interface MedicationHistoryTableProps {
  entries: HistoryEntry[];
}

export function MedicationHistoryTable({ entries }: MedicationHistoryTableProps) {
  return (
    <div className="bg-surface rounded-2xl p-6">
      <h2 className="text-xl font-bold text-on-surface mb-6 flex items-center gap-2">
        <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
          history
        </span>
        Medication History
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-outline-variant/50">
              <th className="text-left py-3 px-4 font-semibold text-on-surface-variant">Date</th>
              <th className="text-left py-3 px-4 font-semibold text-on-surface-variant">Change</th>
              <th className="text-left py-3 px-4 font-semibold text-on-surface-variant">Provider</th>
              <th className="text-left py-3 px-4 font-semibold text-on-surface-variant">Dosage</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, index) => (
              <tr key={index} className="border-b border-outline-variant/30 last:border-0 hover:bg-surface-container-low/50 transition-colors">
                <td className="py-3 px-4 text-on-surface">{entry.date}</td>
                <td className="py-3 px-4 text-on-surface">{entry.change}</td>
                <td className="py-3 px-4 text-on-surface">{entry.provider}</td>
                <td className="py-3 px-4 text-on-surface font-medium">{entry.dosage}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
