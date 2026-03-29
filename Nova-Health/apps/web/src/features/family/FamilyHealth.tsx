import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useFamilyStore } from '@/store/useFamilyStore';
import { FamilyMemberCard } from './components/FamilyMemberCard';
import { MetricComparison, type Metric } from './components/MetricComparison';
import { FamilyInsights } from './components/FamilyInsights';
import { WellnessScores, FamilyTimeline, type WellnessTab } from './components/WellnessTimeline';

export function FamilyHealth() {
  const [activeMetric, setActiveMetric] = useState<Metric>('Wellness Score');
  const [activeWellnessTab, setActiveWellnessTab] = useState<WellnessTab>('General');
  const navigate = useNavigate();
  const { members } = useFamilyStore();
  usePageTitle('Family Health');

  return (
    <div className="space-y-12 max-w-6xl mx-auto pb-20">
      {/* Hero Header */}
      <section className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <p className="text-xs font-bold text-primary uppercase tracking-widest mb-2">Your Household Sanctuary</p>
          <h2 className="text-5xl font-extrabold font-headline tracking-tight text-on-surface mb-2">Family Health</h2>
          <p className="text-on-surface-variant text-lg max-w-xl">Compare health metrics across family members to identify trends and keep everyone on track.</p>
        </div>
        <button onClick={() => navigate('/family/members')} className="primary-gradient text-white font-bold px-6 py-3 rounded-full shadow-lg shadow-primary/20 hover:opacity-90 transition-all flex items-center gap-2">
          <span className="material-symbols-outlined">person_add</span> Add Member
        </button>
      </section>

      {/* Family Member Overview Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {members.map((member) => (
          <FamilyMemberCard key={member.id} {...member} />
        ))}
      </section>

      {/* Metric Comparison + Insights */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <MetricComparison members={members} activeMetric={activeMetric} onMetricChange={setActiveMetric} />
        <FamilyInsights members={members} />
      </section>

      {/* Wellness Scores + Timeline */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <WellnessScores activeTab={activeWellnessTab} onTabChange={setActiveWellnessTab} />
        <FamilyTimeline />
      </section>
    </div>
  );
}
