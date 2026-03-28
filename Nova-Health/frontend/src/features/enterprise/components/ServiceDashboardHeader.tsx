import React from 'react';
import { Button } from '@/components/ui/button';

interface ServiceDashboardHeaderProps {
  userName?: string;
  onInternalNote?: () => void;
  onNewSupportCase?: () => void;
}

export function ServiceDashboardHeader({
  userName,
  onInternalNote,
  onNewSupportCase
}: ServiceDashboardHeaderProps) {
  const firstName = userName?.split(' ')[0];

  return (
    <div className="flex justify-between items-end">
      <div>
        <h2 className="text-4xl font-black font-headline tracking-tight text-primary">Service Dashboard</h2>
        <p className="text-on-surface-variant mt-2 text-lg">
          Welcome back, {firstName}. Here is your operations snapshot.
        </p>
      </div>
      <div className="flex gap-3">
        <Button
          variant="outline"
          className="bg-surface-container-high text-primary font-headline font-bold px-6 py-3 rounded-xl hover:bg-surface-container-highest transition-colors flex items-center gap-2"
          onClick={onInternalNote}
        >
          <span className="material-symbols-outlined">edit_note</span>
          <span>Internal Note</span>
        </Button>
        <Button
          className="bg-gradient-to-br from-primary to-primary-container text-on-primary font-headline font-bold px-6 py-3 rounded-xl shadow-lg shadow-primary/20 flex items-center gap-2 hover:scale-95 transition-transform"
          onClick={onNewSupportCase}
        >
          <span className="material-symbols-outlined">add_circle</span>
          <span>New Support Case</span>
        </Button>
      </div>
    </div>
  );
}
