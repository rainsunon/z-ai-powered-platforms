import React from 'react';

interface ArchivedReportItemProps {
  title: string;
  date: string;
  size: string;
}

export function ArchivedReportItem({ title, date, size }: ArchivedReportItemProps) {
  return (
    <div className="py-4 flex items-center justify-between hover:bg-emerald-50/30 transition-colors rounded-xl px-2">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center">
          <span className="material-symbols-outlined text-emerald-700">description</span>
        </div>
        <div>
          <p className="font-bold text-on-surface">{title}</p>
          <p className="text-xs text-stone-400">{date} • {size}</p>
        </div>
      </div>
      <button className="material-symbols-outlined hover:text-emerald-700 bg-stone-50 p-2 rounded-full text-emerald-600">download</button>
    </div>
  );
}
