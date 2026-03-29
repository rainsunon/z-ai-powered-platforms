import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function AIInsightsCard() {
  return (
    <Card className="col-span-12 lg:col-span-4 rounded-3xl border-0 primary-gradient text-white shadow-xl shadow-emerald-200/50">
      <CardContent className="p-10 flex flex-col justify-between h-full">
        <div>
          <div className="flex items-center gap-2 mb-6">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
              auto_awesome
            </span>
            <span className="text-xs font-bold uppercase tracking-widest">AI Insights</span>
          </div>
          <h4 className="text-3xl font-bold font-headline mb-4 leading-tight">
            Your health is glowing this month, Alex.
          </h4>
          <p className="text-white/80 leading-relaxed font-light mb-8">
            Based on your activity levels, your resting heart rate has decreased by 3 BPM. We've noticed a
            correlation between your 9:00 PM wind-down routine and improved REM sleep cycles.
          </p>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
            <p className="text-xs font-bold text-white mb-2">Recommendation</p>
            <p className="text-sm">
              Increase magnesium intake on high-activity days to sustain these recovery trends.
            </p>
          </div>
        </div>
        <Button
          className="mt-8 gap-2 text-sm font-bold bg-white text-emerald-900 py-3 rounded-xl hover:bg-emerald-50"
        >
          View Detailed Insights
          <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </Button>
      </CardContent>
    </Card>
  );
}
