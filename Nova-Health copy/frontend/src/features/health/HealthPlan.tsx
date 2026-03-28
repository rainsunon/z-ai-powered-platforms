import React from 'react';

const planPhases = [
  {
    phase: 1,
    title: 'Foundation',
    status: 'completed',
    duration: 'Weeks 1–4',
    goals: [
      { title: 'Establish sleep routine (10 PM–6 AM)', completed: true },
      { title: 'Daily 20-min walks', completed: true },
      { title: 'Eliminate processed sugars', completed: true },
      { title: 'Begin hydration tracking', completed: true },
    ],
  },
  {
    phase: 2,
    title: 'Build Momentum',
    status: 'current',
    duration: 'Weeks 5–8',
    goals: [
      { title: 'Increase cardio to 30 min, 5x/week', completed: true },
      { title: 'Add strength training 3x/week', completed: false },
      { title: 'Mediterranean diet adoption', completed: false },
      { title: 'Start mindfulness practice', completed: true },
    ],
  },
  {
    phase: 3,
    title: 'Optimize',
    status: 'upcoming',
    duration: 'Weeks 9–12',
    goals: [
      { title: 'HIIT training 2x/week', completed: false },
      { title: 'Advanced sleep optimization', completed: false },
      { title: 'Stress management mastery', completed: false },
      { title: 'Comprehensive lab review', completed: false },
    ],
  },
];

const healthMetrics = [
  { icon: 'monitor_weight', label: 'Weight', value: '168 lbs', change: '-4 lbs', trend: 'down' },
  { icon: 'favorite', label: 'Resting HR', value: '68 BPM', change: '-6 BPM', trend: 'down' },
  { icon: 'bloodtype', label: 'Blood Pressure', value: '118/76', change: 'Improved', trend: 'down' },
  { icon: 'labs', label: 'Cholesterol', value: '195', change: '-15', trend: 'down' },
];

const weeklyFocus = [
  { day: 'Mon', focus: 'Cardio + Meal Prep', icon: 'directions_run' },
  { day: 'Tue', focus: 'Strength Upper Body', icon: 'fitness_center' },
  { day: 'Wed', focus: 'Active Recovery + Yoga', icon: 'self_improvement' },
  { day: 'Thu', focus: 'Strength Lower Body', icon: 'fitness_center' },
  { day: 'Fri', focus: 'Cardio + Flexibility', icon: 'directions_run' },
  { day: 'Sat', focus: 'Outdoor Activity', icon: 'hiking' },
  { day: 'Sun', focus: 'Rest & Reflection', icon: 'spa' },
];

export function HealthPlan() {
  const currentPhase = planPhases.find(p => p.status === 'current')!;
  const phaseProgress = Math.round(
    (currentPhase.goals.filter(g => g.completed).length / currentPhase.goals.length) * 100
  );

  return (
    <div className="space-y-12 max-w-6xl mx-auto pb-20">
      {/* Hero */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-5xl font-extrabold font-headline tracking-tight text-on-surface mb-2">Health Plan</h2>
          <p className="text-on-surface-variant text-lg max-w-xl">Your personalized vitality roadmap — AI-curated and physician-approved.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-surface-container-high text-primary font-bold px-6 py-3 rounded-full hover:bg-surface-container-highest transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined">download</span> Export Plan
          </button>
          <button className="primary-gradient text-white font-bold px-6 py-3 rounded-full shadow-lg hover:opacity-95 transition-opacity flex items-center gap-2">
            <span className="material-symbols-outlined">auto_awesome</span> Recalibrate
          </button>
        </div>
      </div>

      {/* Phase Progress */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Current Phase — Large Card */}
        <div className="md:col-span-2 bg-primary-gradient rounded-[2rem] p-10 text-white overflow-hidden relative shadow-lg">
          <div className="relative z-10">
            <p className="text-sm font-medium opacity-80 uppercase tracking-widest mb-2">Phase {currentPhase.phase} • {currentPhase.duration}</p>
            <h3 className="text-4xl font-extrabold tracking-tight mb-2">{currentPhase.title}</h3>
            <p className="text-sm opacity-70 mb-6">{phaseProgress}% complete — {currentPhase.goals.filter(g => !g.completed).length} goals remaining</p>
            <div className="h-3 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white rounded-full transition-all" style={{ width: `${phaseProgress}%` }} />
            </div>
          </div>
        </div>

        {/* Health Improvements */}
        <div className="md:col-span-2 grid grid-cols-2 gap-4">
          {healthMetrics.map((m, i) => (
            <div key={i} className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-primary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>{m.icon}</span>
                <p className="text-xs text-on-surface-variant font-medium">{m.label}</p>
              </div>
              <h4 className="text-xl font-extrabold text-on-surface">{m.value}</h4>
              <p className="text-xs text-primary font-bold mt-1 flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">trending_down</span> {m.change}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Phase Roadmap */}
      <div>
        <h3 className="text-2xl font-extrabold font-headline text-on-surface mb-6">Phase Roadmap</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {planPhases.map((phase) => (
            <div key={phase.phase} className={`rounded-[2rem] p-8 shadow-sm border-2 transition-all ${
              phase.status === 'current' ? 'bg-primary-container/20 border-primary/30' :
              phase.status === 'completed' ? 'bg-surface-container-lowest border-primary/10' :
              'bg-surface-container-lowest border-transparent opacity-70'
            }`}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-extrabold ${
                  phase.status === 'completed' ? 'bg-primary text-white' :
                  phase.status === 'current' ? 'bg-primary-container text-on-primary-container' :
                  'bg-surface-container text-on-surface-variant'
                }`}>
                  {phase.status === 'completed' ? (
                    <span className="material-symbols-outlined text-lg">check</span>
                  ) : phase.phase}
                </div>
                <div>
                  <h4 className="font-bold text-on-surface">{phase.title}</h4>
                  <p className="text-xs text-on-surface-variant">{phase.duration}</p>
                </div>
              </div>
              <div className="space-y-2">
                {phase.goals.map((goal, gi) => (
                  <div key={gi} className="flex items-center gap-3">
                    <span className={`material-symbols-outlined text-base ${goal.completed ? 'text-primary' : 'text-outline'}`} style={{ fontVariationSettings: goal.completed ? "'FILL' 1" : undefined }}>
                      {goal.completed ? 'check_circle' : 'radio_button_unchecked'}
                    </span>
                    <p className={`text-sm ${goal.completed ? 'text-on-surface/60 line-through' : 'text-on-surface'}`}>{goal.title}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Focus */}
      <div className="bg-surface-container-lowest rounded-[2rem] p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <span className="material-symbols-outlined text-2xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>calendar_month</span>
          <h3 className="text-xl font-extrabold font-headline text-on-surface">This Week's Focus</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-7 gap-3">
          {weeklyFocus.map((d, i) => (
            <div key={i} className={`text-center p-4 rounded-2xl transition-all ${i === 0 ? 'bg-primary-container' : 'bg-surface-container hover:bg-surface-container-high'}`}>
              <p className={`text-xs font-bold uppercase mb-2 ${i === 0 ? 'text-on-primary-container' : 'text-on-surface-variant'}`}>{d.day}</p>
              <span className={`material-symbols-outlined text-2xl mb-2 block ${i === 0 ? 'text-on-primary-container' : 'text-on-surface-variant'}`} style={{ fontVariationSettings: "'FILL' 1" }}>{d.icon}</span>
              <p className={`text-[10px] font-medium ${i === 0 ? 'text-on-primary-container' : 'text-on-surface-variant'}`}>{d.focus}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
