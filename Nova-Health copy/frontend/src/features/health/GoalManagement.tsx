import React from 'react';

const activeGoals = [
  { id: 1, icon: 'directions_run', title: 'Walk 10,000 Steps Daily', category: 'Fitness', progress: 78, target: '10,000 steps', current: '7,800 steps', deadline: 'Daily', streak: 12 },
  { id: 2, icon: 'bedtime', title: 'Sleep 8 Hours Nightly', category: 'Sleep', progress: 85, target: '8 hours', current: '6.8 hrs avg', deadline: 'Daily', streak: 5 },
  { id: 3, icon: 'restaurant', title: 'Eat 5 Servings of Vegetables', category: 'Nutrition', progress: 60, target: '5 servings', current: '3 servings', deadline: 'Daily', streak: 8 },
  { id: 4, icon: 'self_improvement', title: 'Meditate 15 Minutes', category: 'Mindfulness', progress: 100, target: '15 min', current: '15 min', deadline: 'Daily', streak: 21 },
  { id: 5, icon: 'water_drop', title: 'Drink 8 Glasses of Water', category: 'Hydration', progress: 50, target: '8 glasses', current: '4 glasses', deadline: 'Daily', streak: 3 },
];

const completedGoals = [
  { icon: 'monitor_weight', title: 'Lose 5 lbs This Month', completedDate: 'Oct 18, 2025' },
  { icon: 'vaccine', title: 'Complete Annual Check-up', completedDate: 'Oct 10, 2025' },
];

const aiSuggestions = [
  { icon: 'psychology', title: 'Increase step goal to 12,000', reason: 'You\'ve consistently hit 10K for 2 weeks' },
  { icon: 'schedule', title: 'Add evening stretching routine', reason: 'Your sleep quality improves with pre-bed stretching' },
];

export function GoalManagement() {
  const overallProgress = Math.round(activeGoals.reduce((s, g) => s + g.progress, 0) / activeGoals.length);

  return (
    <div className="space-y-12 max-w-6xl mx-auto pb-20">
      {/* Hero */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-5xl font-extrabold font-headline tracking-tight text-on-surface mb-2">Goal Management</h2>
          <p className="text-on-surface-variant text-lg max-w-xl">Track your health goals, monitor progress, and get AI-powered suggestions to stay on track.</p>
        </div>
        <button className="primary-gradient text-white font-bold px-6 py-3 rounded-full shadow-lg hover:opacity-95 transition-opacity flex items-center gap-2">
          <span className="material-symbols-outlined">add</span> New Goal
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Overall Progress — Large Card */}
        <div className="md:col-span-2 bg-primary-gradient rounded-[2rem] p-10 text-white flex items-center gap-8 overflow-hidden relative shadow-lg">
          <div className="relative z-10 flex items-center gap-8">
            <div className="w-32 h-32 rounded-full border-[6px] border-white/30 flex items-center justify-center relative">
              <div className="text-center">
                <span className="text-5xl font-extrabold">{overallProgress}</span>
                <p className="text-[10px] uppercase tracking-widest opacity-70 mt-1">Overall %</p>
              </div>
              <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="46" fill="none" stroke="white" strokeWidth="4" strokeDasharray={`${overallProgress * 2.89} 289`} strokeLinecap="round" opacity="0.9" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium opacity-80 uppercase tracking-widest mb-1">Daily Progress</p>
              <h3 className="text-3xl font-extrabold tracking-tight mb-1">{activeGoals.filter(g => g.progress >= 100).length}/{activeGoals.length} Complete</h3>
              <p className="text-sm opacity-70">Keep going — you're doing great!</p>
            </div>
          </div>
        </div>

        {/* Active Goals Count */}
        <div className="bg-surface-container-lowest rounded-[2rem] p-8 flex flex-col justify-between shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-secondary-container flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-2xl text-on-secondary-container" style={{ fontVariationSettings: "'FILL' 1" }}>flag</span>
          </div>
          <div>
            <h4 className="text-3xl font-extrabold text-on-surface">{activeGoals.length}</h4>
            <p className="text-on-surface-variant text-sm mt-1">Active Goals</p>
          </div>
        </div>

        {/* Longest Streak */}
        <div className="bg-surface-container-lowest rounded-[2rem] p-8 flex flex-col justify-between shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-tertiary-container flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-2xl text-on-tertiary-container" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
          </div>
          <div>
            <h4 className="text-3xl font-extrabold text-on-surface">{Math.max(...activeGoals.map(g => g.streak))}d</h4>
            <p className="text-on-surface-variant text-sm mt-1">Longest Streak</p>
          </div>
        </div>
      </div>

      {/* Active Goals List */}
      <div>
        <h3 className="text-2xl font-extrabold font-headline text-on-surface mb-6">Active Goals</h3>
        <div className="space-y-4">
          {activeGoals.map(goal => (
            <div key={goal.id} className="bg-surface-container-lowest rounded-[2rem] p-6 flex items-center gap-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-2xl bg-primary-container flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-2xl text-on-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>{goal.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h4 className="font-bold text-on-surface truncate">{goal.title}</h4>
                  <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">{goal.category}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-on-surface-variant">
                  <span>{goal.current} / {goal.target}</span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
                    {goal.streak} day streak
                  </span>
                </div>
                <div className="mt-3 h-2 bg-surface-container rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${goal.progress >= 100 ? 'bg-primary' : 'bg-primary/70'}`}
                    style={{ width: `${Math.min(goal.progress, 100)}%` }}
                  />
                </div>
              </div>
              <span className="text-2xl font-extrabold text-on-surface shrink-0">{goal.progress}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Section: AI Suggestions + Completed */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* AI Suggestions */}
        <div className="bg-surface-container-lowest rounded-[2rem] p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <span className="material-symbols-outlined text-2xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
            <h3 className="text-xl font-extrabold font-headline text-on-surface">AI Suggestions</h3>
          </div>
          <div className="space-y-4">
            {aiSuggestions.map((s, i) => (
              <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-surface-container hover:bg-surface-container-high transition-colors cursor-pointer">
                <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-on-primary-container">{s.icon}</span>
                </div>
                <div>
                  <p className="font-bold text-on-surface text-sm">{s.title}</p>
                  <p className="text-xs text-on-surface-variant mt-1">{s.reason}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Completed Goals */}
        <div className="bg-surface-container-lowest rounded-[2rem] p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <span className="material-symbols-outlined text-2xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>task_alt</span>
            <h3 className="text-xl font-extrabold font-headline text-on-surface">Completed</h3>
          </div>
          <div className="space-y-4">
            {completedGoals.map((g, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-surface-container">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>{g.icon}</span>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-on-surface text-sm">{g.title}</p>
                  <p className="text-xs text-on-surface-variant mt-0.5">Completed {g.completedDate}</p>
                </div>
                <span className="material-symbols-outlined text-primary">check_circle</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
