import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function SupportSearchBar() {
  return (
    <div className="mt-8 relative max-w-2xl group">
      <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
        <span className="material-symbols-outlined text-primary/60">search</span>
      </div>
      <Input
        type="text"
        placeholder="Search for answers..."
        className="w-full pl-16 pr-6 py-6 h-auto bg-surface-container-low border-none rounded-[2rem] focus:ring-4 focus:ring-primary/10 transition-all text-lg font-medium placeholder:text-on-surface/40"
      />
      <div className="absolute right-3 inset-y-3">
        <Button className="h-full px-8 bg-on-surface text-surface rounded-full font-bold hover:bg-primary transition-colors">
          Search
        </Button>
      </div>
    </div>
  );
}
