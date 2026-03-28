import React, { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

const vitalReadings = [
  { date: 'Oct 25', heartRate: 72, systolic: 118, diastolic: 76, spo2: 98, temp: 98.4 },
  { date: 'Oct 24', heartRate: 68, systolic: 120, diastolic: 78, spo2: 97, temp: 98.6 },
  { date: 'Oct 23', heartRate: 75, systolic: 115, diastolic: 74, spo2: 99, temp: 98.2 },
  { date: 'Oct 22', heartRate: 70, systolic: 122, diastolic: 80, spo2: 98, temp: 98.5 },
  { date: 'Oct 21', heartRate: 74, systolic: 119, diastolic: 77, spo2: 97, temp: 98.3 },
  { date: 'Oct 20', heartRate: 66, systolic: 116, diastolic: 75, spo2: 99, temp: 98.1 },
  { date: 'Oct 19', heartRate: 71, systolic: 121, diastolic: 79, spo2: 98, temp: 98.7 },
];

export function VitalsTracking() {
  const latestReading = vitalReadings[0];

  return (
    <div className="space-y-12 max-w-6xl mx-auto pb-20">
      {/* Hero */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-5xl font-extrabold font-headline tracking-tight text-on-surface mb-2">Vitals Tracking</h2>
          <p className="text-on-surface-variant text-lg max-w-xl">Real-time monitoring of your core vital signs with trend analysis and AI-powered insights.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-surface-container-high text-primary font-bold px-6 py-3 rounded-full hover:bg-surface-container-highest transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined">download</span> Export Data
          </button>
          <button className="primary-gradient text-white font-bold px-6 py-3 rounded-full shadow-lg hover:opacity-95 transition-opacity flex items-center gap-2">
            <span className="material-symbols-outlined">add</span> Log Reading
          </button>
        </div>
      </div>

      {/* Top Vitals Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Heart Rate — Large */}
        <div className="md:col-span-2 bg-primary-gradient rounded-[2rem] p-10 text-white flex flex-col justify-between overflow-hidden relative shadow-lg">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
              <p className="text-sm font-medium opacity-80 uppercase tracking-widest">Heart Rate</p>
            </div>
            <div className="flex items-baseline gap-3">
              <h3 className="text-6xl font-extrabold tracking-tighter">{latestReading.heartRate}</h3>
              <span className="text-xl opacity-70">BPM</span>
            </div>
            <p className="text-sm opacity-70 mt-2">Resting • Last measured 2 hours ago</p>
          </div>
          <div className="mt-8 relative z-10 flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-md">
              <span className="material-symbols-outlined text-[18px]">trending_down</span>
              <span>-3 BPM from last week</span>
            </div>
            <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Normal Range</span>
          </div>
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
        </div>

        {/* Blood Pressure */}
        <div className="bg-surface-container-lowest p-8 rounded-3xl shadow-sm border-b-4 border-primary">
          <div className="flex justify-between items-start mb-4">
            <span className="material-symbols-outlined text-primary bg-primary-container/20 p-3 rounded-2xl">blood_pressure</span>
            <span className="text-xs font-bold text-primary bg-primary-container/20 px-2 py-1 rounded-full">Normal</span>
          </div>
          <p className="text-on-surface-variant text-sm font-medium mb-1">Blood Pressure</p>
          <h3 className="text-3xl font-bold font-headline">{latestReading.systolic}/{latestReading.diastolic}</h3>
          <p className="text-xs text-on-surface-variant mt-2">mmHg • Systolic/Diastolic</p>
        </div>

        {/* SpO2 */}
        <div className="bg-surface-container-lowest p-8 rounded-3xl shadow-sm border-b-4 border-secondary">
          <div className="flex justify-between items-start mb-4">
            <span className="material-symbols-outlined text-secondary bg-secondary-container p-3 rounded-2xl">spo2</span>
            <span className="text-xs font-bold text-secondary bg-secondary-container px-2 py-1 rounded-full">Excellent</span>
          </div>
          <p className="text-on-surface-variant text-sm font-medium mb-1">Oxygen Saturation</p>
          <h3 className="text-3xl font-bold font-headline">{latestReading.spo2}<span className="text-lg font-normal text-on-surface-variant">%</span></h3>
          <p className="text-xs text-on-surface-variant mt-2">SpO2 • Pulse Oximeter</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-12 gap-8">
        {/* Vital Trends Chart (8 cols) */}
        <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest p-10 rounded-3xl shadow-sm">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h4 className="text-2xl font-bold font-headline">7-Day Trend</h4>
              <p className="text-on-surface-variant text-sm">Heart rate and blood pressure over the past week</p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2 text-xs font-bold">
                <div className="w-3 h-3 rounded-full bg-primary"></div>
                <span className="text-on-surface-variant">Heart Rate</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold">
                <div className="w-3 h-3 rounded-full bg-secondary"></div>
                <span className="text-on-surface-variant">Systolic BP</span>
              </div>
            </div>
          </div>
          {/* Mock Chart */}
          <div className="relative h-48 w-full">
            <div className="absolute inset-0 flex flex-col justify-between">
              <div className="w-full border-t border-outline-variant/10"></div>
              <div className="w-full border-t border-outline-variant/10"></div>
              <div className="w-full border-t border-outline-variant/10"></div>
              <div className="w-full border-t border-outline-variant/10"></div>
              <div className="w-full border-t border-outline-variant/10"></div>
            </div>
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 700 200" preserveAspectRatio="none">
              <path d="M0 120 L100 140 L200 100 L300 130 L400 110 L500 150 L600 125 L700 120" fill="none" stroke="#066e00" strokeWidth="3" strokeLinecap="round" />
              <path d="M0 60 L100 50 L200 70 L300 45 L400 55 L500 65 L600 50 L700 58" fill="none" stroke="#1dcc0d" strokeWidth="2" strokeDasharray="6 3" strokeLinecap="round" opacity="0.6" />
            </svg>
            <div className="absolute -bottom-6 w-full flex justify-between text-[10px] font-bold text-on-surface-variant uppercase tracking-tighter">
              {vitalReadings.slice().reverse().map(r => (
                <span key={r.date}>{r.date}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Additional Vitals (4 cols) */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
          {/* Body Temperature */}
          <div className="bg-surface-container-high p-8 rounded-3xl">
            <div className="flex items-center gap-4 mb-6">
              <span className="material-symbols-outlined text-tertiary bg-tertiary-container p-3 rounded-2xl">thermostat</span>
              <div>
                <p className="text-on-surface-variant text-sm font-medium">Body Temperature</p>
                <h3 className="text-2xl font-bold font-headline">{latestReading.temp}°F</h3>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-primary">
              <span className="material-symbols-outlined text-[14px]">check_circle</span>
              <span>Within normal range (97.8–99.1°F)</span>
            </div>
          </div>

          {/* Respiratory Rate */}
          <div className="bg-surface-container-high p-8 rounded-3xl">
            <div className="flex items-center gap-4 mb-6">
              <span className="material-symbols-outlined text-primary bg-primary-container/20 p-3 rounded-2xl">pulmonology</span>
              <div>
                <p className="text-on-surface-variant text-sm font-medium">Respiratory Rate</p>
                <h3 className="text-2xl font-bold font-headline">16 <span className="text-sm font-normal text-on-surface-variant">breaths/min</span></h3>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-primary">
              <span className="material-symbols-outlined text-[14px]">check_circle</span>
              <span>Normal (12-20 breaths/min)</span>
            </div>
          </div>

          {/* AI Alert */}
          <div className="primary-gradient p-8 rounded-3xl text-white">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
              <span className="text-xs font-bold uppercase tracking-widest">AI Alert</span>
            </div>
            <p className="font-bold mb-2">Your resting heart rate trend looks great.</p>
            <p className="text-sm text-white/80">The downward trend in your resting heart rate suggests improving cardiovascular fitness. Keep up the activity!</p>
          </div>
        </div>

        {/* Readings History Table (Full width) */}
        <div className="col-span-12 bg-surface-container-lowest p-10 rounded-3xl shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h4 className="text-2xl font-bold font-headline">Recent Readings</h4>
            <button className="text-primary font-bold text-sm hover:underline">View Full History</button>
          </div>
          <VirtualReadingsTable readings={vitalReadings} />
        </div>
      </div>
    </div>
  );
}

function VirtualReadingsTable({ readings }: { readings: typeof vitalReadings }) {
  const parentRef = useRef<HTMLDivElement>(null);
  const ROW_HEIGHT = 56;

  const virtualizer = useVirtualizer({
    count: readings.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 10,
  });

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-outline-variant/15">
            <th className="text-left font-bold text-on-surface-variant uppercase tracking-widest text-[10px] px-4 py-4">Date</th>
            <th className="text-center font-bold text-on-surface-variant uppercase tracking-widest text-[10px] px-4 py-4">Heart Rate</th>
            <th className="text-center font-bold text-on-surface-variant uppercase tracking-widest text-[10px] px-4 py-4">Blood Pressure</th>
            <th className="text-center font-bold text-on-surface-variant uppercase tracking-widest text-[10px] px-4 py-4">SpO2</th>
            <th className="text-center font-bold text-on-surface-variant uppercase tracking-widest text-[10px] px-4 py-4">Temp</th>
            <th className="text-center font-bold text-on-surface-variant uppercase tracking-widest text-[10px] px-4 py-4">Status</th>
          </tr>
        </thead>
      </table>
      <div
        ref={parentRef}
        className="overflow-y-auto hide-scrollbar"
        style={{ maxHeight: 400 }}
      >
        <div style={{ height: virtualizer.getTotalSize(), position: 'relative' }}>
          {virtualizer.getVirtualItems().map((virtualRow) => {
            const r = readings[virtualRow.index];
            return (
              <div
                key={r.date}
                className="absolute top-0 left-0 w-full"
                style={{
                  height: virtualRow.size,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                <table className="w-full text-sm">
                  <tbody>
                    <tr className="hover:bg-surface-container-low/50 transition-colors">
                      <td className="px-4 py-4 font-medium">{r.date}, 2024</td>
                      <td className="px-4 py-4 text-center">
                        <span className="font-headline font-bold">{r.heartRate}</span>
                        <span className="text-on-surface-variant text-xs ml-1">BPM</span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className="font-headline font-bold">{r.systolic}/{r.diastolic}</span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className="font-headline font-bold">{r.spo2}%</span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className="font-headline font-bold">{r.temp}°F</span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className="text-[10px] font-black uppercase tracking-tighter bg-secondary-container text-secondary px-3 py-1 rounded-full">Normal</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
