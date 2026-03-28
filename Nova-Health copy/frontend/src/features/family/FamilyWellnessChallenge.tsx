import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const dailyGoals = [
  { icon: 'water_drop', bg: 'bg-blue-50', color: 'text-blue-500', title: '8 Glasses of Water', subtitle: 'Completed by 3 members', checked: true },
  { icon: 'bedtime', bg: 'bg-purple-50', color: 'text-purple-500', title: '7 Hours of Sleep', subtitle: 'Goal: Everyone rests', checked: false },
  { icon: 'self_improvement', bg: 'bg-orange-50', color: 'text-orange-500', title: 'Mindful Minute', subtitle: 'Pause and breathe', checked: false },
  { icon: 'nutrition', bg: 'bg-green-50', color: 'text-green-500', title: '5 Colors on Plate', subtitle: 'Veggie power only', checked: true },
];

const leaderboard = [
  { name: 'Sarah', steps: '15,400', rank: '1st', rankBg: 'bg-yellow-400', badge: 'workspace_premium', badgeStyle: 'text-primary', badgeFilled: true },
  { name: 'Leo', steps: '10,200', rank: '2nd', rankBg: 'bg-slate-300', badge: null, tag: 'MVP', tagBg: 'bg-secondary-container text-on-secondary-container' },
  { name: 'Maya', steps: '8,650', rank: '3rd', rankBg: 'bg-orange-400', badge: null, tag: 'Hot Streak', tagBg: 'bg-primary-container/20 text-primary' },
];

export function FamilyWellnessChallenge() {
  const navigate = useNavigate();
  const [goals, setGoals] = useState(dailyGoals);

  const toggleGoal = (index: number) => {
    setGoals(prev => prev.map((g, i) => i === index ? { ...g, checked: !g.checked } : g));
  };

  return (
    <div className="space-y-10 max-w-6xl mx-auto pb-20">
      {/* Hero Section: Active Challenge Header */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-surface-container-low min-h-[320px] flex items-center p-8 md:p-12">
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-container rounded-full blur-[100px] -mr-48 -mt-48"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-secondary-fixed rounded-full blur-[80px] -ml-24 -mb-24"></div>
        </div>
        <div className="relative z-10 w-full grid md:grid-cols-2 gap-8 items-center">
          <div>
            <span className="inline-block px-4 py-1.5 rounded-full bg-secondary-container text-on-secondary-container text-xs font-bold tracking-widest uppercase mb-4">Current Main Challenge</span>
            <h1 className="font-headline text-4xl md:text-5xl font-extrabold text-on-surface leading-tight mb-6 tracking-tight">Step Up Together: 50,000 Steps</h1>
            <p className="text-on-surface-variant font-medium mb-8 max-w-md">Unite the household and hit the pavement! Your collective movement fuels the family vitality meter.</p>
            <div className="flex items-center gap-6">
              <div className="flex flex-col">
                <span className="text-xs text-on-surface-variant uppercase font-bold tracking-widest">Days Remaining</span>
                <span className="text-2xl font-headline font-extrabold text-primary">04 Days</span>
              </div>
              <div className="h-10 w-[1px] bg-outline-variant/30"></div>
              <div className="flex flex-col">
                <span className="text-xs text-on-surface-variant uppercase font-bold tracking-widest">Global Rank</span>
                <span className="text-2xl font-headline font-extrabold text-primary">#12</span>
              </div>
            </div>
          </div>
          <div className="bg-white/70 backdrop-blur-2xl p-8 rounded-[2rem] shadow-xl border border-white/40">
            <div className="flex justify-between items-end mb-4">
              <h3 className="font-headline font-bold text-xl">Household Progress</h3>
              <span className="text-primary font-bold">34,250 / 50,000</span>
            </div>
            <div className="w-full h-4 bg-surface-variant rounded-full overflow-hidden mb-6">
              <div className="h-full primary-gradient rounded-full" style={{ width: '68.5%' }}></div>
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
              <div className="flex items-center justify-center h-10 w-10 rounded-full ring-4 ring-white bg-surface-container-highest text-xs font-bold">+2</div>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Family Leaderboard */}
        <section className="lg:col-span-4 bg-surface-container-high rounded-[2rem] p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-headline text-xl font-bold">Leaderboard</h3>
            <span className="material-symbols-outlined text-primary">leaderboard</span>
          </div>
          <div className="space-y-4">
            {leaderboard.map((member) => (
              <div key={member.name} className="flex items-center gap-4 p-4 rounded-2xl bg-surface-container-lowest transition-transform hover:scale-[1.02]">
                <div className="relative">
                  <div className={`w-12 h-12 rounded-full ${member.rank === '1st' ? 'bg-primary border-2 border-primary-container' : member.rank === '2nd' ? 'bg-tertiary' : 'bg-secondary'} flex items-center justify-center text-white`}>
                    <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                      {member.rank === '1st' ? 'face_4' : member.rank === '2nd' ? 'face_3' : 'face_5'}
                    </span>
                  </div>
                  <div className={`absolute -top-1 -right-1 ${member.rankBg} text-[10px] font-bold px-1.5 py-0.5 rounded-full ring-2 ring-white`}>{member.rank}</div>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-sm">{member.name}</p>
                  <p className="text-xs text-on-surface-variant">{member.steps} steps</p>
                </div>
                {member.badgeFilled && (
                  <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
                )}
                {member.tag && (
                  <span className={`${member.tagBg} text-[10px] px-2 py-1 rounded-full font-bold`}>{member.tag}</span>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Mini-Challenges Grid */}
        <section className="lg:col-span-8 bg-surface-container rounded-[2rem] p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-headline text-xl font-bold">Quick Daily Goals</h3>
            <button className="text-primary text-sm font-bold flex items-center gap-1">
              <span>Reset daily</span>
              <span className="material-symbols-outlined text-sm">autorenew</span>
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {goals.map((goal, idx) => (
              <div key={idx} className="bg-surface-container-lowest p-6 rounded-2xl border border-transparent hover:border-primary-container/30 transition-all group">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl ${goal.bg} flex items-center justify-center ${goal.color} group-hover:scale-110 transition-transform`}>
                    <span className="material-symbols-outlined text-3xl">{goal.icon}</span>
                  </div>
                  <button
                    onClick={() => toggleGoal(idx)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${goal.checked ? 'bg-primary border-primary text-white' : 'border-outline-variant hover:border-primary'}`}
                  >
                    {goal.checked && <span className="material-symbols-outlined text-[16px]">check</span>}
                  </button>
                </div>
                <h4 className="font-bold text-lg mb-1">{goal.title}</h4>
                <p className="text-sm text-on-surface-variant">{goal.subtitle}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Reward Milestones */}
      <section className="bg-surface-container-highest rounded-[2.5rem] p-10">
        <div className="text-center mb-12">
          <h3 className="font-headline text-2xl font-extrabold mb-2">Road to Rewards</h3>
          <p className="text-on-surface-variant">Keep going to unlock family experiences!</p>
        </div>
        <div className="relative pt-12">
          {/* Progress Bar Track */}
          <div className="absolute top-[4.25rem] left-0 w-full h-2 bg-surface-variant rounded-full overflow-hidden">
            <div className="h-full primary-gradient" style={{ width: '72%' }}></div>
          </div>
          {/* Milestone Points */}
          <div className="flex justify-between items-start relative z-10">
            {/* Milestone 1 - Unlocked */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full primary-gradient flex items-center justify-center text-white ring-4 ring-white mb-4">
                <span className="material-symbols-outlined">check</span>
              </div>
              <div className="text-center max-w-[120px]">
                <h4 className="text-xs font-bold uppercase tracking-wider mb-1">UNLOCKED</h4>
                <p className="text-sm font-medium">Extra Screen Time</p>
              </div>
            </div>
            {/* Milestone 2 - Unlocked */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full primary-gradient flex items-center justify-center text-white ring-4 ring-white mb-4">
                <span className="material-symbols-outlined">check</span>
              </div>
              <div className="text-center max-w-[120px]">
                <h4 className="text-xs font-bold uppercase tracking-wider mb-1">UNLOCKED</h4>
                <p className="text-sm font-medium">Picnic in Park</p>
              </div>
            </div>
            {/* Milestone 3 - Next Reward */}
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-surface-container-lowest border-4 border-primary-container flex items-center justify-center text-primary-container mb-4 shadow-lg scale-110">
                <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>restaurant</span>
              </div>
              <div className="text-center max-w-[140px]">
                <h4 className="text-xs font-bold text-primary-container uppercase tracking-wider mb-1">NEXT REWARD</h4>
                <p className="text-base font-bold">Healthy Dinner Night Out</p>
                <p className="text-[10px] text-on-surface-variant mt-1">15,750 steps to go</p>
              </div>
            </div>
            {/* Milestone 4 - Locked */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-surface-variant flex items-center justify-center text-on-surface-variant ring-4 ring-white mb-4">
                <span className="material-symbols-outlined">lock</span>
              </div>
              <div className="text-center max-w-[120px]">
                <h4 className="text-xs font-bold uppercase tracking-wider mb-1 opacity-50">Locked</h4>
                <p className="text-sm font-medium opacity-50">Digital-Free Weekend</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-center pt-8">
        <button className="w-full sm:w-auto px-10 py-5 primary-gradient text-white rounded-[1.5rem] font-headline font-bold text-lg shadow-xl hover:scale-[1.03] transition-transform active:scale-95">
          Create Custom Challenge
        </button>
        <button className="w-full sm:w-auto px-10 py-5 bg-surface-container-high text-primary rounded-[1.5rem] font-headline font-bold text-lg hover:bg-surface-container-highest transition-colors active:scale-95">
          Browse Challenge Library
        </button>
      </div>
    </div>
  );
}
