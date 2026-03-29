import React from 'react';

interface MilestoneHeaderProps {
  title?: string;
  description?: string;
  highlightText?: string;
}

export function MilestoneHeader({
  title = 'Milestone Achieved!',
  description,
  highlightText = '50,000 Steps Together'
}: MilestoneHeaderProps) {
  return (
    <div className="space-y-4">
      <h1 className="font-headline font-extrabold text-4xl md:text-6xl text-on-surface tracking-tight leading-tight">
        {title}
      </h1>
      <p className="text-on-surface-variant text-lg md:text-xl max-w-lg mx-auto leading-relaxed">
        {description || (
          <>
            You've conquered <span className="text-primary font-bold">{highlightText}</span> with your health tribe. That's pure momentum.
          </>
        )}
      </p>
    </div>
  );
}
