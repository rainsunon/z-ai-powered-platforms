import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface GrowthDataPoint {
  month: string;
  height: number;
  peak?: boolean;
}

interface GrowthTrendsChartProps {
  data: GrowthDataPoint[];
}

export function GrowthTrendsChart({ data }: GrowthTrendsChartProps) {
  return (
    <Card className="col-span-12 lg:col-span-8 bg-surface-container-lowest p-10 rounded-[2.5rem] shadow-sm ring-0 border-0">
      <CardHeader className="p-0 mb-10 flex-row justify-between items-center">
        <div>
          <CardTitle className="font-headline text-2xl font-bold text-on-surface">Household Growth Trends</CardTitle>
          <CardDescription className="text-on-surface-variant text-sm mt-1">Family account acquisition velocity (Last 6 Months)</CardDescription>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" className="px-4 py-2 h-auto rounded-full bg-surface-container text-xs font-semibold text-primary hover:bg-surface-container-high">Export Data</Button>
          <Button variant="outline" className="px-4 py-2 h-auto rounded-full bg-surface text-xs font-semibold border border-outline-variant/20 text-on-surface-variant hover:bg-surface-container">Filters</Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-80 w-full relative flex items-end justify-between px-4">
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="border-b border-outline-variant/10 w-full h-0"></div>
            ))}
          </div>
          <div className="relative w-full h-full flex items-end justify-between gap-4 pt-12">
            {data.map((d) => (
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
      </CardContent>
    </Card>
  );
}
