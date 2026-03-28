import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface Symptom {
  label: string;
  variant: 'error' | 'secondary';
}

interface SessionNotesPanelProps {
  symptoms: Symptom[];
  doctorNotes: string;
  doctorName: string;
}

export function SessionNotesPanel({ symptoms, doctorNotes, doctorName }: SessionNotesPanelProps) {
  return (
    <Card className="bg-surface-container-lowest rounded-3xl border border-surface-variant/50 shadow-sm flex flex-col overflow-hidden ring-0 p-0 gap-0">
      <CardHeader className="p-6 border-b border-surface-variant/50 rounded-none">
        <CardTitle className="font-headline font-bold text-xl text-on-surface">Session Notes</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-6 overflow-y-auto space-y-6">
        <div className="space-y-2">
          <h3 className="font-headline font-semibold text-sm text-on-surface-variant">Current Symptoms</h3>
          <div className="flex flex-wrap gap-2">
            {symptoms.map((symptom) => (
              <Badge
                key={symptom.label}
                className={`px-3 py-1 rounded-lg text-xs font-semibold h-auto ${
                  symptom.variant === 'error'
                    ? 'bg-error-container text-on-error-container'
                    : 'bg-secondary-container text-on-secondary-container'
                }`}
              >
                {symptom.label}
              </Badge>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="font-headline font-semibold text-sm text-on-surface-variant">Doctor's Notes</h3>
          <p className="font-body text-sm text-outline leading-relaxed">{doctorNotes}</p>
        </div>
      </CardContent>
      <div className="p-4 border-t border-surface-variant/50 bg-surface-container-low">
        <div className="relative">
          <Input
            type="text"
            placeholder={`Type a message to ${doctorName}...`}
            className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-2xl py-3 h-auto pl-4 pr-12 font-body text-sm text-on-surface placeholder:text-outline focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          />
          <Button size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container transition-colors">
            <span className="material-symbols-outlined text-[18px]">send</span>
          </Button>
        </div>
      </div>
    </Card>
  );
}
