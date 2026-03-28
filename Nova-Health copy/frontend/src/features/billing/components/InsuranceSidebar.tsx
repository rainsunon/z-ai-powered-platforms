import React from 'react';

export function InsuranceSidebar() {
  return (
    <aside className="space-y-8 sticky top-24">
      <section className="bg-surface-container-highest p-8 rounded-[2.5rem] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 primary-gradient opacity-5 rounded-full -mr-20 -mt-20"></div>
        <h4 className="text-xl font-headline font-bold mb-6">Insurance Provider</h4>

        {/* Insurance Card Preview */}
        <div className="relative w-full aspect-[1.6/1] bg-stone-900 rounded-2xl p-6 text-white flex flex-col justify-between shadow-2xl overflow-hidden mb-8">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute -bottom-10 -right-10 w-48 h-48 border-[20px] border-white/20 rounded-full"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-white/10 rounded-full"></div>
          </div>
          <div className="flex justify-between items-start z-10">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-emerald-400 font-bold">Primary Carrier</p>
              <p className="text-lg font-bold">Luminous Shield PPO</p>
            </div>
            <div className="w-10 h-10 bg-white/20 rounded-full backdrop-blur-sm flex items-center justify-center">
              <span className="material-symbols-outlined text-emerald-400">eco</span>
            </div>
          </div>
          <div className="z-10">
            <p className="text-[8px] uppercase tracking-tighter opacity-60">Member Name</p>
            <p className="text-md font-medium tracking-tight">ELENA MARIE VANCE</p>
            <div className="flex gap-4 mt-4">
              <div>
                <p className="text-[8px] uppercase tracking-tighter opacity-60">Member ID</p>
                <p className="text-xs font-mono">LX-0092-8812</p>
              </div>
              <div>
                <p className="text-[8px] uppercase tracking-tighter opacity-60">Group #</p>
                <p className="text-xs font-mono">G-4451</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {[
            { label: 'Coverage Type', value: 'Platinum Individual' },
            { label: 'Deductible Met', value: '$2,500 / $3,000' },
            { label: 'Co-pay', value: '$25.00 / Visit' },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between text-sm py-2 border-b border-outline-variant/20">
              <span className="text-on-surface-variant">{label}</span>
              <span className="font-bold">{value}</span>
            </div>
          ))}
        </div>

        <button className="w-full mt-8 flex items-center justify-center gap-2 text-primary font-bold py-4 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <span className="material-symbols-outlined">qr_code_2</span> View Digital Card
        </button>
        <button className="w-full mt-4 flex items-center justify-center gap-2 text-on-surface-variant font-bold py-4 bg-surface-container-low border border-outline-variant/30 rounded-2xl hover:bg-surface-container-high transition-colors">
          <span className="material-symbols-outlined">upload_file</span> Upload Insurance Card
        </button>
      </section>

      {/* Support Card */}
      <div className="bg-primary/5 p-8 rounded-[2rem] border border-primary/10">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-primary text-white rounded-full">
            <span className="material-symbols-outlined">help_center</span>
          </div>
          <h5 className="font-bold">Billing Support</h5>
        </div>
        <p className="text-sm text-on-surface-variant mb-6">Have questions about a recent charge or your insurance coverage?</p>
        <a className="inline-flex items-center gap-2 text-primary font-bold text-sm" href="#">
          Chat with a specialist <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </a>
      </div>
    </aside>
  );
}
