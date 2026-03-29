import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface IconInputProps extends React.ComponentProps<typeof Input> {
  label: string;
  icon: string;
  error?: string;
  /** Extra element rendered in the label row (e.g. a "Forgot?" link) */
  labelExtra?: React.ReactNode;
  /** Content placed at the right end of the input (e.g. visibility toggle) */
  trailing?: React.ReactNode;
}

export function IconInput({
  label,
  icon,
  error,
  labelExtra,
  trailing,
  id,
  className,
  ...inputProps
}: IconInputProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={id} className="font-headline font-semibold text-sm text-on-surface-variant">
          {label}
        </Label>
        {labelExtra}
      </div>
      <div className="relative group">
        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">
          {icon}
        </span>
        <Input
          id={id}
          className={`bg-surface border-outline-variant/50 rounded-2xl py-4 pl-12 ${trailing ? 'pr-12' : 'pr-4'} font-body text-on-surface placeholder:text-outline focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all h-auto ${className ?? ''}`}
          {...inputProps}
        />
        {trailing && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            {trailing}
          </div>
        )}
      </div>
      {error && <p className="text-error text-xs mt-1">{error}</p>}
    </div>
  );
}
