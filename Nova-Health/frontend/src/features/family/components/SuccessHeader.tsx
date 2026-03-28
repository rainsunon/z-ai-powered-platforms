import React from 'react';

interface SuccessHeaderProps {
  userName?: string;
  title?: string;
  description?: string;
  icon?: string;
}

export function SuccessHeader({
  userName = 'Sarah',
  title = 'Reward Successfully Redeemed!',
  description,
  icon = 'check_circle'
}: SuccessHeaderProps) {
  return (
    <div className="text-center space-y-3">
      <div className="inline-flex items-center justify-center w-12 h-12 bg-secondary-container text-on-secondary-container rounded-full mb-2">
        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
          {icon}
        </span>
      </div>
      <h1 className="text-3xl md:text-4xl font-headline font-extrabold tracking-tight text-on-surface">
        {title}
      </h1>
      <p className="text-on-surface-variant text-lg max-w-md mx-auto leading-relaxed">
        {description || `${userName}, your family's hard work paid off. Enjoy your wellness reward!`}
      </p>
    </div>
  );
}
