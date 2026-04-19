import React from 'react';
import { useNavigate } from 'react-router-dom';

interface FamilyInsightsProps {
  members: { name: string; avatar: string; color: string }[];
}

export function FamilyInsights({ members }: FamilyInsightsProps) {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      {/* AI Insights Panel */}
      <div className="primary-gradient rounded-[2rem] p-8 text-white shadow-xl shadow-primary/20 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-6">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
            <span className="text-xs font-bold uppercase tracking-widest opacity-80">AI Household Insights</span>
          </div>
          <h4 className="text-2xl font-bold font-headline mb-4 leading-tight">Family wellness is trending up.</h4>
          <p className="text-white/80 leading-relaxed font-light mb-6">
            All members show improved sleep patterns this week. Maya's step count is 56% above her age group average. Consider a family outdoor activity on weekends.
          </p>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 mb-4">
            <p className="text-xs font-bold text-white mb-2">Recommendation</p>
            <p className="text-sm">Schedule a family walk or hike this Saturday — everyone's activity levels peak on weekends.</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
            <p className="text-xs font-bold text-white mb-2">Alert</p>
            <p className="text-sm">Leo's sleep duration dropped below 8 hours twice this week. Monitor screen time before bed.</p>
          </div>
        </div>
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      {/* Quick Compare */}
      <div className="bg-surface-container-lowest p-8 rounded-[2rem] shadow-sm">
        <h3 className="font-headline font-bold text-xl mb-6 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">compare</span>
          Quick Compare
        </h3>
        <div className="space-y-3">
          {[
            { metric: 'Avg Heart Rate', icon: 'favorite', values: ['72 BPM', '78 BPM', '88 BPM'] },
            { metric: 'Avg Sleep', icon: 'bedtime', values: ['7.5 hrs', '8.2 hrs', '9.5 hrs'] },
            { metric: 'Daily Steps', icon: 'footprint', values: ['8.2k', '12.4k', '15.6k'] },
            { metric: 'Blood Pressure', icon: 'blood_pressure', values: ['118/76', '110/70', '98/64'] },
          ].map(({ metric, icon, values }) => (
            <div key={metric} className="p-3 rounded-xl bg-surface-container/50">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-primary text-[18px]">{icon}</span>
                <span className="text-xs font-bold text-on-surface-variant">{metric}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                {values.map((val, i) => (
                  <div key={i}>
                    <p className="text-sm font-bold text-on-surface">{val}</p>
                    <p className="text-[10px] text-on-surface-variant">{members[i]?.name}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Challenge Teaser */}
      <div className="bg-emerald-900 rounded-[2rem] p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-block bg-white/15 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4">Active Challenge</div>
          <h4 className="text-2xl font-headline font-extrabold leading-tight mb-3">50,000 Steps<br />Together</h4>
          <p className="text-white/70 text-sm mb-5">Family goal ends in 3 days</p>
          <div className="mb-4">
            <div className="flex justify-between text-xs font-bold mb-2">
              <span>32,450 steps</span>
              <span className="text-white/60">50,000</span>
            </div>
            <div className="h-2.5 bg-white/15 rounded-full overflow-hidden">
              <div className="h-full bg-white rounded-full transition-all duration-700" style={{ width: '65%' }}></div>
            </div>
          </div>
          <div className="flex items-center gap-1 mb-6">
            {members.map((m, i) => (
              <div key={m.name} className={`w-9 h-9 rounded-full ${m.color} flex items-center justify-center text-white border-2 border-emerald-900 ${i > 0 ? '-ml-2' : ''}`}>
                <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>{m.avatar}</span>
              </div>
            ))}
          </div>
          <button
            onClick={() => navigate('/family/challenges')}
            className="w-full bg-white text-emerald-900 font-headline font-bold py-3 rounded-2xl hover:bg-white/90 transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined">emoji_events</span>
            Join the Fun
          </button>
        </div>
        <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
      </div>

      {/* Management Center */}
      <div className="bg-surface-container-lowest p-8 rounded-[2rem] shadow-sm">
        <h3 className="font-headline font-bold text-xl mb-6 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">settings</span>
          Management Center
        </h3>
        <div className="space-y-3">
          {[
            { to: '/family/members', icon: 'person_add', label: 'Add Family Member', desc: 'Invite or manually add a member' },
            { to: '/family/permissions', icon: 'admin_panel_settings', label: 'Manage Permissions', desc: 'Control access levels for each member' },
            { to: '/family/members', icon: 'swap_horiz', label: 'Switch Profile', desc: 'View health data as another member' },
          ].map((item) => (
            <button key={item.label} onClick={() => navigate(item.to)} className="w-full flex items-center gap-3 p-4 rounded-2xl bg-surface-container hover:bg-surface-container-high transition-colors text-left">
              <span className="material-symbols-outlined text-primary">{item.icon}</span>
              <div>
                <p className="font-bold text-sm text-on-surface">{item.label}</p>
                <p className="text-xs text-on-surface-variant">{item.desc}</p>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant ml-auto">chevron_right</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
