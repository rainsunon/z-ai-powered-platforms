import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const memberData: Record<string, {
  name: string; role: string; avatar: string; color: string; gradient: string;
  heartRate: number; heartRateHistory: number[]; sleepHours: number; sleepMinutes: number;
  deepSleep: string; remSleep: string; lightSleep: string; awake: string;
  steps: number; stepGoal: number; bloodOxygen: number; bp: string; temp: number; respiratory: number;
  upcomingTasks: { title: string; date: string; icon: string; color: string }[];
}> = {
  sarah: {
    name: 'Sarah Rivera', role: 'Account Owner', avatar: 'face_4', color: 'bg-primary', gradient: 'from-primary to-primary/70',
    heartRate: 72, heartRateHistory: [68, 72, 75, 70, 72, 69, 74, 71, 73, 72, 70, 72],
    sleepHours: 8, sleepMinutes: 24, deepSleep: '2h 15m', remSleep: '1h 48m', lightSleep: '3h 42m', awake: '39m',
    steps: 8432, stepGoal: 10000, bloodOxygen: 98, bp: '118/74', temp: 98.6, respiratory: 14,
    upcomingTasks: [
      { title: 'Annual Check-up', date: 'Nov 15, 2024', icon: 'stethoscope', color: 'bg-primary/10 text-primary' },
      { title: 'Flu Vaccination', date: 'Dec 01, 2024', icon: 'vaccines', color: 'bg-tertiary/10 text-tertiary' },
    ],
  },
  leo: {
    name: 'Leo Rivera', role: 'Teen Member', avatar: 'face_3', color: 'bg-tertiary', gradient: 'from-tertiary to-tertiary/70',
    heartRate: 78, heartRateHistory: [76, 80, 78, 75, 78, 82, 77, 79, 78, 76, 80, 78],
    sleepHours: 8, sleepMinutes: 12, deepSleep: '2h 30m', remSleep: '1h 55m', lightSleep: '3h 20m', awake: '27m',
    steps: 12400, stepGoal: 12000, bloodOxygen: 99, bp: '110/70', temp: 98.4, respiratory: 16,
    upcomingTasks: [
      { title: 'Sports Physical', date: 'Nov 20, 2024', icon: 'sports', color: 'bg-tertiary/10 text-tertiary' },
      { title: 'Dental Cleaning', date: 'Dec 10, 2024', icon: 'dentistry', color: 'bg-secondary/10 text-secondary' },
    ],
  },
  maya: {
    name: 'Maya Rivera', role: 'Child Member', avatar: 'face_5', color: 'bg-secondary', gradient: 'from-secondary to-secondary/70',
    heartRate: 88, heartRateHistory: [86, 90, 88, 85, 88, 92, 87, 89, 88, 86, 90, 88],
    sleepHours: 9, sleepMinutes: 30, deepSleep: '3h 05m', remSleep: '2h 10m', lightSleep: '3h 40m', awake: '35m',
    steps: 15600, stepGoal: 10000, bloodOxygen: 99, bp: '98/64', temp: 98.2, respiratory: 18,
    upcomingTasks: [
      { title: 'Pediatric Visit', date: 'Nov 25, 2024', icon: 'child_care', color: 'bg-secondary/10 text-secondary' },
      { title: 'Vaccination Booster', date: 'Dec 15, 2024', icon: 'vaccines', color: 'bg-primary/10 text-primary' },
    ],
  },
};

export function FamilyHealthSummary() {
  const { memberId } = useParams();
  const navigate = useNavigate();
  const member = memberData[memberId || 'sarah'] || memberData.sarah;

  const stepPercent = Math.min((member.steps / member.stepGoal) * 100, 100);
  const maxHR = Math.max(...member.heartRateHistory);
  const barWidth = 100 / member.heartRateHistory.length;

  return (
    <div className="space-y-12 max-w-5xl mx-auto pb-20">
      {/* Header */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <button onClick={() => navigate('/family/permissions')} className="p-2 rounded-full hover:bg-surface-container transition-colors">
            <span className="material-symbols-outlined text-on-surface-variant">arrow_back</span>
          </button>
          <span className="text-xs font-bold text-primary uppercase tracking-widest">Health Summary</span>
        </div>
        {/* Member Banner */}
        <div className={`bg-gradient-to-r ${member.gradient} rounded-[2rem] p-8 text-white`}>
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <span className="material-symbols-outlined text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>{member.avatar}</span>
            </div>
            <div>
              <h2 className="text-3xl font-extrabold font-headline">{member.name}</h2>
              <p className="text-white/80 mt-1">{member.role} • Health Summary</p>
            </div>
          </div>
        </div>
      </section>

      {/* Health Metrics Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Heart Rate */}
        <div className="bg-surface-container-lowest p-8 rounded-[2rem] shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-error/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-error" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
              </div>
              <div>
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Heart Rate</p>
                <p className="text-3xl font-extrabold font-headline text-on-surface">{member.heartRate} <span className="text-sm font-normal text-on-surface-variant">BPM</span></p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
              <span className="material-symbols-outlined text-sm">check_circle</span> Normal
            </span>
          </div>
          {/* Heart Rate Bar Chart */}
          <div className="flex items-end gap-1 h-24">
            {member.heartRateHistory.map((hr, i) => (
              <div
                key={i}
                className="flex-1 bg-error/20 rounded-t-lg hover:bg-error/40 transition-colors relative group"
                style={{ height: `${(hr / maxHR) * 100}%` }}
              >
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-on-surface text-surface text-[10px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {hr}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-[10px] text-on-surface-variant mt-2">
            <span>12 AM</span><span>6 AM</span><span>12 PM</span><span>6 PM</span>
          </div>
        </div>

        {/* Sleep Quality */}
        <div className="bg-surface-container-lowest p-8 rounded-[2rem] shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-tertiary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>bedtime</span>
              </div>
              <div>
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Sleep Quality</p>
                <p className="text-3xl font-extrabold font-headline text-on-surface">{member.sleepHours}h {member.sleepMinutes}m</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
              <span className="material-symbols-outlined text-sm">trending_up</span> Excellent
            </span>
          </div>
          {/* Sleep Breakdown */}
          <div className="space-y-3">
            {[
              { label: 'Deep Sleep', value: member.deepSleep, color: 'bg-tertiary', percent: 27 },
              { label: 'REM Sleep', value: member.remSleep, color: 'bg-primary', percent: 22 },
              { label: 'Light Sleep', value: member.lightSleep, color: 'bg-secondary', percent: 44 },
              { label: 'Awake', value: member.awake, color: 'bg-outline-variant', percent: 7 },
            ].map(({ label, value, color, percent }) => (
              <div key={label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-on-surface-variant">{label}</span>
                  <span className="text-sm font-bold text-on-surface">{value}</span>
                </div>
                <div className="h-2 bg-surface-container rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${color}`} style={{ width: `${percent}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Steps */}
        <div className="bg-surface-container-lowest p-8 rounded-[2rem] shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-secondary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>footprint</span>
              </div>
              <div>
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Steps Today</p>
                <p className="text-3xl font-extrabold font-headline text-on-surface">{member.steps.toLocaleString()}</p>
              </div>
            </div>
            <span className="text-sm text-on-surface-variant font-bold">/ {member.stepGoal.toLocaleString()}</span>
          </div>
          {/* Progress Ring */}
          <div className="flex items-center gap-8">
            <div className="relative w-28 h-28 flex-shrink-0">
              <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                <circle cx="60" cy="60" r="50" fill="none" stroke="currentColor" className="text-surface-container" strokeWidth="10" />
                <circle cx="60" cy="60" r="50" fill="none" stroke="currentColor" className="text-secondary" strokeWidth="10" strokeLinecap="round" strokeDasharray={`${(stepPercent / 100) * 314.16} ${314.16}`} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-extrabold font-headline text-on-surface">{Math.round(stepPercent)}%</span>
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Goal</span>
              </div>
            </div>
            <div className="space-y-3 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-sm text-on-surface-variant">Distance</span>
                <span className="text-sm font-bold text-on-surface">{(member.steps * 0.000473).toFixed(1)} mi</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-on-surface-variant">Calories</span>
                <span className="text-sm font-bold text-on-surface">{Math.round(member.steps * 0.04)} kcal</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-on-surface-variant">Active Minutes</span>
                <span className="text-sm font-bold text-on-surface">{Math.round(member.steps / 100)} min</span>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Medical Tasks */}
        <div className="bg-surface-container-lowest p-8 rounded-[2rem] shadow-sm">
          <h3 className="font-headline font-bold text-xl text-on-surface mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">event</span>
            Upcoming Medical Tasks
          </h3>
          <div className="space-y-4">
            {member.upcomingTasks.map((task) => (
              <div key={task.title} className="flex items-center gap-4 p-5 rounded-2xl bg-surface-container/50">
                <div className={`w-12 h-12 rounded-xl ${task.color} flex items-center justify-center flex-shrink-0`}>
                  <span className="material-symbols-outlined">{task.icon}</span>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-on-surface">{task.title}</p>
                  <p className="text-sm text-on-surface-variant">{task.date}</p>
                </div>
                <span className="material-symbols-outlined text-on-surface-variant">chevron_right</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Health Status Indicators */}
      <section className="bg-surface-container-lowest p-8 rounded-[2rem] shadow-sm">
        <h3 className="font-headline font-bold text-xl text-on-surface mb-6 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>vital_signs</span>
          Health Status Indicators
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Blood Oxygen', value: `${member.bloodOxygen}%`, icon: 'spo2', status: 'Normal', statusColor: 'text-primary bg-primary/10' },
            { label: 'Blood Pressure', value: member.bp, icon: 'blood_pressure', status: 'Normal', statusColor: 'text-primary bg-primary/10' },
            { label: 'Temperature', value: `${member.temp}°F`, icon: 'thermostat', status: 'Normal', statusColor: 'text-primary bg-primary/10' },
            { label: 'Respiratory', value: `${member.respiratory} rpm`, icon: 'pulmonology', status: 'Normal', statusColor: 'text-primary bg-primary/10' },
          ].map(({ label, value, icon, status, statusColor }) => (
            <div key={label} className="bg-surface-container rounded-2xl p-5 text-center">
              <span className="material-symbols-outlined text-primary text-2xl mb-3 block" style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{label}</p>
              <p className="text-2xl font-extrabold font-headline text-on-surface mt-1">{value}</p>
              <span className={`inline-block mt-2 px-3 py-1 rounded-full text-[10px] font-bold ${statusColor}`}>{status}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
