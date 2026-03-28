import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';

interface DashboardHeroProps {
  onLogSymptoms: () => void;
}

export function DashboardHero({ onLogSymptoms }: DashboardHeroProps) {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden rounded-[2.5rem] bg-surface-container-low border border-outline-variant/30 p-10 lg:p-14">
      <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-primary/5 rounded-full blur-3xl -mr-40 -mt-40 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] bg-secondary-container/20 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none"></div>

      <div className="relative z-10 max-w-2xl">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container-highest border border-outline-variant/50 mb-6">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
          <span className="font-body text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Daily Insights Ready</span>
        </div>
        <h1 className="font-headline font-bold text-4xl lg:text-5xl text-on-surface leading-tight mb-4">
          Good morning, <span className="text-primary">{user?.name?.split(' ')[0]}</span>.
        </h1>
        <p className="font-body text-lg text-outline mb-8 leading-relaxed">
          Your vitals are stable. You have an upcoming consultation with Dr. Aris in 2 hours. Remember to log your morning symptoms.
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={() => navigate('/consultation')}
            className="px-8 py-4 rounded-2xl primary-gradient text-on-primary font-headline font-bold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined">videocam</span>
            Join Consultation
          </button>
          <button
            onClick={onLogSymptoms}
            className="px-8 py-4 rounded-2xl bg-surface-container-highest text-on-surface-variant font-headline font-bold hover:bg-outline-variant/30 transition-colors flex items-center gap-2"
          >
            <span className="material-symbols-outlined">edit_note</span>
            Log Symptoms
          </button>
          <button
            onClick={() => navigate('/reports')}
            className="px-8 py-4 rounded-2xl bg-surface-container-highest text-on-surface-variant font-headline font-bold hover:bg-outline-variant/30 transition-colors flex items-center gap-2"
          >
            <span className="material-symbols-outlined">assessment</span>
            View Full Report
          </button>
          <button
            onClick={() => navigate('/family')}
            className="px-8 py-4 rounded-2xl bg-surface-container-highest text-on-surface-variant font-headline font-bold hover:bg-outline-variant/30 transition-colors flex items-center gap-2"
          >
            <span className="material-symbols-outlined">group</span>
            My Care Team
          </button>
        </div>
      </div>

      {/* Abstract Graphic */}
      <div className="hidden lg:block absolute right-10 top-1/2 -translate-y-1/2">
        <div className="relative w-64 h-64">
          <div className="absolute inset-0 border-2 border-primary/20 rounded-full animate-[spin_20s_linear_infinite]"></div>
          <div className="absolute inset-4 border-2 border-dashed border-secondary/30 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 rounded-full primary-gradient shadow-2xl shadow-primary/40 flex items-center justify-center">
              <span className="material-symbols-outlined text-on-primary text-5xl">favorite</span>
            </div>
          </div>
          <div className="absolute top-0 right-10 bg-surface-container-lowest px-4 py-2 rounded-2xl shadow-lg border border-surface-variant/50 flex items-center gap-2 animate-bounce" style={{ animationDuration: '3s' }}>
            <span className="material-symbols-outlined text-primary text-sm">arrow_upward</span>
            <span className="font-headline font-bold text-sm text-on-surface">98%</span>
          </div>
          <div className="absolute bottom-10 left-0 bg-surface-container-lowest px-4 py-2 rounded-2xl shadow-lg border border-surface-variant/50 flex items-center gap-2 animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>
            <span className="material-symbols-outlined text-secondary text-sm">water_drop</span>
            <span className="font-headline font-bold text-sm text-on-surface">Optimal</span>
          </div>
        </div>
      </div>
    </section>
  );
}
