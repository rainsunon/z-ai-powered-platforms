import React from 'react';

interface CategoryCardProps {
  icon: string;
  title: string;
  description: string;
}

export function CategoryCard({ icon, title, description }: CategoryCardProps) {
  return (
    <div className="bg-surface-container-lowest p-8 rounded-[2rem] hover:shadow-xl hover:shadow-primary/5 transition-all cursor-pointer group border border-transparent hover:border-primary-container/20">
      <div className="w-14 h-14 rounded-full bg-secondary-container/30 flex items-center justify-center mb-6 group-hover:bg-primary-container group-hover:text-white transition-colors">
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <h5 className="text-xl font-bold font-headline mb-2">{title}</h5>
      <p className="text-sm text-on-surface-variant leading-relaxed">{description}</p>
    </div>
  );
}
