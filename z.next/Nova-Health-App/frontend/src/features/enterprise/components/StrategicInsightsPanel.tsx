import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function StrategicInsightsPanel() {
  return (
    <Card className="col-span-12 lg:col-span-4 flex flex-col border-0 ring-0 p-0">
      <CardContent className="flex-1 bg-primary text-white p-10 rounded-[2.5rem] relative overflow-hidden shadow-xl">
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
            <Button className="w-full mt-4 py-4 h-auto bg-white text-primary rounded-2xl font-bold text-sm hover:bg-surface transition-colors">
              View Detailed Analysis
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
