import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface EfficiencyItem {
  icon: string;
  iconBg: string;
  title: string;
  subtitle: string;
  value: string;
  trend: string;
  trendIcon: string;
}

interface ServiceEfficiencyPanelProps {
  items: EfficiencyItem[];
}

export function ServiceEfficiencyPanel({ items }: ServiceEfficiencyPanelProps) {
  return (
    <Card className="col-span-12 lg:col-span-7 bg-surface-container-low p-10 rounded-[2.5rem] ring-0 border-0">
      <CardHeader className="p-0 mb-8 flex-row justify-between items-center">
        <CardTitle className="font-headline text-2xl font-bold text-on-surface">Service Efficiency Overview</CardTitle>
        <Button variant="link" className="text-primary text-sm font-bold flex items-center gap-1 p-0 h-auto">
          <span>View All Reports</span>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
        </Button>
      </CardHeader>
      <CardContent className="p-0 space-y-4">
        {items.map((item) => (
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
      </CardContent>
    </Card>
  );
}
