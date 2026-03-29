import React from 'react';
import { Badge } from '@/components/ui/badge';
import { SharedFileItem } from './SharedFileItem';

interface SharedFile {
  name: string;
  date: string;
  size: string;
  icon: string;
  iconBgClass: string;
  iconColorClass: string;
}

interface SharedFilesPanelProps {
  files: SharedFile[];
}

export function SharedFilesPanel({ files }: SharedFilesPanelProps) {
  return (
    <div className="flex-1 bg-surface-container-highest/30 rounded-[2rem] p-6 border border-white/20 flex flex-col">
      <h4 className="font-headline font-bold text-sm text-on-surface mb-4 flex items-center justify-between">
        Shared Files
        <span className="text-[10px] text-primary font-bold">View All</span>
      </h4>
      <div className="space-y-3">
        {files.map((file) => (
          <SharedFileItem key={file.name} {...file} />
        ))}
      </div>

      {/* Pulse Metric Mini Card */}
      <div className="mt-auto bg-gradient-to-br from-primary to-primary-container p-5 rounded-3xl text-white shadow-xl shadow-primary/20">
        <div className="flex justify-between items-start mb-4">
          <span className="material-symbols-outlined" data-icon="favorite" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
          <Badge className="bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border-0 h-auto">LIVE</Badge>
        </div>
        <p className="text-[10px] font-medium opacity-80 uppercase tracking-widest">Avg Heart Rate</p>
        <div className="flex items-baseline gap-2">
          <p className="text-3xl font-headline font-extrabold">72</p>
          <p className="text-sm font-medium opacity-90">BPM</p>
        </div>
        <div className="w-full h-1.5 bg-white/20 rounded-full mt-4 overflow-hidden">
          <div className="w-[72%] h-full bg-white rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
