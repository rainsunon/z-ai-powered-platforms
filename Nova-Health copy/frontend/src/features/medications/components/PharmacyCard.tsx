import React from 'react';

export function PharmacyCard() {
  return (
    <div className="bg-primary-gradient rounded-[2rem] p-8 text-white shadow-lg shadow-primary/20 relative overflow-hidden">
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>local_pharmacy</span>
          <span className="text-xs font-bold uppercase tracking-widest opacity-80">Pharmacy</span>
        </div>
        <h4 className="text-xl font-bold font-headline mb-1">HealthFirst Pharmacy</h4>
        <p className="text-sm opacity-80 mb-4">1234 Wellness Ave, Suite 200<br />San Francisco, CA 94102</p>
        <div className="flex items-center gap-2 text-sm mb-6">
          <span className="material-symbols-outlined text-[18px]">call</span>
          <span className="font-medium">(415) 555-0198</span>
        </div>
        <button className="w-full flex items-center justify-center gap-2 text-sm font-bold bg-white text-emerald-900 py-3 rounded-xl hover:bg-emerald-50 transition-colors">
          <span className="material-symbols-outlined text-sm">call</span>
          Contact Pharmacy
        </button>
      </div>
      <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
    </div>
  );
}
