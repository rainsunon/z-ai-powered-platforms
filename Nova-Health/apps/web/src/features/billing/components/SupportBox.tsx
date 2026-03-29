import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface SupportBoxProps {
  email?: string;
}

export function SupportBox({ email = 'support@novahealth.com' }: SupportBoxProps) {
  return (
    <Card className="bg-surface-container-high rounded-xl border-0">
      <CardContent className="p-8 text-center">
        <h4 className="font-headline font-bold mb-2">Need assistance?</h4>
        <p className="text-on-surface-variant mb-4">
          Our financial support team is here to help with any billing questions.
        </p>
        <div className="flex justify-center gap-6">
          <a
            href={`mailto:${email}`}
            className="flex items-center gap-2 text-primary font-semibold"
          >
            <span className="material-symbols-outlined text-lg">mail</span>
            Contact Support
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
