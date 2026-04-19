import React from 'react';
import { useNavigate } from 'react-router-dom';

interface BreadcrumbItem {
  label: string;
  to?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-2 text-sm text-on-surface-variant">
      {items.map((item, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span className="material-symbols-outlined text-[14px]">chevron_right</span>}
          {item.to ? (
            <button onClick={() => navigate(item.to!)} className="hover:text-primary transition-colors flex items-center gap-1">
              {i === 0 && <span className="material-symbols-outlined text-[18px]">arrow_back</span>}
              {item.label}
            </button>
          ) : (
            <span className="text-on-surface font-medium">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
