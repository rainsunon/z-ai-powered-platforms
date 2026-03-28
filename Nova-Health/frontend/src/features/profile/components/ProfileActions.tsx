import React from 'react';
import { Button } from '@/components/ui/button';

export function ProfileActions() {
  return (
    <div className="flex gap-3">
      <Button variant="outline" className="bg-surface-container-high text-on-surface font-bold px-6 py-3 rounded-full hover:bg-surface-container-highest border-0">
        <span className="material-symbols-outlined text-lg mr-2">share</span>
        Share Records
      </Button>
      <Button className="primary-gradient text-white font-bold px-8 py-3 rounded-full shadow-lg hover:opacity-95 transition-opacity">
        <span className="material-symbols-outlined text-lg mr-2">edit</span>
        Edit Profile
      </Button>
    </div>
  );
}
