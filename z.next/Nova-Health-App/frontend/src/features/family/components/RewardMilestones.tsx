import React from 'react';

interface Milestone {
  status: 'unlocked' | 'next' | 'locked';
  title: string;
  subtitle?: string;
  icon?: string;
}

interface RewardMilestonesProps {
  progress?: number;
  milestones?: Milestone[];
}

const defaultMilestones: Milestone[] = [
  { status: 'unlocked', title: 'Extra Screen Time' },
  { status: 'unlocked', title: 'Picnic in Park' },
  { status: 'next', title: 'Healthy Dinner Night Out', subtitle: '15,750 steps to go', icon: 'restaurant' },
  { status: 'locked', title: 'Digital-Free Weekend' },
];

export function RewardMilestones({
  progress = 72,
  milestones = defaultMilestones
}: RewardMilestonesProps) {
  return (
    <section className="bg-surface-container-highest rounded-[2.5rem] p-10">
      <div className="text-center mb-12">
        <h3 className="font-headline text-2xl font-extrabold mb-2">Road to Rewards</h3>
        <p className="text-on-surface-variant">Keep going to unlock family experiences!</p>
      </div>
      <div className="relative pt-12">
        {/* Progress Bar Track */}
        <div className="absolute top-[4.25rem] left-0 w-full h-2 bg-surface-variant rounded-full overflow-hidden">
          <div className="h-full primary-gradient" style={{ width: `${progress}%` }}></div>
        </div>
        {/* Milestone Points */}
        <div className="flex justify-between items-start relative z-10">
          {milestones.map((milestone, index) => (
            <div key={index} className="flex flex-col items-center">
              {milestone.status === 'unlocked' && (
                <>
                  <div className="w-12 h-12 rounded-full primary-gradient flex items-center justify-center text-white ring-4 ring-white mb-4">
                    <span className="material-symbols-outlined">check</span>
                  </div>
                  <div className="text-center max-w-[120px]">
                    <h4 className="text-xs font-bold uppercase tracking-wider mb-1">UNLOCKED</h4>
                    <p className="text-sm font-medium">{milestone.title}</p>
                  </div>
                </>
              )}
              {milestone.status === 'next' && (
                <>
                  <div className="w-14 h-14 rounded-full bg-surface-container-lowest border-4 border-primary-container flex items-center justify-center text-primary-container mb-4 shadow-lg scale-110">
                    <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                      {milestone.icon}
                    </span>
                  </div>
                  <div className="text-center max-w-[140px]">
                    <h4 className="text-xs font-bold text-primary-container uppercase tracking-wider mb-1">NEXT REWARD</h4>
                    <p className="text-base font-bold">{milestone.title}</p>
                    {milestone.subtitle && (
                      <p className="text-[10px] text-on-surface-variant mt-1">{milestone.subtitle}</p>
                    )}
                  </div>
                </>
              )}
              {milestone.status === 'locked' && (
                <>
                  <div className="w-12 h-12 rounded-full bg-surface-variant flex items-center justify-center text-on-surface-variant ring-4 ring-white mb-4">
                    <span className="material-symbols-outlined">lock</span>
                  </div>
                  <div className="text-center max-w-[120px]">
                    <h4 className="text-xs font-bold uppercase tracking-wider mb-1 opacity-50">Locked</h4>
                    <p className="text-sm font-medium opacity-50">{milestone.title}</p>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
