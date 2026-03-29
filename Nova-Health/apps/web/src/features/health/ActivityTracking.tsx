import React from 'react';

const weeklySteps = [
  { day: 'Mon', steps: 8420 },
  { day: 'Tue', steps: 12100 },
  { day: 'Wed', steps: 6800 },
  { day: 'Thu', steps: 10500 },
  { day: 'Fri', steps: 9200 },
  { day: 'Sat', steps: 14300 },
  { day: 'Sun', steps: 11000 },
];

const recentActivities = [
  { icon: 'directions_run', name: 'Morning Run', duration: '32 min', calories: 340, time: '7:15 AM' },
  { icon: 'fitness_center', name: 'Strength Training', duration: '45 min', calories: 280, time: '5:30 PM' },
  { icon: 'directions_walk', name: 'Evening Walk', duration: '25 min', calories: 120, time: '8:00 PM' },
  { icon: 'pool', name: 'Swimming', duration: '40 min', calories: 400, time: 'Yesterday' },
  { icon: 'self_improvement', name: 'Yoga Session', duration: '30 min', calories: 150, time: 'Yesterday' },
];

export function ActivityTracking() {
  const totalSteps = weeklySteps.reduce((s, d) => s + d.steps, 0);
  const avgSteps = Math.round(totalSteps / weeklySteps.length);
  const maxSteps = Math.max(...weeklySteps.map(d => d.steps));

  return (
    <div className="space-y-12 max-w-6xl mx-auto pb-20">
      {/* Hero */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-5xl font-extrabold font-headline tracking-tight text-on-surface mb-2">Activity Tracking</h2>
          <p className="text-on-surface-variant text-lg max-w-xl">Monitor your daily movement, workouts, and fitness goals all in one place.</p>
        </div>
        <div className="flex items-center gap-3 bg-surface-container p-1.5 rounded-full">
          <button className="px-6 py-2 rounded-full text-sm font-bold text-on-surface-variant hover:text-on-surface transition-all">Daily</button>
          <button className="px-6 py-2 rounded-full text-sm font-bold bg-surface-container-lowest text-on-surface shadow-sm transition-all">Weekly</button>
          <button className="px-6 py-2 rounded-full text-sm font-bold text-on-surface-variant hover:text-on-surface transition-all">Monthly</button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Steps — Large Card */}
        <div className="md:col-span-2 bg-primary-gradient rounded-[2rem] p-10 text-white flex flex-col justify-between overflow-hidden relative shadow-lg">
          <div className="relative z-10">
            <p className="text-sm font-medium opacity-80 mb-1 uppercase tracking-widest">Today's Steps</p>
            <h3 className="text-5xl font-extrabold tracking-tighter">10,482</h3>
            <div className="mt-4">
              <div className="h-2 bg-white/20 rounded-full overflow-hidden w-48">
                <div className="h-full bg-white rounded-full" style={{ width: '87%' }}></div>
              </div>
              <p className="text-xs opacity-70 mt-2">87% of 12,000 goal</p>
            </div>
          </div>
          <div className="mt-8 relative z-10 flex items-center gap-2 text-sm bg-white/10 w-fit px-3 py-1.5 rounded-full backdrop-blur-md">
            <span className="material-symbols-outlined text-[18px]">trending_up</span>
            <span>15% more than yesterday</span>
          </div>
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
        </div>

        <div className="bg-surface-container-lowest p-8 rounded-3xl shadow-sm border-b-4 border-error/60">
          <div className="flex justify-between items-start mb-4">
            <span className="material-symbols-outlined text-error bg-error-container p-3 rounded-2xl">local_fire_department</span>
            <span className="text-xs font-bold text-error bg-error-container px-2 py-1 rounded-full">+22%</span>
          </div>
          <p className="text-on-surface-variant text-sm font-medium mb-1">Calories Burned</p>
          <h3 className="text-3xl font-bold font-headline">1,847 <span className="text-lg font-normal text-on-surface-variant">kcal</span></h3>
        </div>

        <div className="bg-surface-container-lowest p-8 rounded-3xl shadow-sm border-b-4 border-secondary">
          <div className="flex justify-between items-start mb-4">
            <span className="material-symbols-outlined text-secondary bg-secondary-container p-3 rounded-2xl">timer</span>
            <span className="text-xs font-bold text-secondary bg-secondary-container px-2 py-1 rounded-full">On track</span>
          </div>
          <p className="text-on-surface-variant text-sm font-medium mb-1">Active Minutes</p>
          <h3 className="text-3xl font-bold font-headline">78 <span className="text-lg font-normal text-on-surface-variant">min</span></h3>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-12 gap-8">
        {/* Weekly Steps Chart (8 cols) */}
        <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest p-10 rounded-3xl shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h4 className="text-2xl font-bold font-headline">Weekly Activity</h4>
              <p className="text-on-surface-variant text-sm">Daily step count for the current week</p>
            </div>
            <span className="text-xs font-bold text-primary bg-primary-container/20 px-3 py-1.5 rounded-full">Avg {avgSteps.toLocaleString()} steps</span>
          </div>
          <div className="flex items-end justify-between gap-3 h-56">
            {weeklySteps.map((d) => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-[10px] font-bold text-on-surface-variant">{(d.steps / 1000).toFixed(1)}k</span>
                <div className="w-full rounded-xl overflow-hidden bg-surface-container-low" style={{ height: '200px' }}>
                  <div
                    className={`w-full rounded-xl transition-all ${d.steps >= 10000 ? 'bg-primary' : d.steps >= 7000 ? 'bg-secondary' : 'bg-tertiary'}`}
                    style={{ height: `${(d.steps / maxSteps) * 100}%`, marginTop: `${100 - (d.steps / maxSteps) * 100}%` }}
                  ></div>
                </div>
                <span className="text-[10px] font-bold text-on-surface-variant uppercase">{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Goals Progress (4 cols) */}
        <div className="col-span-12 lg:col-span-4 bg-surface-container-high p-10 rounded-3xl">
          <h4 className="text-2xl font-bold font-headline mb-8">Daily Goals</h4>
          <div className="space-y-8">
            <div>
              <div className="flex justify-between text-sm font-bold mb-2">
                <span className="flex items-center gap-2"><span className="material-symbols-outlined text-primary text-[18px]">footprint</span> Steps</span>
                <span className="text-primary">10,482 / 12,000</span>
              </div>
              <div className="h-3 bg-surface-container-low rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: '87%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm font-bold mb-2">
                <span className="flex items-center gap-2"><span className="material-symbols-outlined text-error text-[18px]">local_fire_department</span> Calories</span>
                <span className="text-error">1,847 / 2,200</span>
              </div>
              <div className="h-3 bg-surface-container-low rounded-full overflow-hidden">
                <div className="h-full bg-error rounded-full" style={{ width: '84%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm font-bold mb-2">
                <span className="flex items-center gap-2"><span className="material-symbols-outlined text-secondary text-[18px]">timer</span> Active Min</span>
                <span className="text-secondary">78 / 90</span>
              </div>
              <div className="h-3 bg-surface-container-low rounded-full overflow-hidden">
                <div className="h-full bg-secondary rounded-full" style={{ width: '87%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm font-bold mb-2">
                <span className="flex items-center gap-2"><span className="material-symbols-outlined text-tertiary text-[18px]">straighten</span> Distance</span>
                <span className="text-tertiary">4.8 / 6.0 mi</span>
              </div>
              <div className="h-3 bg-surface-container-low rounded-full overflow-hidden">
                <div className="h-full bg-tertiary rounded-full" style={{ width: '80%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activities (Full width) */}
        <div className="col-span-12 bg-surface-container-lowest p-10 rounded-3xl shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h4 className="text-2xl font-bold font-headline">Recent Activities</h4>
            <button className="text-primary font-bold text-sm hover:underline">View All</button>
          </div>
          <div className="divide-y divide-outline-variant/10">
            {recentActivities.map((activity, i) => (
              <div key={i} className="flex items-center justify-between py-5 hover:bg-surface-container-low/50 rounded-xl px-4 transition-colors">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-primary-container/20 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined">{activity.icon}</span>
                  </div>
                  <div>
                    <p className="font-bold text-on-surface">{activity.name}</p>
                    <p className="text-xs text-on-surface-variant">{activity.time} • {activity.duration}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-on-surface-variant">
                  <span className="material-symbols-outlined text-[16px] text-error">local_fire_department</span>
                  <span className="font-bold text-sm">{activity.calories} kcal</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
