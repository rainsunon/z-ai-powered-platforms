import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ReportStatCard } from './components/ReportStatCard';
import { VitalSignTrends } from './components/VitalSignTrends';
import { AIInsightsCard } from './components/AIInsightsCard';
import { SymptomFrequencyPanel, type SymptomEntry } from './components/SymptomFrequencyPanel';
import { ArchivedReportsPanel, type ArchivedReport } from './components/ArchivedReportsPanel';

const STATS = [
  { icon: 'favorite', label: 'Avg Heart Rate', value: '72', unit: 'BPM', change: '+2.4%', changeDirection: 'up' as const },
  { icon: 'timer', label: 'Sleep Quality', value: '84', unit: '%', change: '+12%', changeDirection: 'up' as const },
  { icon: 'blood_pressure', label: 'Blood Pressure', value: '118/76', change: '-1.1%', changeDirection: 'down' as const },
  { icon: 'footprint', label: 'Daily Steps', value: '10.2k', change: '+8.5%', changeDirection: 'up' as const },
];

const SYMPTOM_FREQUENCIES: SymptomEntry[] = [
  { name: 'Headache', episodes: 2, percentage: 35 },
  { name: 'Fatigue', episodes: 5, percentage: 75 },
  { name: 'Joint Pain', episodes: 1, percentage: 15 },
  { name: 'Sleep Interruption', episodes: 3, percentage: 50 },
];

const ARCHIVED_REPORTS: ArchivedReport[] = [
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
        <Button className="ml-4 primary-gradient text-white px-6 py-2 rounded-full text-sm font-bold gap-2 shadow-lg shadow-primary/20 hover:opacity-90">
          <span className="material-symbols-outlined text-sm">picture_as_pdf</span> Export Report
        </Button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {STATS.map((stat) => (
          <ReportStatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Bento Grid Main Content */}
      <div className="grid grid-cols-12 gap-8">
        <VitalSignTrends />
        <AIInsightsCard />
        <SymptomFrequencyPanel items={SYMPTOM_FREQUENCIES} />
        <ArchivedReportsPanel reports={ARCHIVED_REPORTS} />
      </div>
    </div>
  );
}
