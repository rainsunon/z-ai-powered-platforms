import React from 'react';

const scheduleItems = [
  { time: '6:00 AM', icon: 'wb_sunny', title: 'Wake Up & Morning Light', description: 'Get 10 min of natural sunlight to reset circadian rhythm', category: 'Circadian', status: 'completed' },
  { time: '6:30 AM', icon: 'self_improvement', title: 'Morning Meditation', description: '15-minute guided breathing session', category: 'Mindfulness', status: 'completed' },
  { time: '7:00 AM', icon: 'restaurant', title: 'Balanced Breakfast', description: 'High-protein meal: eggs, avocado, whole grain toast', category: 'Nutrition', status: 'completed' },
  { time: '7:45 AM', icon: 'medication', title: 'Morning Medications', description: 'Vitamin D3 + Omega-3 supplement', category: 'Medical', status: 'completed' },
  { time: '9:00 AM', icon: 'directions_run', title: 'Cardio Exercise', description: '30-minute jog or cycling session', category: 'Fitness', status: 'current' },
  { time: '12:00 PM', icon: 'lunch_dining', title: 'Lunch Break', description: 'Mediterranean-style meal with leafy greens', category: 'Nutrition', status: 'upcoming' },
  { time: '2:00 PM', icon: 'water_drop', title: 'Hydration Check', description: 'Ensure 4+ glasses consumed by now', category: 'Hydration', status: 'upcoming' },
  { time: '3:30 PM', icon: 'directions_walk', title: 'Afternoon Walk', description: '15-minute walk to boost energy & circulation', category: 'Fitness', status: 'upcoming' },
  { time: '6:00 PM', icon: 'dinner_dining', title: 'Dinner', description: 'Light protein with vegetables, avoid heavy carbs', category: 'Nutrition', status: 'upcoming' },
  { time: '8:00 PM', icon: 'medication', title: 'Evening Medications', description: 'Magnesium supplement for sleep support', category: 'Medical', status: 'upcoming' },
  { time: '9:00 PM', icon: 'smartphone', title: 'Digital Sunset', description: 'Reduce blue light exposure, enable night mode', category: 'Circadian', status: 'upcoming' },
  { time: '10:00 PM', icon: 'bedtime', title: 'Bedtime Routine', description: 'Wind down with reading or gentle stretching', category: 'Sleep', status: 'upcoming' },
];

const categoryColors: Record<string, string> = {
  Circadian: 'bg-amber-100 text-amber-700',
  Mindfulness: 'bg-purple-100 text-purple-700',
  Nutrition: 'bg-green-100 text-green-700',
  Medical: 'bg-red-100 text-red-700',
  Fitness: 'bg-blue-100 text-blue-700',
  Hydration: 'bg-cyan-100 text-cyan-700',
  Sleep: 'bg-indigo-100 text-indigo-700',
};

const bioMetrics = [
  { icon: 'favorite', label: 'Heart Rate', value: '72 BPM', status: 'Normal' },
  { icon: 'thermostat', label: 'Body Temp', value: '98.4°F', status: 'Normal' },
  { icon: 'battery_charging_full', label: 'Energy Level', value: 'High', status: '82%' },
  { icon: 'nights_stay', label: 'Sleep Score', value: '87/100', status: 'Good' },
];

export function DailySchedule() {
  const completedCount = scheduleItems.filter(i => i.status === 'completed').length;
  const currentIndex = scheduleItems.findIndex(i => i.status === 'current');

  return (
    <div className="space-y-12 max-w-6xl mx-auto pb-20">
      {/* Hero */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-5xl font-extrabold font-headline tracking-tight text-on-surface mb-2">Daily Schedule</h2>
          <p className="text-on-surface-variant text-lg max-w-xl">Your bio-synced daily plan optimized for energy, nutrition, and recovery.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-surface-container-high text-primary font-bold px-6 py-3 rounded-full hover:bg-surface-container-highest transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined">edit_calendar</span> Customize
          </button>
          <button className="primary-gradient text-white font-bold px-6 py-3 rounded-full shadow-lg hover:opacity-95 transition-opacity flex items-center gap-2">
            <span className="material-symbols-outlined">auto_awesome</span> AI Optimize
          </button>
        </div>
      </div>

      {/* Bio Metrics Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {bioMetrics.map((m, i) => (
          <div key={i} className="bg-surface-container-lowest rounded-[2rem] p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center">
                <span className="material-symbols-outlined text-on-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>{m.icon}</span>
              </div>
              <p className="text-sm text-on-surface-variant font-medium">{m.label}</p>
            </div>
            <h4 className="text-2xl font-extrabold text-on-surface">{m.value}</h4>
            <p className="text-xs text-primary font-bold mt-1">{m.status}</p>
          </div>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="bg-surface-container-lowest rounded-[2rem] p-8 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-2xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>task_alt</span>
            <h3 className="text-xl font-extrabold font-headline text-on-surface">Today's Progress</h3>
          </div>
          <span className="text-2xl font-extrabold text-primary">{completedCount}/{scheduleItems.length}</span>
        </div>
        <div className="h-3 bg-surface-container rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${(completedCount / scheduleItems.length) * 100}%` }} />
        </div>
        <p className="text-sm text-on-surface-variant mt-2">{Math.round((completedCount / scheduleItems.length) * 100)}% of daily tasks completed</p>
      </div>

      {/* Timeline */}
      <div>
        <h3 className="text-2xl font-extrabold font-headline text-on-surface mb-6">Schedule Timeline</h3>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-[27px] top-0 bottom-0 w-0.5 bg-outline-variant" />

          <div className="space-y-2">
            {scheduleItems.map((item, i) => (
              <div key={i} className={`relative flex items-start gap-5 p-5 rounded-2xl transition-all ${item.status === 'current' ? 'bg-primary-container/30 border border-primary/20' : 'hover:bg-surface-container'}`}>
                {/* Timeline dot */}
                <div className={`relative z-10 w-[14px] h-[14px] rounded-full mt-1.5 shrink-0 border-2 ${
                  item.status === 'completed' ? 'bg-primary border-primary' :
                  item.status === 'current' ? 'bg-white border-primary ring-4 ring-primary/20' :
                  'bg-surface-container-lowest border-outline-variant'
                }`}>
                  {item.status === 'completed' && (
                    <span className="material-symbols-outlined text-white text-[10px] absolute -top-[1px] -left-[1px]">check</span>
                  )}
                </div>

                {/* Time */}
                <div className="w-20 shrink-0">
                  <p className={`text-sm font-bold ${item.status === 'current' ? 'text-primary' : 'text-on-surface-variant'}`}>{item.time}</p>
                </div>

                {/* Icon */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.status === 'completed' ? 'bg-primary/10' : 'bg-primary-container'}`}>
                  <span className={`material-symbols-outlined ${item.status === 'completed' ? 'text-primary' : 'text-on-primary-container'}`} style={{ fontVariationSettings: "'FILL' 1" }}>{item.icon}</span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className={`font-bold text-sm ${item.status === 'completed' ? 'text-on-surface/60 line-through' : 'text-on-surface'}`}>{item.title}</h4>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${categoryColors[item.category] || 'bg-gray-100 text-gray-700'}`}>{item.category}</span>
                  </div>
                  <p className="text-xs text-on-surface-variant">{item.description}</p>
                </div>

                {/* Status indicator */}
                {item.status === 'current' && (
                  <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full shrink-0">Now</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
