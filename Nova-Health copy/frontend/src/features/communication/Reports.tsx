import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ReportStatCard } from './components/ReportStatCard';
import { SymptomFrequencyItem } from './components/SymptomFrequencyItem';
import { ArchivedReportItem } from './components/ArchivedReportItem';

const stats = [
  { icon: 'favorite', label: 'Avg Heart Rate', value: '72', unit: 'BPM', change: '+2.4%', changeDirection: 'up' as const },
  { icon: 'timer', label: 'Sleep Quality', value: '84', unit: '%', change: '+12%', changeDirection: 'up' as const },
  { icon: 'blood_pressure', label: 'Blood Pressure', value: '118/76', change: '-1.1%', changeDirection: 'down' as const },
  { icon: 'footprint', label: 'Daily Steps', value: '10.2k', change: '+8.5%', changeDirection: 'up' as const },
];

const symptomFrequencies = [
  { name: 'Headache', episodes: 2, percentage: 35 },
  { name: 'Fatigue', episodes: 5, percentage: 75 },
  { name: 'Joint Pain', episodes: 1, percentage: 15 },
  { name: 'Sleep Interruption', episodes: 3, percentage: 50 },
];

const archivedReports = [
  { title: 'Comprehensive Quarterly Review', date: 'Mar 15, 2024', size: '4.2 MB' },
  { title: 'Bi-Weekly Vital Stats', date: 'Feb 28, 2024', size: '1.8 MB' },
  { title: 'Annual Health Synopsis 2023', date: 'Jan 05, 2024', size: '12.5 MB' },
];

export function Reports() {
  return (
    <div className="space-y-12">
      {/* Hero Title & Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-5xl font-extrabold font-headline tracking-tight text-on-surface mb-2">Health Reports</h2>
          <p className="text-on-surface-variant text-lg max-w-xl">Comprehensive analytical overview of your vital signs and wellness progress for the current period.</p>
        </div>
        <Tabs defaultValue="monthly">
          <TabsList className="bg-surface-container p-1.5 rounded-full h-auto">
            <TabsTrigger value="weekly" className="px-6 py-2 rounded-full text-sm font-bold text-stone-500 data-active:bg-surface-container-lowest data-active:text-emerald-800 data-active:shadow-sm">Weekly</TabsTrigger>
            <TabsTrigger value="monthly" className="px-6 py-2 rounded-full text-sm font-bold text-stone-500 data-active:bg-surface-container-lowest data-active:text-emerald-800 data-active:shadow-sm">Monthly</TabsTrigger>
            <TabsTrigger value="yearly" className="px-6 py-2 rounded-full text-sm font-bold text-stone-500 data-active:bg-surface-container-lowest data-active:text-emerald-800 data-active:shadow-sm">Yearly</TabsTrigger>
          </TabsList>
        </Tabs>
        <button className="ml-4 primary-gradient text-white px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg shadow-primary/20 hover:opacity-90 transition-all">
          <span className="material-symbols-outlined text-sm">picture_as_pdf</span> Export Report
        </button>
      </div>

      {/* Stats Summary (Top Row) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {stats.map((stat) => (
          <ReportStatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Bento Grid Main Content */}
      <div className="grid grid-cols-12 gap-8">
        {/* Heart Rate Trends (6 cols) */}
        <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest p-10 rounded-3xl shadow-sm">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h4 className="text-2xl font-bold font-headline">Vital Sign Trends</h4>
              <p className="text-stone-500 text-sm">Real-time heart rate and activity correlation</p>
            </div>
            <div className="flex gap-4">
              <button className="text-stone-400 hover:text-emerald-700 transition-colors"><span className="material-symbols-outlined">download</span></button>
              <button className="text-stone-400 hover:text-emerald-700 transition-colors"><span className="material-symbols-outlined">more_vert</span></button>
            </div>
          </div>
          {/* Mock Chart Visualization */}
          <div className="relative h-64 w-full flex items-end justify-between px-4 gap-2">
            {/* Background grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between py-2 border-l border-b border-stone-100">
              <div className="w-full border-t border-stone-50/50"></div>
              <div className="w-full border-t border-stone-50/50"></div>
              <div className="w-full border-t border-stone-50/50"></div>
              <div className="w-full border-t border-stone-50/50"></div>
            </div>
            {/* SVG Line Chart Mockup */}
            <svg className="absolute inset-0 h-full w-full pointer-events-none" preserveAspectRatio="none">
              <path d="M0 180 Q 50 160, 100 190 T 200 140 T 300 170 T 400 120 T 500 150 T 600 130 T 700 160 T 800 100" fill="none" stroke="#066e00" strokeLinecap="round" strokeWidth="4"></path>
              <path d="M0 220 Q 50 200, 100 230 T 200 180 T 300 210 T 400 160 T 500 190 T 600 170 T 700 200 T 800 140" fill="none" opacity="0.4" stroke="#1dcc0d" strokeDasharray="8 4" strokeWidth="2"></path>
            </svg>
            {/* Chart Labels */}
            <div className="absolute -bottom-8 w-full flex justify-between text-[10px] font-bold text-stone-400 uppercase tracking-tighter">
              <span>Mon 01</span><span>Wed 03</span><span>Fri 05</span><span>Sun 07</span><span>Tue 09</span><span>Thu 11</span><span>Sat 13</span>
            </div>
          </div>
        </div>

        {/* Monthly AI Summary (4 cols) */}
        <div className="col-span-12 lg:col-span-4 primary-gradient p-10 rounded-3xl text-white shadow-xl shadow-emerald-200/50 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
              <span className="text-xs font-bold uppercase tracking-widest">AI Insights</span>
            </div>
            <h4 className="text-3xl font-bold font-headline mb-4 leading-tight">Your health is glowing this month, Alex.</h4>
            <p className="text-white/80 leading-relaxed font-light mb-8">
              Based on your activity levels, your resting heart rate has decreased by 3 BPM. We've noticed a correlation between your 9:00 PM wind-down routine and improved REM sleep cycles. 
            </p>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
              <p className="text-xs font-bold text-white mb-2">Recommendation</p>
              <p className="text-sm">Increase magnesium intake on high-activity days to sustain these recovery trends.</p>
            </div>
          </div>
          <button className="mt-8 flex items-center justify-center gap-2 text-sm font-bold bg-white text-emerald-900 py-3 rounded-xl hover:bg-emerald-50 transition-colors">
            View Detailed Insights <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>

        {/* Symptom Frequency (5 cols) */}
        <div className="col-span-12 lg:col-span-5 bg-surface-container-high p-10 rounded-3xl">
          <h4 className="text-2xl font-bold font-headline mb-6 text-emerald-900">Symptom Frequency</h4>
          <div className="space-y-6">
            {symptomFrequencies.map((item) => (
              <SymptomFrequencyItem key={item.name} {...item} />
            ))}
          </div>
        </div>

        {/* Export & Recent Reports (7 cols) */}
        <div className="col-span-12 lg:col-span-7 bg-surface-container-lowest p-10 rounded-3xl shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h4 className="text-2xl font-bold font-headline">Archived Reports</h4>
            <button className="flex items-center gap-2 text-xs font-bold bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-full text-emerald-800 hover:bg-emerald-100 transition-colors">
              <span className="material-symbols-outlined text-sm">upload_file</span> Upload External Data
            </button>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 text-xs font-bold border border-emerald-100 px-4 py-2 rounded-full text-emerald-800 hover:bg-emerald-50 transition-colors">
                <span className="material-symbols-outlined text-sm">picture_as_pdf</span> PDF
              </button>
              <button className="flex items-center gap-2 text-xs font-bold border border-emerald-100 px-4 py-2 rounded-full text-emerald-800 hover:bg-emerald-50 transition-colors">
                <span className="material-symbols-outlined text-sm">csv</span> CSV
              </button>
            </div>
          </div>
          <div className="divide-y divide-emerald-100/50">
            {archivedReports.map((report) => (
              <ArchivedReportItem key={report.title} {...report} />
            ))}
          </div>
          <button className="mt-auto pt-6 text-sm font-bold text-emerald-800 hover:underline flex items-center gap-2">
            View all archives <span className="material-symbols-outlined text-sm">open_in_new</span>
          </button>
        </div>
      </div>
    </div>
  );
}
