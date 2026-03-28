import React from 'react';

interface Member {
  name: string;
  color: string;
  heartRate: number;
  sleep: number;
  steps: number;
  bp: string;
  wellness: number;
}

const metrics = ['Heart Rate', 'Sleep', 'Steps', 'Blood Pressure', 'Wellness Score'] as const;
type Metric = typeof metrics[number];

interface MetricComparisonProps {
  members: Member[];
  activeMetric: Metric;
  onMetricChange: (m: Metric) => void;
}

function getMetricValue(member: Member, metric: Metric) {
  switch (metric) {
    case 'Heart Rate': return `${member.heartRate} BPM`;
    case 'Sleep': return `${member.sleep} hrs`;
    case 'Steps': return member.steps.toLocaleString();
    case 'Blood Pressure': return member.bp;
    case 'Wellness Score': return `${member.wellness}%`;
  }
}

function getMetricBar(member: Member, metric: Metric) {
  switch (metric) {
    case 'Heart Rate': return Math.min(member.heartRate / 100, 1) * 100;
    case 'Sleep': return (member.sleep / 10) * 100;
    case 'Steps': return Math.min(member.steps / 20000, 1) * 100;
    case 'Blood Pressure': return 75;
    case 'Wellness Score': return member.wellness;
  }
}

export { metrics };
export type { Metric };

export function MetricComparison({ members, activeMetric, onMetricChange }: MetricComparisonProps) {
  return (
    <div className="lg:col-span-2 bg-surface-container-lowest p-10 rounded-[2rem] shadow-sm">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <div>
          <h3 className="text-2xl font-extrabold font-headline text-on-surface">Metric Comparison</h3>
          <p className="text-sm text-on-surface-variant mt-1">Side-by-side view of selected health metric</p>
        </div>
        <div className="flex items-center gap-1 bg-surface-container p-1.5 rounded-full flex-wrap">
          {metrics.map((m) => (
            <button
              key={m}
              onClick={() => onMetricChange(m)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${activeMetric === m ? 'bg-surface-container-lowest text-primary shadow-sm' : 'text-on-surface-variant hover:text-primary'}`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Bar Chart Visualization */}
      <div className="space-y-6">
        {members.map((member) => (
          <div key={member.name} className="flex items-center gap-4">
            <div className="w-20 text-right">
              <span className="text-sm font-bold text-on-surface">{member.name}</span>
            </div>
            <div className="flex-1 h-10 bg-surface-container rounded-full overflow-hidden relative">
              <div
                className={`h-full rounded-full ${member.color} transition-all duration-700 ease-out flex items-center justify-end pr-4`}
                style={{ width: `${getMetricBar(member, activeMetric)}%` }}
              >
                <span className="text-xs font-bold text-white drop-shadow-sm">{getMetricValue(member, activeMetric)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Weekly Trend Mini Chart */}
      <div className="mt-10 pt-8 border-t border-outline-variant/15">
        <h4 className="font-headline font-bold text-lg mb-6">Weekly Trends</h4>
        <div className="relative h-40 w-full">
          <div className="absolute inset-0 flex flex-col justify-between border-l border-b border-outline-variant/10">
            <div className="w-full border-t border-outline-variant/5"></div>
            <div className="w-full border-t border-outline-variant/5"></div>
            <div className="w-full border-t border-outline-variant/5"></div>
          </div>
          <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
            <path d="M0 100 Q60 80, 120 90 T240 70 T360 85 T480 60 T600 75 T720 55" fill="none" stroke="#066e00" strokeLinecap="round" strokeWidth="3" opacity="0.9" />
            <path d="M0 80 Q60 90, 120 75 T240 85 T360 65 T480 80 T600 50 T720 45" fill="none" stroke="#6750a4" strokeLinecap="round" strokeWidth="3" opacity="0.7" />
            <path d="M0 60 Q60 50, 120 55 T240 40 T360 50 T480 35 T600 40 T720 30" fill="none" stroke="#006c4c" strokeLinecap="round" strokeWidth="3" opacity="0.7" />
          </svg>
          <div className="absolute -bottom-8 w-full flex justify-center gap-6 text-[10px] font-bold">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-primary inline-block"></span> Sarah</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-tertiary inline-block"></span> Leo</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-secondary inline-block"></span> Maya</span>
          </div>
        </div>
        <div className="flex justify-between text-[10px] font-bold text-on-surface-variant uppercase tracking-tighter mt-10 px-2">
          <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
        </div>
      </div>
    </div>
  );
}
