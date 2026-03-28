import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { day: 'Mon', recovery: 40, target: 60 },
  { day: 'Tue', recovery: 65, target: 60 },
  { day: 'Wed', recovery: 55, target: 60 },
  { day: 'Thu', recovery: 85, target: 60 },
  { day: 'Fri', recovery: 45, target: 60 },
  { day: 'Sat', recovery: 100, target: 60 },
  { day: 'Sun', recovery: 20, target: 60 },
];

export function VitalRecoveryChart() {
  return (
    <div className="bg-surface-container-low p-6 rounded-[2rem] flex flex-col justify-between">
      <div>
        <h3 className="font-headline font-bold text-xl mb-1">Vital Recovery</h3>
        <p className="text-xs text-outline">Post-workout metrics analysis</p>
      </div>
      <div className="h-40 mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-outline-variant)" opacity={0.3} />
            <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'var(--color-outline)' }} axisLine={false} tickLine={false} />
            <YAxis hide />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--color-surface-container-lowest)',
                border: '1px solid var(--color-outline-variant)',
                borderRadius: '12px',
                fontSize: 12,
              }}
              formatter={(value: number) => [`${value}%`, 'Recovery']}
            />
            <Bar dataKey="recovery" fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
