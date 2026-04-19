import React from 'react';

export function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center">
      <div className="w-24 h-24 rounded-full bg-surface-container flex items-center justify-center text-primary mb-6">
        <span className="material-symbols-outlined text-4xl">construction</span>
      </div>
      <h1 className="font-headline font-bold text-3xl text-on-surface mb-2">{title}</h1>
      <p className="font-body text-outline max-w-md">This section is currently under construction. Check back soon for updates.</p>
    </div>
  );
}
