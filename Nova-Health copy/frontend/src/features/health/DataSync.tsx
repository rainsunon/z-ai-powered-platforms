import React from 'react';

const dataSources = [
  {
    name: 'Apple Health',
    icon: 'favorite',
    iconColor: 'text-rose-500',
    status: 'Active',
    statusColor: 'text-primary',
    subtitle: 'Last updated: 2m ago',
    progress: 85,
    progressGradient: true,
    labelLeft: 'Telemetry Stream',
    labelRight: '85% Transmitted',
  },
  {
    name: 'Fitbit',
    icon: 'bolt',
    iconColor: 'text-sky-500',
    status: 'Paused',
    statusColor: 'text-secondary',
    subtitle: 'Connecting...',
    progress: 42,
    progressGradient: false,
    labelLeft: 'Activity Logging',
    labelRight: '42% Buffered',
  },
  {
    name: 'Google Fit',
    icon: 'fitness_center',
    iconColor: 'text-orange-500',
    status: 'Connected',
    statusColor: 'text-primary',
    subtitle: 'Ready',
    progress: 100,
    progressGradient: true,
    labelLeft: 'Sync Complete',
    labelRight: '100% In Database',
  },
];

const insightCards = [
  {
    bgIcon: 'bedtime',
    category: 'Sleep Architecture',
    title: 'Deep Sleep Optimization',
    description:
      'Latest sync shows a 12% drop in REM cycle duration. Suggesting evening magnesium supplement adjustment.',
  },
  {
    bgIcon: 'monitor_heart',
    category: 'Cardiovascular Load',
    title: 'HRV Recovery Trend',
    description:
      'Heart Rate Variability is trending upward. Your current training intensity is perfectly balanced with recovery.',
  },
];

export function DataSync() {
  return (
    <div>
      {/* Header */}
      <header className="mb-16">
        <h2 className="text-[3.5rem] font-extrabold font-headline leading-none tracking-tight text-on-surface mb-4">
          Data Sync <span className="text-primary">&amp; Integration</span>
        </h2>
        <p className="text-lg text-on-surface-variant max-w-2xl font-body leading-relaxed">
          Harmonize your health ecosystem. Seamlessly bridge your wearable telemetry with our clinical-grade AI sanctuary.
        </p>
      </header>

      {/* Bento Grid */}
      <div className="grid grid-cols-12 gap-8 mb-12">
        {/* Section 1: Universal Flow Hero */}
        <div className="col-span-12 glass-panel rounded-[2rem] p-10 flex flex-col md:flex-row items-center justify-between gap-8 border border-outline-variant/10 shadow-[0px_20px_40px_rgba(21,30,18,0.04)]">
          <div className="flex-1 space-y-4">
            <h3 className="text-2xl font-bold font-headline text-on-surface">Universal Flow</h3>
            <p className="text-on-surface-variant font-body">
              Real-time telemetry stream from peripheral biometrics to neural processing.
            </p>
            <div className="flex items-center gap-4 mt-8">
              <span className="px-4 py-2 bg-secondary-container text-on-secondary-container rounded-full text-xs font-bold uppercase tracking-widest">
                System Active
              </span>
              <div className="flex -space-x-3">
                <img
                  alt="User"
                  className="w-10 h-10 rounded-full border-4 border-surface-container-lowest"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDIEduwzNlOMG8Y9cOc9a7_qRbYi62SGQp5zOPQ7h1JDf_WERxbHyNOjsEz2S5TpIW8CFsbXps021WZy82BVm1zKiLxKUH-4pNwiRH7bi3lmIRtXkqRx6vC_y9uB1j7iaVGbcO4S-DT9H5CzLmN5MA9W_9fSbIATgka7V9eGBhgCv903bRzZrEWpy9NgCXypb49dN_HM9OMMSwJ3DO-TfUB8p9nb7vNHE8qcK-v_p_hSFrI_t0veCuoRUzvCu8pnbJJpL0WsI7u5ss"
                />
                <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container font-bold text-xs border-4 border-surface-container-lowest">
                  +3
                </div>
              </div>
            </div>
          </div>

          {/* Workflow Diagram */}
          <div className="flex flex-wrap md:flex-nowrap items-center gap-4 md:gap-8">
            {[
              { icon: 'watch', label: 'Device', size: 'w-16 h-16', bg: 'bg-surface-container', rounded: 'rounded-2xl' },
              { icon: 'smartphone', label: 'Mobile', size: 'w-16 h-16', bg: 'bg-surface-container', rounded: 'rounded-2xl' },
              { icon: 'database', label: 'Vault', size: 'w-16 h-16', bg: 'bg-surface-container-highest', rounded: 'rounded-2xl' },
            ].map((step, i) => (
              <React.Fragment key={step.label}>
                {i > 0 && (
                  <span className="material-symbols-outlined text-outline-variant">trending_flat</span>
                )}
                <div className="flex flex-col items-center gap-3">
                  <div className={`${step.size} ${step.rounded} ${step.bg} flex items-center justify-center text-primary`}>
                    <span className="material-symbols-outlined text-3xl">{step.icon}</span>
                  </div>
                  <span className="text-xs font-bold text-on-surface-variant uppercase tracking-tighter">{step.label}</span>
                </div>
              </React.Fragment>
            ))}
            <span className="material-symbols-outlined text-outline-variant">trending_flat</span>
            <div className="flex flex-col items-center gap-3">
              <div className="w-20 h-20 rounded-full primary-gradient shadow-lg flex items-center justify-center text-white scale-110">
                <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  psychology
                </span>
              </div>
              <span className="text-xs font-bold text-primary uppercase tracking-tighter">AI Insight</span>
            </div>
          </div>
        </div>

        {/* Section 2: Link Mobile Portal (QR) */}
        <div className="col-span-12 lg:col-span-4 bg-surface-container-low rounded-[2rem] p-8 flex flex-col justify-between border-none">
          <div>
            <div className="w-12 h-12 rounded-xl bg-white mb-6 flex items-center justify-center text-primary shadow-sm">
              <span className="material-symbols-outlined">qr_code_2</span>
            </div>
            <h4 className="text-xl font-bold font-headline mb-2 text-on-surface">Link Mobile Portal</h4>
            <p className="text-on-surface-variant text-sm mb-8 leading-relaxed">
              Bridge your smartphone for instant metric syncing and secure proximity authentication.
            </p>

            {/* QR Code Placeholder */}
            <div className="bg-white p-6 rounded-3xl aspect-square flex items-center justify-center shadow-[0px_10px_30px_rgba(0,0,0,0.03)] mb-8 border border-outline-variant/20">
              <div className="relative w-full h-full border-[10px] border-surface-container-low rounded-xl flex items-center justify-center p-4">
                <div className="grid grid-cols-4 grid-rows-4 gap-2 w-full h-full opacity-80">
                  <div className="bg-on-surface rounded-sm" />
                  <div className="bg-on-surface rounded-sm" />
                  <div className="bg-transparent" />
                  <div className="bg-on-surface rounded-sm" />
                  <div className="bg-on-surface rounded-sm" />
                  <div className="bg-transparent" />
                  <div className="bg-on-surface rounded-sm" />
                  <div className="bg-on-surface rounded-sm" />
                  <div className="bg-transparent" />
                  <div className="bg-on-surface rounded-sm" />
                  <div className="bg-on-surface rounded-sm" />
                  <div className="bg-transparent" />
                  <div className="bg-on-surface rounded-sm" />
                  <div className="bg-transparent" />
                  <div className="bg-transparent" />
                  <div className="bg-on-surface rounded-sm" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white p-2 rounded-lg shadow-md border border-outline-variant/10">
                    <span className="material-symbols-outlined text-primary text-2xl">eco</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <button className="primary-gradient text-white w-full py-4 rounded-full font-bold text-sm transition-transform active:scale-95 shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-lg">add_circle</span>
            Link New Device
          </button>
        </div>

        {/* Section 3: Live Stream Core */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
          <div className="bg-surface-container rounded-[2rem] p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">sensors</span>
                <h4 className="text-xl font-bold font-headline">Live Stream Core</h4>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary-container animate-pulse" />
                <span className="text-xs font-bold text-primary uppercase tracking-widest">Syncing to Database</span>
              </div>
            </div>

            <div className="space-y-6">
              {dataSources.map((src) => (
                <div key={src.name} className="bg-surface-container-lowest rounded-2xl p-6 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#FAFAFA] border border-gray-100 flex items-center justify-center">
                        <span
                          className={`material-symbols-outlined ${src.iconColor}`}
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          {src.icon}
                        </span>
                      </div>
                      <div>
                        <p className="font-bold text-on-surface">{src.name}</p>
                        <p className="text-xs text-on-surface-variant font-medium">{src.subtitle}</p>
                      </div>
                    </div>
                    <span className={`text-sm font-bold ${src.statusColor}`}>{src.status}</span>
                  </div>
                  <div className="w-full h-2 bg-surface-variant rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${src.progressGradient ? 'primary-gradient' : 'bg-secondary-container'}`}
                      style={{ width: `${src.progress}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] font-bold text-outline uppercase tracking-wider">
                    <span>{src.labelLeft}</span>
                    <span>{src.labelRight}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 4: AI-Powered Analysis */}
        <div className="col-span-12 glass-panel rounded-[2rem] p-10 border border-outline-variant/10">
          <div className="flex flex-col xl:flex-row gap-12 items-start">
            <div className="w-full xl:w-1/3 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-container/10 text-primary text-xs font-bold uppercase tracking-widest border border-primary/20">
                <span className="material-symbols-outlined text-sm">auto_awesome</span>
                Neural Engine 4.0
              </div>
              <h4 className="text-3xl font-extrabold font-headline leading-tight">
                Synthesize New <span className="text-primary">Biometric Insights</span>
              </h4>
              <p className="text-on-surface-variant leading-relaxed">
                Our AI process evaluates 12,000+ data points from your last 24 hours to generate precision health adjustments.
              </p>
              <button className="primary-gradient text-white px-8 py-5 rounded-full font-bold text-sm shadow-xl shadow-primary/20 transition-all hover:shadow-2xl active:scale-95 flex items-center gap-3">
                <span className="material-symbols-outlined">rocket_launch</span>
                Process Data with AI
              </button>
            </div>
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              {insightCards.map((card) => (
                <div
                  key={card.title}
                  className="bg-surface rounded-3xl p-6 border border-outline-variant/10 shadow-sm relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-6xl">{card.bgIcon}</span>
                  </div>
                  <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-2">{card.category}</p>
                  <h5 className="text-lg font-bold mb-3">{card.title}</h5>
                  <p className="text-sm text-on-surface-variant font-medium mb-4">{card.description}</p>
                  <div className="flex items-center gap-2 text-xs font-bold text-on-surface">
                    <span className="material-symbols-outlined text-sm text-primary">verified</span>
                    Clinical Insight Generated
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-12 pt-8 border-t border-outline-variant/10 flex justify-between items-center text-on-surface-variant text-xs font-medium">
        <div className="flex items-center gap-6">
          <span>Privacy Protocol: ISO 27001 Certified</span>
          <span>End-to-End Encryption Active</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
          System Latency: 42ms
        </div>
      </footer>
    </div>
  );
}
