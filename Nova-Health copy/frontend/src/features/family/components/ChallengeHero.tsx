import React from 'react';

interface ChallengeHeroProps {
  title?: string;
  description?: string;
  daysRemaining?: string;
  globalRank?: string;
  progress?: {
    current: string;
    total: string;
    percentage: number;
  };
}

export function ChallengeHero({
  title = 'Step Up Together: 50,000 Steps',
  description = 'Unite household and hit pavement! Your collective movement fuels family vitality meter.',
  daysRemaining = '04 Days',
  globalRank = '#12',
  progress = {
    current: '34,250',
    total: '50,000',
    percentage: 68.5
  }
}: ChallengeHeroProps) {
  return (
    <section className="relative overflow-hidden rounded-[2.5rem] bg-surface-container-low min-h-[320px] flex items-center p-8 md:p-12">
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-container rounded-full blur-[100px] -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-secondary-fixed rounded-full blur-[80px] -ml-24 -mb-24"></div>
      </div>
      <div className="relative z-10 w-full grid md:grid-cols-2 gap-8 items-center">
        <div>
          <span className="inline-block px-4 py-1.5 rounded-full bg-secondary-container text-on-secondary-container text-xs font-bold tracking-widest uppercase mb-4">
            Current Main Challenge
          </span>
          <h1 className="font-headline text-4xl md:text-5xl font-extrabold text-on-surface leading-tight mb-6 tracking-tight">
            {title}
          </h1>
          <p className="text-on-surface-variant font-medium mb-8 max-w-md">{description}</p>
          <div className="flex items-center gap-6">
            <div className="flex flex-col">
              <span className="text-xs text-on-surface-variant uppercase font-bold tracking-widest">Days Remaining</span>
              <span className="text-2xl font-headline font-extrabold text-primary">{daysRemaining}</span>
            </div>
            <div className="h-10 w-[1px] bg-outline-variant/30"></div>
            <div className="flex flex-col">
              <span className="text-xs text-on-surface-variant uppercase font-bold tracking-widest">Global Rank</span>
              <span className="text-2xl font-headline font-extrabold text-primary">{globalRank}</span>
            </div>
          </div>
        </div>
        <div className="bg-white/70 backdrop-blur-2xl p-8 rounded-[2rem] shadow-xl border border-white/40">
          <div className="flex justify-between items-end mb-4">
            <h3 className="font-headline font-bold text-xl">Household Progress</h3>
            <span className="text-primary font-bold">{progress.current} / {progress.total}</span>
          </div>
          <div className="w-full h-4 bg-surface-variant rounded-full overflow-hidden mb-6">
            <div className="h-full primary-gradient rounded-full" style={{ width: `${progress.percentage}%` }}></div>
          </div>
          <div className="flex -space-x-3 overflow-hidden">
            <div className="inline-block h-10 w-10 rounded-full ring-4 ring-white bg-primary flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>face_4</span>
            </div>
            <div className="inline-block h-10 w-10 rounded-full ring-4 ring-white bg-tertiary flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>face_3</span>
            </div>
            <div className="inline-block h-10 w-10 rounded-full ring-4 ring-white bg-secondary flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>face_5</span>
            </div>
            <div className="flex items-center justify-center h-10 w-10 rounded-full ring-4 ring-white bg-surface-container-highest text-xs font-bold">
              +2
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
