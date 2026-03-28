import React from 'react';

export function ProfileAvatar() {
  return (
    <div className="w-28 h-28 rounded-3xl bg-primary-container border-4 border-surface-container-lowest shadow-lg flex items-center justify-center">
      <span className="material-symbols-outlined text-5xl text-on-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
    </div>
  );
}
