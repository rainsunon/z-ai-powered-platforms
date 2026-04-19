import React from 'react';

interface TimelineItem {
  title: string;
  date: string;
  icon: string;
  color: string;
}

const wellnessTabs = ['General', 'Sleep', 'Activity'] as const;
type WellnessTab = typeof wellnessTabs[number];

interface WellnessScoresProps {
  activeTab: WellnessTab;
  onTabChange: (tab: WellnessTab) => void;
}

export { wellnessTabs };
export type { WellnessTab };

export function WellnessScores({ activeTab, onTabChange }: WellnessScoresProps) {
  return (
    <div className="lg:col-span-2 bg-surface-container-lowest p-10 rounded-[2rem] shadow-sm">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <div>
          <h3 className="text-2xl font-extrabold font-headline text-on-surface">Family Wellness Scores</h3>
          <p className="text-sm text-on-surface-variant mt-1">Weekly wellness trends across all members</p>
        </div>
        <div className="flex items-center gap-1 bg-surface-container p-1.5 rounded-full">
          {wellnessTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${activeTab === tab ? 'bg-surface-container-lowest text-primary shadow-sm' : 'text-on-surface-variant hover:text-primary'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Wave Chart */}
      <div className="relative h-48 w-full">
        <div className="absolute inset-0 flex flex-col justify-between border-l border-b border-outline-variant/10">
          <div className="w-full border-t border-outline-variant/5 relative"><span className="absolute -left-8 -top-2 text-[10px] text-on-surface-variant">100</span></div>
          <div className="w-full border-t border-outline-variant/5 relative"><span className="absolute -left-8 -top-2 text-[10px] text-on-surface-variant">75</span></div>
          <div className="w-full border-t border-outline-variant/5 relative"><span className="absolute -left-8 -top-2 text-[10px] text-on-surface-variant">50</span></div>
          <div className="w-full border-t border-outline-variant/5"></div>
        </div>
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 700 180" preserveAspectRatio="none">
          <path d="M0 50 C50 45,100 55,150 42 S250 38,300 44 S400 35,450 40 S550 30,600 38 S680 32,700 28" fill="none" stroke="#066e00" strokeWidth="3" strokeLinecap="round" />
          <path d="M0 50 C50 45,100 55,150 42 S250 38,300 44 S400 35,450 40 S550 30,600 38 S680 32,700 28 V180 H0 Z" fill="url(#gradSarah)" opacity="0.1" />
          <path d="M0 35 C50 30,100 40,150 28 S250 25,300 32 S400 22,450 27 S550 18,600 24 S680 20,700 15" fill="none" stroke="#6750a4" strokeWidth="3" strokeLinecap="round" />
          <path d="M0 35 C50 30,100 40,150 28 S250 25,300 32 S400 22,450 27 S550 18,600 24 S680 20,700 15 V180 H0 Z" fill="url(#gradLeo)" opacity="0.1" />
          <path d="M0 25 C50 20,100 30,150 18 S250 15,300 22 S400 12,450 17 S550 10,600 14 S680 10,700 8" fill="none" stroke="#006c4c" strokeWidth="3" strokeLinecap="round" />
          <path d="M0 25 C50 20,100 30,150 18 S250 15,300 22 S400 12,450 17 S550 10,600 14 S680 10,700 8 V180 H0 Z" fill="url(#gradMaya)" opacity="0.1" />
          <defs>
            <linearGradient id="gradSarah" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#066e00" /><stop offset="100%" stopColor="#066e00" stopOpacity="0" /></linearGradient>
            <linearGradient id="gradLeo" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#6750a4" /><stop offset="100%" stopColor="#6750a4" stopOpacity="0" /></linearGradient>
            <linearGradient id="gradMaya" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#006c4c" /><stop offset="100%" stopColor="#006c4c" stopOpacity="0" /></linearGradient>
          </defs>
        </svg>
        <div className="absolute -bottom-8 w-full flex justify-center gap-6 text-[10px] font-bold">
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-primary inline-block"></span> Sarah</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-tertiary inline-block"></span> Leo</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-secondary inline-block"></span> Maya</span>
        </div>
      </div>
      <div className="flex justify-between text-[10px] font-bold text-on-surface-variant uppercase tracking-tighter mt-12 px-2">
        <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
      </div>
    </div>
  );
}

const defaultTimelineItems: TimelineItem[] = [
  { title: 'Sarah — Annual Check-up', date: 'Nov 15, 2024', icon: 'stethoscope', color: 'bg-primary/10 text-primary' },
  { title: 'Leo — Sports Physical', date: 'Nov 20, 2024', icon: 'sports', color: 'bg-tertiary/10 text-tertiary' },
  { title: 'Maya — Pediatric Visit', date: 'Nov 25, 2024', icon: 'child_care', color: 'bg-secondary/10 text-secondary' },
  { title: 'Leo — Dental Cleaning', date: 'Dec 10, 2024', icon: 'dentistry', color: 'bg-tertiary/10 text-tertiary' },
];

export function FamilyTimeline({ items = defaultTimelineItems }: { items?: TimelineItem[] }) {
  return (
    <div className="bg-surface-container-lowest p-8 rounded-[2rem] shadow-sm">
      <h3 className="font-headline font-bold text-xl text-on-surface mb-6 flex items-center gap-2">
        <span className="material-symbols-outlined text-primary">timeline</span>
        Family Timeline
      </h3>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.title} className="flex items-center gap-4 p-4 rounded-2xl bg-surface-container/50 hover:bg-surface-container transition-colors">
            <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center flex-shrink-0`}>
              <span className="material-symbols-outlined text-lg">{item.icon}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm text-on-surface truncate">{item.title}</p>
              <p className="text-xs text-on-surface-variant">{item.date}</p>
            </div>
            <span className="material-symbols-outlined text-on-surface-variant text-lg">chevron_right</span>
          </div>
        ))}
      </div>
      <button className="w-full mt-4 bg-surface-container hover:bg-surface-container-high text-on-surface font-bold py-3 rounded-2xl transition-colors flex items-center justify-center gap-2 text-sm">
        <span className="material-symbols-outlined text-lg">calendar_month</span>
        View Full Calendar
      </button>
    </div>
  );
}
