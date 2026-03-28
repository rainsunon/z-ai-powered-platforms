import React from 'react';
import { Badge } from '@/components/ui/badge';

interface ResourceItemProps {
  imageSrc: string;
  category: string;
  readTime: string;
  title: string;
  description: string;
}

export function ResourceItem({ imageSrc, category, readTime, title, description }: ResourceItemProps) {
  return (
    <div className="bg-surface-container-low p-6 rounded-3xl flex items-center gap-6 group hover:bg-white hover:shadow-md transition-all">
      <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0">
        <img className="w-full h-full object-cover" src={imageSrc} alt={title} />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="secondary" className="bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest rounded">
            {category}
          </Badge>
          <span className="text-[10px] text-on-surface-variant">• {readTime}</span>
        </div>
        <h6 className="text-lg font-bold font-headline group-hover:text-primary transition-colors">{title}</h6>
        <p className="text-sm text-on-surface-variant mt-1 line-clamp-1">{description}</p>
      </div>
      <span className="material-symbols-outlined text-outline group-hover:text-primary">bookmark</span>
    </div>
  );
}
