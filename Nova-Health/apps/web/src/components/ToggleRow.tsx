import React from 'react';

interface ToggleRowProps {
  label: string;
  desc: string;
  defaultOn: boolean;
  onChange?: (value: boolean) => void;
}

export function ToggleRow({ label, desc, defaultOn, onChange }: ToggleRowProps) {
  const [on, setOn] = React.useState(defaultOn);

  const toggle = () => {
    const next = !on;
    setOn(next);
    onChange?.(next);
  };

  return (
    <div className="flex items-center justify-between p-4 rounded-2xl bg-surface-container/50">
      <div>
        <p className="font-bold text-on-surface">{label}</p>
        <p className="text-sm text-on-surface-variant mt-0.5">{desc}</p>
      </div>
      <button
        onClick={toggle}
        className={`relative w-12 h-7 rounded-full transition-colors ${on ? 'bg-primary' : 'bg-surface-variant'}`}
        role="switch"
        aria-checked={on}
      >
        <span className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform ${on ? 'translate-x-5' : 'translate-x-0'}`}></span>
      </button>
    </div>
  );
}
