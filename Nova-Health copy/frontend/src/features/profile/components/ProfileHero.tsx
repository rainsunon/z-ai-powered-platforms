import React from 'react';
import { useProfileStore } from '@/store/useProfileStore';

export function ProfileHero() {
  const { profile } = useProfileStore();

  return (
    <section className="bg-surface-container-lowest rounded-[2rem] shadow-sm overflow-hidden">
      <div className="h-32 bg-gradient-to-r from-primary via-primary/80 to-secondary relative">
        <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
      </div>
      <div className="px-8 pb-8 -mt-14">
        <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
          <div className="w-28 h-28 rounded-3xl bg-primary-container border-4 border-surface-container-lowest shadow-lg flex items-center justify-center">
            <span className="material-symbols-outlined text-5xl text-on-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
          </div>
          <div className="flex-1 pt-2">
            <h2 className="text-4xl md:text-5xl font-headline font-extrabold text-on-surface tracking-tight">{profile.fullName}</h2>
            <p className="text-on-surface-variant mt-1">Member ID: {profile.memberId} · Since {profile.memberSince}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="text-[11px] font-bold uppercase tracking-wider bg-primary-container/30 text-primary px-3 py-1 rounded-full flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">bloodtype</span>
                {profile.bloodType}
              </span>
              <span className="text-[11px] font-bold uppercase tracking-wider bg-secondary-container/30 text-secondary px-3 py-1 rounded-full flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">height</span>
                {profile.height}
              </span>
              <span className="text-[11px] font-bold uppercase tracking-wider bg-tertiary-container/30 text-tertiary px-3 py-1 rounded-full flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">monitor_weight</span>
                {profile.weight}
              </span>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="bg-surface-container-high text-on-surface font-bold px-6 py-3 rounded-full hover:bg-surface-container-highest transition-colors flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">share</span>
              Share Records
            </button>
            <button className="primary-gradient text-white font-bold px-8 py-3 rounded-full shadow-lg hover:opacity-95 transition-opacity flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">edit</span>
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
