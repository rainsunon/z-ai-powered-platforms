import React from 'react';
import { useNavigate } from 'react-router-dom';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  backTo?: string;
  backLabel?: string;
  badge?: string;
  actions?: React.ReactNode;
}

export function PageHeader({ title, subtitle, backTo, backLabel, badge, actions }: PageHeaderProps) {
  const navigate = useNavigate();

  return (
    <section className="flex flex-col md:flex-row justify-between items-end gap-6">
      <div>
        {(backTo || badge) && (
          <div className="flex items-center gap-2 mb-3">
            {backTo && (
              <button onClick={() => navigate(backTo)} className="p-2 rounded-full hover:bg-surface-container transition-colors">
                <span className="material-symbols-outlined text-on-surface-variant">arrow_back</span>
              </button>
            )}
            {badge && <span className="text-xs font-bold text-primary uppercase tracking-widest">{badge}</span>}
          </div>
        )}
        <h2 className="text-4xl md:text-5xl font-extrabold font-headline tracking-tight text-on-surface mb-2">{title}</h2>
        {subtitle && <p className="text-on-surface-variant text-lg max-w-xl">{subtitle}</p>}
      </div>
      {actions && <div className="flex gap-4">{actions}</div>}
    </section>
  );
}
