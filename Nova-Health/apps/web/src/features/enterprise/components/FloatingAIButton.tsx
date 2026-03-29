import React from 'react';
import { Button } from '@/components/ui/button';

export function FloatingAIButton() {
  return (
    <Button
      className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-br from-primary to-primary-container text-on-primary rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50 p-0"
      aria-label="Open AI Assistant"
    >
      <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
        smart_toy
      </span>
    </Button>
  );
}
