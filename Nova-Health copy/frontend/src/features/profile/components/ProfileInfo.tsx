import React from 'react';
import { useProfile } from '@/store/useProfileStore';
import { ProfileBadges } from './ProfileBadges';

export function ProfileInfo() {
  const profile = useProfile();

  return (
    <div className="flex-1 pt-2">
      <h2 className="text-4xl md:text-5xl font-headline font-extrabold text-on-surface tracking-tight">{profile.fullName}</h2>
      <p className="text-on-surface-variant mt-1">Member ID: {profile.memberId} · Since {profile.memberSince}</p>
      <ProfileBadges />
    </div>
  );
}
