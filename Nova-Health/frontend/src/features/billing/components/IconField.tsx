import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const inputClass =
  'w-full bg-surface-container-low border-none rounded-2xl py-4 px-4 text-on-surface font-semibold placeholder:opacity-40 focus:bg-surface-container-highest focus:ring-2 focus:ring-primary/20 h-auto';

const labelClass = 'block text-sm font-bold text-on-surface-variant uppercase tracking-wider ml-1';

interface IconFieldProps {
  label: string;
  icon: string;
  placeholder: string;
  type?: string;
  required?: boolean;
  rightElement?: React.ReactNode;
  inputClassName?: string;
}

export function IconField({
  label,
  icon,
  placeholder,
  type = 'text',
  required,
  rightElement,
  inputClassName,
}: IconFieldProps) {
  return (
    <div className="space-y-2">
      <Label className={labelClass}>{label}</Label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <span className="material-symbols-outlined text-outline text-lg">{icon}</span>
        </div>
        <Input
          type={type}
          className={`${inputClass} pl-12 ${rightElement ? 'pr-12' : ''} ${inputClassName ?? ''}`}
          placeholder={placeholder}
          required={required}
        />
        {rightElement && (
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
            {rightElement}
          </div>
        )}
      </div>
    </div>
  );
}

export { inputClass, labelClass };
