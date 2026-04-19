import React from 'react';
import { LeaderboardMember } from './wellness-challenge-data';

interface LeaderboardProps {
  members?: LeaderboardMember[];
}

export function Leaderboard({ members }: LeaderboardProps) {
  return (
    <section className="bg-surface-container-high rounded-[2rem] p-8">
      <div className="flex items-center justify-between mb-8">
        <h3 className="font-headline text-xl font-bold">Leaderboard</h3>
        <span className="material-symbols-outlined text-primary">leaderboard</span>
      </div>
      <div className="space-y-4">
        {members?.map((member) => (
          <div key={member.name} className="flex items-center gap-4 p-4 rounded-2xl bg-surface-container-lowest transition-transform hover:scale-[1.02]">
            <div className="relative">
              <div className={`w-12 h-12 rounded-full ${member.rank === '1st' ? 'bg-primary border-2 border-primary-container' : member.rank === '2nd' ? 'bg-tertiary' : 'bg-secondary'} flex items-center justify-center text-white`}>
                <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  {member.rank === '1st' ? 'face_4' : member.rank === '2nd' ? 'face_3' : 'face_5'}
                </span>
              </div>
              <div className={`absolute -top-1 -right-1 ${member.rankBg} text-[10px] font-bold px-1.5 py-0.5 rounded-full ring-2 ring-white`}>
                {member.rank}
              </div>
            </div>
            <div className="flex-1">
              <p className="font-bold text-sm">{member.name}</p>
              <p className="text-xs text-on-surface-variant">{member.steps} steps</p>
            </div>
            {member.badgeFilled && (
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                {member.badge}
              </span>
            )}
            {member.tag && (
              <span className={`${member.tagBg} text-[10px] px-2 py-1 rounded-full font-bold`}>
                {member.tag}
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
