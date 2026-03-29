import React from 'react';
import { useProfile } from '@/store/useProfileStore';

export function ProfileBadges() {
  const profile = useProfile();

  const badges = React.useMemo(() => [
    { label: profile.bloodType, icon: 'bloodtype', color: 'primary' },
    { label: profile.height, icon: 'height', color: 'secondary' },
    { label: profile.weight, icon: 'monitor_weight', color: 'tertiary' },
  ], [profile.bloodType, profile.height, profile.weight]);

  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {badges.map((badge) => (
        <span
          key={badge.label}
          className={`text-[11px] font-bold uppercase tracking-wider bg-${badge.color}-container/30 text-${badge.color} px-3 py-1 rounded-full flex items-center gap-1`}
        >
          <span className="material-symbols-outlined text-[14px]">{badge.icon}</span>
          {badge.label}
        </span>
      ))}
    </div>
  );
}
