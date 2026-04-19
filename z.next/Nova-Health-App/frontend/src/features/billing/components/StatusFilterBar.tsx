import React from 'react';
import { Button } from '@/components/ui/button';

const FILTERS = [
  { value: 'all', label: 'All Transactions' },
  { value: 'completed', label: 'Completed' },
  { value: 'failed', label: 'Failed' },
  { value: 'refunded', label: 'Refunded' },
] as const;

interface StatusFilterBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function StatusFilterBar({ value, onChange }: StatusFilterBarProps) {
  return (
    <div className="flex items-center gap-3 bg-surface-container p-1.5 rounded-full w-fit">
      {FILTERS.map((f) => (
        <Button
          key={f.value}
          variant="ghost"
          size="sm"
          onClick={() => onChange(f.value)}
          className={`px-6 py-2 h-auto rounded-full text-sm font-bold transition-all ${
            value === f.value
              ? 'bg-surface-container-lowest text-on-surface shadow-sm hover:bg-surface-container-lowest'
              : 'text-on-surface-variant hover:text-on-surface hover:bg-transparent'
          }`}
        >
          {f.label}
        </Button>
      ))}
    </div>
  );
}
