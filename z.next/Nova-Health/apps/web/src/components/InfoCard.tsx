import React from 'react';

interface InfoCardProps {
  icon: string;
  iconStyle?: 'filled' | 'outlined';
  iconColor?: string;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function InfoCard({ icon, iconStyle = 'outlined', iconColor = 'text-primary', title, children, className = '' }: InfoCardProps) {
  return (
    <div className={`bg-surface-container-lowest p-8 rounded-[2rem] shadow-sm ${className}`}>
      <h3 className="font-headline font-bold text-xl mb-6 flex items-center gap-2">
        <span
          className={`material-symbols-outlined ${iconColor}`}
          style={iconStyle === 'filled' ? { fontVariationSettings: "'FILL' 1" } : undefined}
        >
          {icon}
        </span>
        {title}
      </h3>
      {children}
    </div>
  );
}
