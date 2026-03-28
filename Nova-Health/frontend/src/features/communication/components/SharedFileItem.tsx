import React from 'react';

interface SharedFileItemProps {
  name: string;
  date: string;
  size: string;
  icon: string;
  iconBgClass: string;
  iconColorClass: string;
}

export function SharedFileItem({ name, date, size, icon, iconBgClass, iconColorClass }: SharedFileItemProps) {
  return (
    <div className="flex items-center gap-3 p-3 bg-white/40 rounded-2xl hover:bg-white/60 cursor-pointer transition-colors group">
      <div className={`w-10 h-10 rounded-xl ${iconBgClass} flex items-center justify-center ${iconColorClass}`}>
        <span className="material-symbols-outlined text-xl">{icon}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-on-surface truncate">{name}</p>
        <p className="text-[10px] text-stone-400">{date} • {size}</p>
      </div>
      <button className={`p-1.5 rounded-full hover:${iconBgClass} ${iconColorClass} transition-colors ml-1`}>
        <span className="material-symbols-outlined text-lg">download</span>
      </button>
    </div>
  );
}
