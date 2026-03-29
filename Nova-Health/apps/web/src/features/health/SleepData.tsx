import React from 'react';

const sleepStages = [
  { label: 'Awake', duration: '12 min', percent: 3, color: 'bg-error' },
  { label: 'Light Sleep', duration: '3h 24m', percent: 44, color: 'bg-tertiary' },
  { label: 'Deep Sleep', duration: '1h 48m', percent: 23, color: 'bg-primary' },
  { label: 'REM Sleep', duration: '2h 18m', percent: 30, color: 'bg-secondary' },
];

const weeklyData = [
  { day: 'Mon', hours: 7.2, quality: 82 },
  { day: 'Tue', hours: 6.5, quality: 68 },
  { day: 'Wed', hours: 8.1, quality: 91 },
  { day: 'Thu', hours: 7.0, quality: 78 },
  { day: 'Fri', hours: 7.8, quality: 85 },
  { day: 'Sat', hours: 9.2, quality: 94 },
  { day: 'Sun', hours: 8.4, quality: 88 },
];

export function SleepData() {
  const avgQuality = Math.round(weeklyData.reduce((s, d) => s + d.quality, 0) / weeklyData.length);
  const avgHours = (weeklyData.reduce((s, d) => s + d.hours, 0) / weeklyData.length).toFixed(1);

  return (
    <div className="space-y-12 max-w-6xl mx-auto pb-20">
      {/* Hero */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-5xl font-extrabold font-headline tracking-tight text-on-surface mb-2">Sleep Data</h2>
          <p className="text-on-surface-variant text-lg max-w-xl">Detailed analysis of your sleep patterns, stages, and environmental factors.</p>
        </div>
        <div className="flex items-center gap-3 bg-surface-container p-1.5 rounded-full">
          <button className="px-6 py-2 rounded-full text-sm font-bold text-on-surface-variant hover:text-on-surface transition-all">Last Night</button>
          <button className="px-6 py-2 rounded-full text-sm font-bold bg-surface-container-lowest text-on-surface shadow-sm transition-all">Weekly</button>
          <button className="px-6 py-2 rounded-full text-sm font-bold text-on-surface-variant hover:text-on-surface transition-all">Monthly</button>
        </div>
      </div>

      {/* Top Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sleep Score — Large Card */}
        <div className="md:col-span-2 bg-primary-gradient rounded-[2rem] p-10 text-white flex items-center gap-8 overflow-hidden relative shadow-lg">
          <div className="relative z-10 flex items-center gap-8">
            <div className="w-32 h-32 rounded-full border-[6px] border-white/30 flex items-center justify-center relative">
              <div className="text-center">
                <span className="text-5xl font-extrabold">{avgQuality}</span>
                <p className="text-[10px] uppercase tracking-widest opacity-70 mt-1">Score</p>
              </div>
              <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="46" fill="none" stroke="white" strokeWidth="4" strokeDasharray={`${avgQuality * 2.89} 289`} strokeLinecap="round" opacity="0.9" />
              </svg>
            </div>
            <div>
              <p className="text-sm opacity-80 uppercase tracking-widest mb-2">Sleep Quality</p>
              <h3 className="text-3xl font-extrabold mb-1">Excellent</h3>
              <p className="text-sm opacity-70">Avg. {avgHours} hours per night this week</p>
            </div>
          </div>
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
        </div>

        <div className="bg-surface-container-lowest p-8 rounded-3xl shadow-sm border-b-4 border-primary">
          <div className="flex justify-between items-start mb-4">
            <span className="material-symbols-outlined text-primary bg-primary-container/20 p-3 rounded-2xl">bedtime</span>
            <span className="text-xs font-bold text-primary bg-primary-container/20 px-2 py-1 rounded-full">Optimal</span>
          </div>
          <p className="text-on-surface-variant text-sm font-medium mb-1">Bedtime</p>
          <h3 className="text-3xl font-bold font-headline">10:45 <span className="text-lg font-normal text-on-surface-variant">PM</span></h3>
        </div>

        <div className="bg-surface-container-lowest p-8 rounded-3xl shadow-sm border-b-4 border-secondary">
          <div className="flex justify-between items-start mb-4">
            <span className="material-symbols-outlined text-secondary bg-secondary-container/20 p-3 rounded-2xl">alarm</span>
            <span className="text-xs font-bold text-secondary bg-secondary-container/20 px-2 py-1 rounded-full">Consistent</span>
          </div>
          <p className="text-on-surface-variant text-sm font-medium mb-1">Wake Time</p>
          <h3 className="text-3xl font-bold font-headline">6:30 <span className="text-lg font-normal text-on-surface-variant">AM</span></h3>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-12 gap-8">
        {/* Sleep Stages Breakdown (8 cols) */}
        <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest p-10 rounded-3xl shadow-sm">
          <h4 className="text-2xl font-bold font-headline mb-8">Sleep Stages</h4>

          {/* Hypnogram Bar */}
          <div className="mb-8">
            <div className="h-8 w-full rounded-full overflow-hidden flex">
              {sleepStages.map((stage) => (
                <div key={stage.label} className={`${stage.color} h-full`} style={{ width: `${stage.percent}%` }}></div>
              ))}
            </div>
            <div className="flex justify-between mt-3 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
              <span>10:45 PM</span>
              <span>1:00 AM</span>
              <span>3:00 AM</span>
              <span>5:00 AM</span>
              <span>6:30 AM</span>
            </div>
          </div>

          {/* Stage Details */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {sleepStages.map((stage) => (
              <div key={stage.label} className="bg-surface-container-low p-5 rounded-2xl">
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-3 h-3 rounded-full ${stage.color}`}></div>
                  <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">{stage.label}</span>
                </div>
                <p className="text-2xl font-bold font-headline">{stage.duration}</p>
                <p className="text-xs text-on-surface-variant mt-1">{stage.percent}% of total</p>
              </div>
            ))}
          </div>
        </div>

        {/* AI Insights (4 cols) */}
        <div className="col-span-12 lg:col-span-4 primary-gradient p-10 rounded-3xl text-white shadow-xl shadow-primary/20 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
              <span className="text-xs font-bold uppercase tracking-widest">Sleep Insights</span>
            </div>
            <h4 className="text-2xl font-bold font-headline mb-4 leading-tight">Your deep sleep cycles improved by 18% this week.</h4>
            <p className="text-white/80 leading-relaxed font-light mb-6">
              The correlation between your earlier bedtime routine and increased deep sleep is strong. Your body is spending more time in restorative stages.
            </p>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
              <p className="text-xs font-bold text-white mb-2">Recommendation</p>
              <p className="text-sm">Maintain your 10:30-11:00 PM bedtime window. Reduce screen time 30 min before sleep for even better results.</p>
            </div>
          </div>
        </div>

        {/* Weekly Sleep Chart (7 cols) */}
        <div className="col-span-12 lg:col-span-7 bg-surface-container-lowest p-10 rounded-3xl shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h4 className="text-2xl font-bold font-headline">Weekly Sleep Duration</h4>
            <span className="text-xs font-bold text-primary bg-primary-container/20 px-3 py-1.5 rounded-full">Avg {avgHours}h</span>
          </div>
          <div className="flex items-end justify-between gap-3 h-48">
            {weeklyData.map((d) => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-[10px] font-bold text-on-surface-variant">{d.hours}h</span>
                <div className="w-full bg-surface-container-low rounded-xl overflow-hidden" style={{ height: '100%' }}>
                  <div
                    className={`w-full rounded-xl transition-all ${d.quality >= 85 ? 'bg-primary' : d.quality >= 70 ? 'bg-secondary' : 'bg-tertiary'}`}
                    style={{ height: `${(d.hours / 10) * 100}%`, marginTop: 'auto' }}
                  ></div>
                </div>
                <span className="text-[10px] font-bold text-on-surface-variant uppercase">{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Environment Data (5 cols) */}
        <div className="col-span-12 lg:col-span-5 bg-surface-container-high p-10 rounded-3xl">
          <h4 className="text-2xl font-bold font-headline mb-6">Sleep Environment</h4>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-primary bg-primary-container/20 p-3 rounded-2xl">thermostat</span>
                <div>
                  <p className="font-bold text-on-surface">Room Temperature</p>
                  <p className="text-xs text-on-surface-variant">Optimal: 65-68°F</p>
                </div>
              </div>
              <span className="font-headline font-bold text-lg">67°F</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-primary bg-primary-container/20 p-3 rounded-2xl">humidity_mid</span>
                <div>
                  <p className="font-bold text-on-surface">Humidity</p>
                  <p className="text-xs text-on-surface-variant">Optimal: 40-50%</p>
                </div>
              </div>
              <span className="font-headline font-bold text-lg">45%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-primary bg-primary-container/20 p-3 rounded-2xl">volume_off</span>
                <div>
                  <p className="font-bold text-on-surface">Noise Level</p>
                  <p className="text-xs text-on-surface-variant">Optimal: &lt;30dB</p>
                </div>
              </div>
              <span className="font-headline font-bold text-lg">28 dB</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-primary bg-primary-container/20 p-3 rounded-2xl">light_mode</span>
                <div>
                  <p className="font-bold text-on-surface">Light Exposure</p>
                  <p className="text-xs text-on-surface-variant">Minimal for best sleep</p>
                </div>
              </div>
              <span className="font-headline font-bold text-lg text-primary">Dark</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
