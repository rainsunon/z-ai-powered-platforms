import React from 'react';

interface MilestoneBadgeProps {
  icon?: string;
  secondaryIcon?: string;
}

export function MilestoneBadge({
  icon = 'military_tech',
  secondaryIcon = 'auto_awesome'
}: MilestoneBadgeProps) {
  return (
    <div className="relative group">
      <div className="absolute inset-0 bg-primary/10 rounded-full scale-110 blur-3xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
      <div className="relative" style={{ filter: 'drop-shadow(0 0 30px rgba(29, 204, 13, 0.4))' }}>
        <div className="mx-auto w-48 h-48 md:w-64 md:h-64 primary-gradient rounded-[3rem] rotate-12 flex items-center justify-center shadow-xl shadow-primary/20">
          <div className="w-[90%] h-[90%] border-4 border-white/20 rounded-[2.8rem] flex flex-col items-center justify-center -rotate-12 bg-white/10 backdrop-blur-sm relative">
            <span className="material-symbols-outlined text-white text-7xl md:text-8xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              {icon}
            </span>
            <span className="material-symbols-outlined text-white/40 absolute top-4 right-4" style={{ fontVariationSettings: "'FILL' 1" }}>
              {secondaryIcon}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
