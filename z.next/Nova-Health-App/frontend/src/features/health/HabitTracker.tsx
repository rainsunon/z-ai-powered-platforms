import React from 'react';

const habits = [
  { id: 1, icon: 'water_drop', title: 'Drink Water', target: '8 glasses', completed: 6, total: 8, streak: 14, time: 'All Day', color: 'bg-cyan-500' },
  { id: 2, icon: 'directions_run', title: 'Exercise', target: '30 min', completed: 1, total: 1, streak: 7, time: 'Morning', color: 'bg-green-500' },
  { id: 3, icon: 'self_improvement', title: 'Meditate', target: '15 min', completed: 1, total: 1, streak: 21, time: 'Morning', color: 'bg-purple-500' },
  { id: 4, icon: 'restaurant', title: 'Healthy Eating', target: '3 meals', completed: 2, total: 3, streak: 5, time: 'All Day', color: 'bg-orange-500' },
  { id: 5, icon: 'book', title: 'Read', target: '20 pages', completed: 0, total: 1, streak: 3, time: 'Evening', color: 'bg-blue-500' },
  { id: 6, icon: 'bedtime', title: 'Sleep by 10 PM', target: 'On time', completed: 0, total: 1, streak: 9, time: 'Night', color: 'bg-indigo-500' },
  { id: 7, icon: 'mood', title: 'Journal', target: '1 entry', completed: 1, total: 1, streak: 12, time: 'Evening', color: 'bg-pink-500' },
];

const weeklyGrid = [
  { day: 'Mon', habits: [true, true, true, true, false, true, true] },
  { day: 'Tue', habits: [true, true, true, false, true, true, true] },
  { day: 'Wed', habits: [true, false, true, true, true, true, false] },
  { day: 'Thu', habits: [true, true, true, true, true, false, true] },
  { day: 'Fri', habits: [false, true, true, true, true, true, true] },
  { day: 'Sat', habits: [true, true, false, true, false, true, true] },
  { day: 'Sun', habits: [true, true, true, true, true, true, true] },
];

export function HabitTracker() {
  const todayCompleted = habits.filter(h => h.completed >= h.total).length;
  const todayTotal = habits.length;
  const dailyScore = Math.round((todayCompleted / todayTotal) * 100);
  const longestStreak = Math.max(...habits.map(h => h.streak));

  return (
    <div className="space-y-12 max-w-6xl mx-auto pb-20">
      {/* Hero */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-5xl font-extrabold font-headline tracking-tight text-on-surface mb-2">Habit Tracker</h2>
          <p className="text-on-surface-variant text-lg max-w-xl">Build healthy routines with streak tracking, daily scores, and consistency insights.</p>
        </div>
        <button className="primary-gradient text-white font-bold px-6 py-3 rounded-full shadow-lg hover:opacity-95 transition-opacity flex items-center gap-2">
          <span className="material-symbols-outlined">add</span> Add Habit
        </button>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Daily Score — Large Card */}
        <div className="md:col-span-2 bg-primary-gradient rounded-[2rem] p-10 text-white flex items-center gap-8 overflow-hidden relative shadow-lg">
          <div className="relative z-10 flex items-center gap-8">
            <div className="w-32 h-32 rounded-full border-[6px] border-white/30 flex items-center justify-center relative">
              <div className="text-center">
                <span className="text-5xl font-extrabold">{dailyScore}</span>
                <p className="text-[10px] uppercase tracking-widest opacity-70 mt-1">Score</p>
              </div>
              <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="46" fill="none" stroke="white" strokeWidth="4" strokeDasharray={`${dailyScore * 2.89} 289`} strokeLinecap="round" opacity="0.9" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium opacity-80 uppercase tracking-widest mb-1">Today's Habits</p>
              <h3 className="text-3xl font-extrabold tracking-tight mb-1">{todayCompleted}/{todayTotal} Done</h3>
              <p className="text-sm opacity-70">Great progress — keep it up!</p>
            </div>
          </div>
        </div>

        {/* Longest Streak */}
        <div className="bg-surface-container-lowest rounded-[2rem] p-8 flex flex-col justify-between shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-tertiary-container flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-2xl text-on-tertiary-container" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
          </div>
          <div>
            <h4 className="text-3xl font-extrabold text-on-surface">{longestStreak}d</h4>
            <p className="text-on-surface-variant text-sm mt-1">Longest Streak</p>
          </div>
        </div>

        {/* Total Habits */}
        <div className="bg-surface-container-lowest rounded-[2rem] p-8 flex flex-col justify-between shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-secondary-container flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-2xl text-on-secondary-container" style={{ fontVariationSettings: "'FILL' 1" }}>checklist</span>
          </div>
          <div>
            <h4 className="text-3xl font-extrabold text-on-surface">{todayTotal}</h4>
            <p className="text-on-surface-variant text-sm mt-1">Active Habits</p>
          </div>
        </div>
      </div>

      {/* Habits List */}
      <div>
        <h3 className="text-2xl font-extrabold font-headline text-on-surface mb-6">Today's Habits</h3>
        <div className="space-y-4">
          {habits.map(habit => {
            const isDone = habit.completed >= habit.total;
            return (
              <div key={habit.id} className={`bg-surface-container-lowest rounded-[2rem] p-6 flex items-center gap-6 shadow-sm transition-all ${isDone ? 'opacity-70' : 'hover:shadow-md'}`}>
                {/* Checkbox */}
                <button className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-all ${isDone ? 'bg-primary' : 'bg-surface-container border-2 border-outline-variant hover:border-primary'}`}>
                  {isDone ? (
                    <span className="material-symbols-outlined text-white text-2xl">check</span>
                  ) : (
                    <span className="material-symbols-outlined text-on-surface-variant text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>{habit.icon}</span>
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className={`font-bold text-on-surface ${isDone ? 'line-through opacity-60' : ''}`}>{habit.title}</h4>
                    <span className="text-xs font-bold text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-full">{habit.time}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-on-surface-variant">
                    <span>{habit.completed}/{habit.total} ({habit.target})</span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-base text-orange-500" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
                      {habit.streak} day streak
                    </span>
                  </div>
                  {habit.total > 1 && (
                    <div className="mt-3 h-2 bg-surface-container rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${(habit.completed / habit.total) * 100}%` }} />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Weekly Consistency Grid */}
      <div className="bg-surface-container-lowest rounded-[2rem] p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <span className="material-symbols-outlined text-2xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>grid_view</span>
          <h3 className="text-xl font-extrabold font-headline text-on-surface">Weekly Consistency</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left text-xs text-on-surface-variant font-medium pb-3 pr-4">Habit</th>
                {weeklyGrid.map((d, i) => (
                  <th key={i} className="text-center text-xs text-on-surface-variant font-medium pb-3 px-2">{d.day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {habits.map((habit, hi) => (
                <tr key={hi}>
                  <td className="text-sm font-medium text-on-surface py-2 pr-4 whitespace-nowrap">
                    <span className="material-symbols-outlined text-base align-middle mr-1" style={{ fontVariationSettings: "'FILL' 1" }}>{habit.icon}</span>
                    {habit.title}
                  </td>
                  {weeklyGrid.map((d, di) => (
                    <td key={di} className="text-center py-2 px-2">
                      <div className={`w-7 h-7 rounded-lg mx-auto flex items-center justify-center ${d.habits[hi] ? 'bg-primary/20' : 'bg-surface-container'}`}>
                        {d.habits[hi] && <span className="material-symbols-outlined text-primary text-sm">check</span>}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
