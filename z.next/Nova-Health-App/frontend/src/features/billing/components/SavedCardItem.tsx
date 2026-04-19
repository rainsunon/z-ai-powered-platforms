import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface SavedCardItemProps {
  brand: string;
  last4: string;
  expires: string;
  imageUrl: string;
  selected?: boolean;
}

export function SavedCardItem({ brand, last4, expires, imageUrl, selected }: SavedCardItemProps) {
  return (
    <Card
      className={`rounded-3xl cursor-pointer transition-all hover:shadow-md ${
        selected ? 'border-2 border-primary shadow-sm' : 'border-outline-variant/30'
      }`}
    >
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4">
            <div className="w-14 h-10 rounded-lg bg-on-surface/5 flex items-center justify-center">
              <img src={imageUrl} alt={brand} className="w-10 grayscale opacity-80" />
            </div>
            <div>
              <p className="font-bold text-on-surface">{brand} ending in {last4}</p>
              <p className="text-sm text-on-surface/50">Expires {expires}</p>
            </div>
          </div>
          {selected && (
            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-xs">check</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
