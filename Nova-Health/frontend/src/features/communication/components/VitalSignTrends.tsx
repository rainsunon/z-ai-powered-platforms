import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function VitalSignTrends() {
  return (
    <Card className="col-span-12 lg:col-span-8 rounded-3xl shadow-sm border-0 bg-surface-container-lowest">
      <CardContent className="p-10">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h4 className="text-2xl font-bold font-headline">Vital Sign Trends</h4>
            <p className="text-stone-500 text-sm">Real-time heart rate and activity correlation</p>
          </div>
          <div className="flex gap-4">
            <Button variant="ghost" size="icon" className="text-stone-400 hover:text-emerald-700">
              <span className="material-symbols-outlined">download</span>
            </Button>
            <Button variant="ghost" size="icon" className="text-stone-400 hover:text-emerald-700">
              <span className="material-symbols-outlined">more_vert</span>
            </Button>
          </div>
        </div>

        {/* Mock Chart Visualization */}
        <div className="relative h-64 w-full flex items-end justify-between px-4 gap-2">
          {/* Background grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between py-2 border-l border-b border-stone-100">
            <div className="w-full border-t border-stone-50/50" />
            <div className="w-full border-t border-stone-50/50" />
            <div className="w-full border-t border-stone-50/50" />
            <div className="w-full border-t border-stone-50/50" />
          </div>
          {/* SVG Line Chart Mockup */}
          <svg className="absolute inset-0 h-full w-full pointer-events-none" preserveAspectRatio="none">
            <path d="M0 180 Q 50 160, 100 190 T 200 140 T 300 170 T 400 120 T 500 150 T 600 130 T 700 160 T 800 100" fill="none" stroke="#066e00" strokeLinecap="round" strokeWidth="4" />
            <path d="M0 220 Q 50 200, 100 230 T 200 180 T 300 210 T 400 160 T 500 190 T 600 170 T 700 200 T 800 140" fill="none" opacity="0.4" stroke="#1dcc0d" strokeDasharray="8 4" strokeWidth="2" />
          </svg>
          {/* Chart Labels */}
          <div className="absolute -bottom-8 w-full flex justify-between text-[10px] font-bold text-stone-400 uppercase tracking-tighter">
            <span>Mon 01</span><span>Wed 03</span><span>Fri 05</span><span>Sun 07</span><span>Tue 09</span><span>Thu 11</span><span>Sat 13</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
