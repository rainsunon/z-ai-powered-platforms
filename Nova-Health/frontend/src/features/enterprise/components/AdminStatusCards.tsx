import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const statusCards = [
  {
    icon: 'dns',
    iconBg: 'bg-secondary-container text-on-secondary-container',
    label: 'Server Uptime',
    labelColor: 'text-primary',
    value: '99.9%',
    description: 'Operational (30 Days)',
  },
  {
    icon: 'speed',
    iconBg: 'bg-tertiary-container text-on-tertiary-container',
    label: 'API Latency',
    labelColor: 'text-tertiary',
    value: '240ms',
    description: 'Avg Response Time',
  },
];

export function AdminStatusCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {statusCards.map((card) => (
        <Card key={card.label} className="bg-surface-container-lowest p-6 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between border-0">
          <div className="flex justify-between items-start">
            <div className={`p-3 ${card.iconBg} rounded-2xl`}>
              <span className="material-symbols-outlined">{card.icon}</span>
            </div>
            <span className={`${card.labelColor} font-bold text-xs uppercase`}>{card.label}</span>
          </div>
          <div className="mt-8">
            <div className="text-3xl font-black font-headline text-on-surface">{card.value}</div>
            <p className="text-on-surface-variant text-sm mt-1">{card.description}</p>
          </div>
        </Card>
      ))}

      {/* Security Shield - highlighted card */}
      <Card className="bg-primary text-on-primary p-6 rounded-[2rem] shadow-lg flex flex-col justify-between relative overflow-hidden border-0">
        <div className="relative z-10 flex justify-between items-start">
          <div className="p-3 bg-white/20 rounded-2xl">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>security</span>
          </div>
          <span className="font-bold text-xs uppercase opacity-80">Security Shield</span>
        </div>
        <div className="relative z-10 mt-8">
          <div className="text-3xl font-black font-headline">12,482</div>
          <p className="text-sm mt-1 opacity-90">Blocked Threats (24h)</p>
        </div>
        <div className="absolute -right-4 -bottom-4 opacity-10">
          <span className="material-symbols-outlined" style={{ fontSize: '9rem' }}>verified_user</span>
        </div>
      </Card>

      {/* Active Nodes */}
      <Card className="bg-surface-container-lowest p-6 rounded-[2rem] shadow-sm flex flex-col justify-between border-0">
        <div className="flex justify-between items-start">
          <div className="p-3 bg-outline-variant/30 text-on-surface-variant rounded-2xl">
            <span className="material-symbols-outlined">hub</span>
          </div>
          <span className="text-on-surface-variant font-bold text-xs uppercase">Active Nodes</span>
        </div>
        <div className="mt-8 flex items-end gap-1 h-12">
          {[60, 80, 70, 90, 100].map((h, i) => (
            <div key={i} className="w-2 rounded-full" style={{ height: `${h}%`, opacity: 0.2 + i * 0.2, backgroundColor: 'var(--tw-primary, #066e00)' }}></div>
          ))}
          <div className="flex-1 ml-2">
            <div className="text-xl font-black font-headline text-on-surface">32/32</div>
          </div>
        </div>
      </Card>
    </div>
  );
}
