import React from 'react';
import { Button } from '@/components/ui/button';

interface SectionHeaderProps {
  title: string;
  viewAllText?: string;
  onViewAll?: () => void;
}

export function SectionHeader({ title, viewAllText = 'View All', onViewAll }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h3 className="text-2xl font-black font-headline tracking-tight">{title}</h3>
      {onViewAll && (
        <Button
          variant="ghost"
          className="text-primary font-bold text-sm hover:underline"
          onClick={onViewAll}
        >
          {viewAllText}
        </Button>
      )}
    </div>
  );
}
