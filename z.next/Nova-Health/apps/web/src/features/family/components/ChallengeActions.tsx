import React from 'react';
import { Button } from '@/components/ui/button';

interface ChallengeActionsProps {
  onCreateCustom?: () => void;
  onBrowseLibrary?: () => void;
}

export function ChallengeActions({
  onCreateCustom,
  onBrowseLibrary
}: ChallengeActionsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center justify-center pt-8">
      <Button
        onClick={onCreateCustom}
        className="w-full sm:w-auto px-10 py-5 primary-gradient text-white rounded-[1.5rem] font-headline font-bold text-lg shadow-xl hover:scale-[1.03] transition-transform active:scale-95"
      >
        Create Custom Challenge
      </Button>
      <Button
        variant="outline"
        onClick={onBrowseLibrary}
        className="w-full sm:w-auto px-10 py-5 bg-surface-container-high text-primary rounded-[1.5rem] font-headline font-bold text-lg hover:bg-surface-container-highest transition-colors active:scale-95"
      >
        Browse Challenge Library
      </Button>
    </div>
  );
}
