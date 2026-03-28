import React from 'react';
import { useNavigate } from 'react-router-dom';

interface FamilyMemberCardProps {
  id: string;
  name: string;
  age: number;
  role: string;
  avatar: string;
  color: string;
  heartRate: number;
  sleep: number;
  steps: number;
  bp: string;
  wellness: number;
  lastSync: string;
  status: string;
}

export function FamilyMemberCard({ id, name, age, role, avatar, color, heartRate, sleep, steps, bp, wellness, lastSync, status }: FamilyMemberCardProps) {
  const navigate = useNavigate();

  return (
    <div
      className="bg-surface-container-lowest p-8 rounded-[2rem] shadow-sm hover:shadow-xl hover:shadow-on-surface/5 transition-all duration-500 group cursor-pointer"
      onClick={() => navigate(`/family/health-summary/${id}`)}
    >
      <div className="flex items-center gap-4 mb-4">
        <div className={`w-14 h-14 rounded-2xl ${color} text-white flex items-center justify-center`}>
          <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>{avatar}</span>
        </div>
        <div>
          <h3 className="font-headline font-bold text-lg text-on-surface">{name}</h3>
          <p className="text-sm text-on-surface-variant">{role} • Age {age}</p>
        </div>
        <div className="ml-auto text-right">
          <p className="text-3xl font-extrabold font-headline text-on-surface">{wellness}</p>
          <p className="text-[10px] font-bold text-secondary uppercase tracking-widest">Wellness</p>
        </div>
      </div>
      <div className="flex items-center justify-between mb-4">
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
          {status}
        </span>
        <span className="text-[10px] text-on-surface-variant flex items-center gap-1">
          <span className="material-symbols-outlined text-xs">sync</span> {lastSync}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {[
          { label: 'Heart Rate', value: `${heartRate}`, unit: 'BPM' },
          { label: 'Sleep', value: `${sleep}`, unit: 'hrs' },
          { label: 'Steps', value: steps.toLocaleString(), unit: '' },
          { label: 'BP', value: bp, unit: '' },
        ].map((m) => (
          <div key={m.label} className="bg-surface-container rounded-xl p-3">
            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{m.label}</p>
            <p className="font-headline font-bold text-on-surface mt-1">
              {m.value} {m.unit && <span className="text-xs font-normal text-on-surface-variant">{m.unit}</span>}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
