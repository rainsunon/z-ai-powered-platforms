import React from 'react';
import { Button } from '@/components/ui/button';

export function DataPrivacySection() {
  return (
    <section className="bg-surface-container-low p-8 rounded-[2rem]">
      <h3 className="font-headline font-bold text-xl flex items-center gap-2 mb-6">
        <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>privacy_tip</span>
        Data Privacy & Portability
      </h3>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button variant="outline" className="flex-1 h-auto py-4 rounded-2xl bg-surface-container-lowest text-on-surface font-bold hover:bg-surface-container-high border-0">
          <span className="material-symbols-outlined text-primary mr-2">download</span>
          Download My Records
        </Button>
        <Button variant="destructive" className="flex-1 h-auto py-4 rounded-2xl bg-error/10 text-error font-bold hover:bg-error/15">
          <span className="material-symbols-outlined mr-2">delete_forever</span>
          Request Account Deletion
        </Button>
      </div>
      <p className="text-xs text-on-surface-variant mt-4 text-center">Your data is protected under HIPAA regulations. Account deletion requests are processed within 30 days.</p>
    </section>
  );
}
