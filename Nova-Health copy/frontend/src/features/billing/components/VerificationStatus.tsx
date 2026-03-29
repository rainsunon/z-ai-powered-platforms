import React from 'react';
import { Badge } from '@/components/ui/badge';

interface VerificationStatusProps {
  message: string;
}

export function VerificationStatus({ message }: VerificationStatusProps) {
  return (
    <div className="flex flex-col gap-3 mb-10">
      <Badge
        variant="outline"
        className="flex items-center gap-3 p-4 bg-surface-container-low rounded-2xl border-0 h-auto"
      >
        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
        <span className="text-xs font-semibold text-primary uppercase tracking-wider">
          {message}
        </span>
      </Badge>
    </div>
  );
}
