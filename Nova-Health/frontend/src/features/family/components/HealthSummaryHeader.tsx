import React from 'react';
import { Button } from '@/components/ui/button';
import { MemberData } from './health-summary-data';

interface HealthSummaryHeaderProps {
  member: MemberData;
  onBack?: () => void;
}

export function HealthSummaryHeader({ member, onBack }: HealthSummaryHeaderProps) {
  return (
    <section>
      <div className="flex items-center gap-2 mb-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="p-2 rounded-full hover:bg-surface-container transition-colors"
        >
          <span className="material-symbols-outlined text-on-surface-variant">arrow_back</span>
        </Button>
        <span className="text-xs font-bold text-primary uppercase tracking-widest">Health Summary</span>
      </div>
      {/* Member Banner */}
      <div className={`bg-gradient-to-r ${member.gradient} rounded-[2rem] p-8 text-white`}>
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <span className="material-symbols-outlined text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              {member.avatar}
            </span>
          </div>
          <div>
            <h2 className="text-3xl font-extrabold font-headline">{member.name}</h2>
            <p className="text-white/80 mt-1">{member.role} • Health Summary</p>
          </div>
        </div>
      </div>
    </section>
  );
}
