import React from 'react';

interface SupportCategoryCardProps {
  icon: string;
  title: string;
  description: string;
  linkText: string;
  iconBgClass?: string;
  cardBgClass?: string;
  cardHoverClass?: string;
  iconColorClass?: string;
}

export function SupportCategoryCard({
  icon,
  title,
  description,
  linkText,
  iconBgClass = 'bg-primary/10',
  cardBgClass = 'bg-surface-container',
  cardHoverClass = 'hover:bg-surface-container-highest',
  iconColorClass = 'text-primary',
}: SupportCategoryCardProps) {
  return (
    <div className={`group p-8 rounded-[2.5rem] ${cardBgClass} ${cardHoverClass} transition-all duration-500 cursor-pointer border border-outline-variant/15`}>
      <div className={`w-14 h-14 rounded-2xl ${iconBgClass} flex items-center justify-center mb-6 group-hover:opacity-80 transition-colors`}>
        <span className={`material-symbols-outlined ${iconColorClass} text-3xl`}>{icon}</span>
      </div>
      <h3 className="text-2xl font-bold mb-3 tracking-tight">{title}</h3>
      <p className="text-on-surface-variant leading-relaxed">{description}</p>
      <div className="mt-8 flex items-center gap-2 text-primary font-bold">
        {linkText} <span className="material-symbols-outlined text-sm">arrow_forward</span>
      </div>
    </div>
  );
}
