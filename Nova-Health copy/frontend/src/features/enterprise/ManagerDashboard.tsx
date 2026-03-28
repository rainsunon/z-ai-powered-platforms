import React from 'react';
import { useAuthStore } from '@/store/useAuthStore';

const growthData = [
  { month: 'Jan', height: 45 },
  { month: 'Feb', height: 55 },
  { month: 'Mar', height: 50 },
  { month: 'Apr', height: 75 },
  { month: 'May', height: 85 },
  { month: 'Jun', height: 95, peak: true },
];

const efficiencyItems = [
  { icon: 'speed', iconBg: 'bg-secondary-fixed/30 text-secondary', title: 'Provider Response Time', subtitle: 'System-wide average efficiency', value: '12.4 min', trend: '2.1% (Ideal)', trendIcon: 'arrow_downward' },
  { icon: 'task_alt', iconBg: 'bg-tertiary-fixed/30 text-tertiary', title: 'Record Processing Latency', subtitle: 'Automated OCR & validation success', value: '99.2%', trend: '0.5% growth', trendIcon: 'arrow_upward' },
];

export function ManagerDashboard() {
  const { user } = useAuthStore();

  return (
    <div className="p-12 space-y-12 max-w-[1600px]">
      {/* Header */}
      <header className="flex justify-between items-end">
        <div className="max-w-2xl">
          <h1 className="font-headline font-extrabold text-5xl text-primary tracking-tight leading-none mb-4">Executive Strategic Overview</h1>
          <p className="text-on-surface-variant text-lg max-w-lg leading-relaxed">NovaHealth business intelligence and real-time operational efficiency metrics for the current fiscal quarter.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right mr-4">
            <p className="font-bold text-primary">{user?.title}</p>
            <p className="text-xs text-on-surface-variant">Luminous Sanctuary HQ</p>
          </div>
          <div className="w-14 h-14 rounded-full bg-surface-container-highest overflow-hidden ring-4 ring-surface-container-lowest shadow-sm">
            <img src={user?.avatar} alt="Executive Profile" className="w-full h-full object-cover" />
          </div>
        </div>
      </header>

      {/* High-Level KPI Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-surface-container-lowest/70 backdrop-blur-xl p-8 rounded-[2rem] shadow-[0px_20px_40px_rgba(21,30,18,0.06)] flex flex-col justify-between">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-secondary-container rounded-2xl text-on-secondary-container">
              <span className="material-symbols-outlined text-3xl">family_restroom</span>
            </div>
            <span className="bg-secondary-fixed text-on-secondary-fixed text-xs font-bold px-3 py-1 rounded-full">+12.4%</span>
          </div>
          <div>
            <h3 className="font-headline text-on-surface-variant text-sm font-semibold uppercase tracking-widest mb-1">Total Active Families</h3>
            <p className="font-headline text-4xl font-extrabold text-primary">14,282</p>
          </div>
        </div>

        <div className="bg-surface-container-lowest/70 backdrop-blur-xl p-8 rounded-[2rem] shadow-[0px_20px_40px_rgba(21,30,18,0.06)] flex flex-col justify-between border-2 border-primary/5">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-tertiary-container rounded-2xl text-on-tertiary-container">
              <span className="material-symbols-outlined text-3xl">payments</span>
            </div>
            <span className="bg-primary-fixed text-on-primary-fixed text-xs font-bold px-3 py-1 rounded-full">+8.2%</span>
          </div>
          <div>
            <h3 className="font-headline text-on-surface-variant text-sm font-semibold uppercase tracking-widest mb-1">Monthly Recurring Revenue</h3>
            <p className="font-headline text-4xl font-extrabold text-primary">$1.42M</p>
          </div>
        </div>

        <div className="bg-surface-container-lowest/70 backdrop-blur-xl p-8 rounded-[2rem] shadow-[0px_20px_40px_rgba(21,30,18,0.06)] flex flex-col justify-between">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-surface-container-highest rounded-2xl text-primary">
              <span className="material-symbols-outlined text-3xl">moving</span>
            </div>
            <span className="bg-surface-dim text-on-surface-variant text-xs font-bold px-3 py-1 rounded-full">Stable</span>
          </div>
          <div>
            <h3 className="font-headline text-on-surface-variant text-sm font-semibold uppercase tracking-widest mb-1">Client Lifetime Value</h3>
            <p className="font-headline text-4xl font-extrabold text-primary">$4,850</p>
          </div>
        </div>
      </section>

      {/* Main Strategic Content Grid */}
      <div className="grid grid-cols-12 gap-8">
        {/* Household Growth Trends Chart */}
        <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest p-10 rounded-[2.5rem] shadow-sm">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="font-headline text-2xl font-bold text-on-surface">Household Growth Trends</h2>
              <p className="text-on-surface-variant text-sm">Family account acquisition velocity (Last 6 Months)</p>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 rounded-full bg-surface-container text-xs font-semibold text-primary">Export Data</button>
              <button className="px-4 py-2 rounded-full bg-surface text-xs font-semibold border border-outline-variant/20 text-on-surface-variant">Filters</button>
            </div>
          </div>
          <div className="h-80 w-full relative flex items-end justify-between px-4">
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className="border-b border-outline-variant/10 w-full h-0"></div>
              ))}
            </div>
            <div className="relative w-full h-full flex items-end justify-between gap-4 pt-12">
              {growthData.map((d) => (
                <div key={d.month} className="flex-1 group relative">
                  <div
                    className={`${d.peak ? 'bg-gradient-to-br from-primary to-primary-container shadow-lg' : 'bg-primary/10 group-hover:bg-primary/20'} rounded-t-xl w-full transition-all`}
                    style={{ height: `${d.height}%` }}
                  ></div>
                  {d.peak && (
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-on-surface text-white text-[10px] py-1 px-2 rounded-md font-bold whitespace-nowrap">Peak: 14.2k</div>
                  )}
                  <p className={`text-[10px] text-center mt-3 font-bold uppercase tracking-tighter ${d.peak ? 'text-primary' : 'opacity-60'}`}>{d.month}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Strategic Insights */}
        <div className="col-span-12 lg:col-span-4 flex flex-col">
          <div className="flex-1 bg-primary text-white p-10 rounded-[2.5rem] relative overflow-hidden shadow-xl">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8">
                <span className="material-symbols-outlined text-primary-fixed" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                <h2 className="font-headline text-xl font-bold tracking-tight">Strategic Insights</h2>
              </div>
              <div className="space-y-6">
                <div className="bg-white/10 p-5 rounded-2xl backdrop-blur-md">
                  <p className="text-xs font-bold uppercase tracking-widest text-primary-fixed mb-2">Growth Opportunity</p>
                  <p className="text-sm leading-relaxed opacity-90 font-medium">Retention among &apos;Daily&apos; tier users is 15% higher in Southeast regions. Consider localizing campaigns there.</p>
                </div>
                <div className="bg-white/10 p-5 rounded-2xl backdrop-blur-md">
                  <p className="text-xs font-bold uppercase tracking-widest text-secondary-fixed mb-2">Efficiency Alert</p>
                  <p className="text-sm leading-relaxed opacity-90 font-medium">Automated health record processing could reduce overhead by 12% if scaled to Enterprise accounts.</p>
                </div>
                <button className="w-full mt-4 py-4 bg-white text-primary rounded-2xl font-bold text-sm hover:bg-surface transition-colors">
                  View Detailed Analysis
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue by Tier Pie Chart */}
        <div className="col-span-12 lg:col-span-5 bg-surface-container-high p-10 rounded-[2.5rem]">
          <h2 className="font-headline text-2xl font-bold text-on-surface mb-8">Revenue by Subscription Tier</h2>
          <div className="flex items-center justify-between">
            <div className="relative w-48 h-48">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#dbe6d3" strokeWidth="3" />
                <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#066e00" strokeWidth="3.5" strokeDasharray="60 40" strokeDashoffset="0" />
                <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#9ff888" strokeWidth="3.5" strokeDasharray="25 75" strokeDashoffset="-60" />
                <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#1dcc0d" strokeWidth="3.5" strokeDasharray="15 85" strokeDashoffset="-85" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xs text-on-surface-variant font-bold uppercase">Total</span>
                <span className="text-xl font-bold text-primary">$1.42M</span>
              </div>
            </div>
            <div className="space-y-4 flex-1 ml-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                  <span className="text-sm font-semibold">Yearly</span>
                </div>
                <span className="text-sm font-bold">60%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-secondary-container"></div>
                  <span className="text-sm font-semibold">Monthly</span>
                </div>
                <span className="text-sm font-bold">25%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary-container"></div>
                  <span className="text-sm font-semibold">Daily</span>
                </div>
                <span className="text-sm font-bold">15%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Service Efficiency */}
        <div className="col-span-12 lg:col-span-7 bg-surface-container-low p-10 rounded-[2.5rem]">
          <div className="flex justify-between items-center mb-8">
            <h2 className="font-headline text-2xl font-bold text-on-surface">Service Efficiency Overview</h2>
            <button className="text-primary text-sm font-bold flex items-center gap-1">
              <span>View All Reports</span>
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </button>
          </div>
          <div className="space-y-4">
            {efficiencyItems.map((item) => (
              <div key={item.title} className="bg-surface-container-lowest p-6 rounded-3xl flex items-center justify-between hover:translate-x-1 transition-transform cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className={`p-3 ${item.iconBg} rounded-full`}>
                    <span className="material-symbols-outlined">{item.icon}</span>
                  </div>
                  <div>
                    <p className="font-bold text-on-surface">{item.title}</p>
                    <p className="text-xs text-on-surface-variant">{item.subtitle}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-black text-primary">{item.value}</p>
                  <div className="flex items-center text-[10px] text-primary gap-1 justify-end">
                    <span className="material-symbols-outlined text-[10px]">{item.trendIcon}</span>
                    <span>{item.trend}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating AI Button */}
      <button className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-br from-primary to-primary-container text-on-primary rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50">
        <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
      </button>
    </div>
  );
}
