import React from 'react';
import { Badge } from '@/components/ui/badge';

interface DocumentRowProps {
  title: string;
  source: string;
  date: string;
  icon: string;
  iconBgClass: string;
  iconColorClass: string;
  typeLabel: string;
  typeBadgeClass: string;
  statusLabel?: string;
  statusDot?: string;
  metaLabel?: string;
  metaValue?: string;
}

export function DocumentRow({
  title, source, date, icon, iconBgClass, iconColorClass,
  typeLabel, typeBadgeClass, statusLabel, statusDot, metaLabel, metaValue,
}: DocumentRowProps) {
  return (
    <div className="group bg-surface-container-lowest hover:bg-white rounded-[1.5rem] p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-all hover:shadow-[0px_10px_30px_rgba(21,30,18,0.04)] ring-1 ring-outline-variant/10">
      <div className="flex items-center gap-5 flex-1">
        <div className={`w-14 h-14 ${iconBgClass} rounded-2xl flex items-center justify-center ${iconColorClass} shrink-0`}>
          <span className="material-symbols-outlined text-3xl">{icon}</span>
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-headline font-bold text-on-surface truncate">{title}</h4>
            <Badge variant="outline" className={`${typeBadgeClass} text-[10px] font-bold uppercase tracking-wider border-none h-auto py-0.5 rounded-md`}>
              {typeLabel}
            </Badge>
          </div>
          <p className="text-sm text-on-surface-variant mt-1">Added by <span className="font-medium">{source}</span> • {date}</p>
        </div>
      </div>
      <div className="flex items-center gap-8 w-full md:w-auto">
        {(statusLabel || metaValue) && (
          <div className="hidden sm:flex flex-col items-end">
            <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">{metaLabel || 'Status'}</p>
            {statusLabel ? (
              <p className={`text-xs font-bold flex items-center gap-1 mt-1 ${statusDot === 'primary' ? 'text-primary' : 'text-on-surface-variant'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${statusDot === 'primary' ? 'bg-primary' : 'bg-outline-variant'}`}></span>
                {statusLabel}
              </p>
            ) : (
              <p className="text-xs text-on-surface font-bold mt-1">{metaValue}</p>
            )}
          </div>
        )}
        <div className="flex items-center gap-2 ml-auto">
          {['visibility', 'download', 'share'].map((action) => (
            <button key={action} className="p-3 rounded-xl bg-surface-container-low text-on-surface-variant hover:text-primary hover:bg-white hover:shadow-sm transition-all" title={action}>
              <span className="material-symbols-outlined">{action}</span>
            </button>
          ))}
          <button className="p-3 rounded-xl text-on-surface-variant hover:bg-surface-container-high transition-all">
            <span className="material-symbols-outlined">more_vert</span>
          </button>
        </div>
      </div>
    </div>
  );
}
