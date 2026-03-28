import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';

interface ChatHeaderProps {
  doctorName: string;
  specialty: string;
  avatarSrc: string;
  isOnline?: boolean;
}

export function ChatHeader({ doctorName, specialty, avatarSrc, isOnline = true }: ChatHeaderProps) {
  return (
    <div className="px-8 py-5 bg-white/50 backdrop-blur-md flex items-center justify-between border-b border-surface-variant/10">
      <div className="flex items-center gap-4">
        <div className="relative">
          <img alt={doctorName} className="w-12 h-12 rounded-full object-cover ring-4 ring-primary-container/10" src={avatarSrc} />
          {isOnline && (
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-primary border-2 border-white rounded-full"></div>
          )}
        </div>
        <div>
          <h3 className="font-headline font-extrabold text-lg text-on-surface tracking-tight leading-tight">{doctorName}</h3>
          <p className="text-xs text-secondary font-semibold flex items-center gap-1">
            {isOnline && <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>}
            {specialty} • {isOnline ? 'Online' : 'Offline'}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger
              render={<Button variant="ghost" size="icon" className="rounded-full text-stone-500 hover:bg-surface-container" />}
            >
              <span className="material-symbols-outlined" data-icon="search">search</span>
            </TooltipTrigger>
            <TooltipContent>Search messages</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger
              render={<Button variant="ghost" size="icon" className="rounded-full text-stone-500 hover:bg-surface-container" />}
            >
              <span className="material-symbols-outlined" data-icon="info">info</span>
            </TooltipTrigger>
            <TooltipContent>Conversation info</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Button className="bg-primary text-white px-6 py-2.5 h-auto rounded-full flex items-center gap-2 font-headline font-bold text-sm shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-transform bg-gradient-to-br from-primary to-primary-container">
          <span className="material-symbols-outlined text-sm" data-icon="videocam">videocam</span>
          Start Video Call
        </Button>
      </div>
    </div>
  );
}
