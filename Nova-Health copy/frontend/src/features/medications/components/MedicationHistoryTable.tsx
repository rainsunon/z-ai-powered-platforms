import React from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';

interface MedicationHistoryEntry {
  date: string;
  change: string;
  provider: string;
  dosage: string;
}

interface MedicationHistoryTableProps {
  entries: MedicationHistoryEntry[];
}

export function MedicationHistoryTable({ entries }: MedicationHistoryTableProps) {
  return (
    <div className="bg-surface-container-lowest p-8 rounded-[2rem] shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-headline font-bold text-xl flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">history</span>
          Medication History
        </h3>
        <button className="text-xs font-bold text-primary hover:underline">View All</button>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-outline-variant/15">
              <TableHead className="font-bold text-on-surface-variant">Date</TableHead>
              <TableHead className="font-bold text-on-surface-variant">Change</TableHead>
              <TableHead className="font-bold text-on-surface-variant">Provider</TableHead>
              <TableHead className="font-bold text-on-surface-variant text-right">Dosage</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map((entry, i) => (
              <TableRow key={i} className="hover:bg-surface-container/50 border-b border-outline-variant/10">
                <TableCell className="text-on-surface font-medium">{entry.date}</TableCell>
                <TableCell className="text-on-surface-variant">{entry.change}</TableCell>
                <TableCell className="text-on-surface-variant">{entry.provider}</TableCell>
                <TableCell className="text-right font-bold text-on-surface">{entry.dosage}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
