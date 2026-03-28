import React from 'react';
import { Badge } from '@/components/ui/badge';

interface DashboardHeaderProps {
  title: string;
  description: string;
  user?: {
    title?: string;
    avatar?: string;
    location?: string;
  };
}

export function DashboardHeader({ title, description, user }: DashboardHeaderProps) {
  const userInitials = user?.title?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';

  return (
    <header className="flex justify-between items-end">
      <div className="max-w-2xl">
        <h1 className="font-headline font-extrabold text-5xl text-primary tracking-tight leading-none mb-4">
          {title}
        </h1>
        <p className="text-on-surface-variant text-lg max-w-lg leading-relaxed">
          {description}
        </p>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right mr-4">
          <p className="font-bold text-primary">{user?.title}</p>
          <Badge variant="outline" className="text-xs text-on-surface-variant">
            {user?.location || 'Luminous Sanctuary HQ'}
          </Badge>
        </div>
        <div className="w-14 h-14 rounded-full bg-surface-container-highest overflow-hidden ring-4 ring-surface-container-lowest shadow-sm flex items-center justify-center">
          {user?.avatar ? (
            <img src={user.avatar} alt="Executive Profile" className="w-full h-full object-cover" />
          ) : (
            <span className="text-primary font-bold">{userInitials}</span>
          )}
        </div>
      </div>
    </header>
  );
}
