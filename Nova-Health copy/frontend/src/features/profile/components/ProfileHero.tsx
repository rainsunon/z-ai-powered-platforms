import React from 'react';
import { ProfileAvatar } from './ProfileAvatar';
import { ProfileInfo } from './ProfileInfo';
import { ProfileActions } from './ProfileActions';

export function ProfileHero() {
  return (
    <section className="bg-surface-container-lowest rounded-[2rem] shadow-sm overflow-hidden">
      <div className="h-32 bg-gradient-to-r from-primary via-primary/80 to-secondary relative">
        <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
      </div>
      <div className="px-8 pb-8 -mt-14">
        <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
          <ProfileAvatar />
          <ProfileInfo />
          <ProfileActions />
        </div>
      </div>
    </section>
  );
}
