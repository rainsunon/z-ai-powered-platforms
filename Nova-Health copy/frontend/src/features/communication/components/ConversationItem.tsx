import React from 'react';

interface ConversationItemProps {
  name: string;
  avatarSrc?: string;
  avatarInitials?: string;
  lastMessage: string;
  time: string;
  isActive?: boolean;
  isOnline?: boolean;
  unreadCount?: number;
}

export function ConversationItem({ name, avatarSrc, avatarInitials, lastMessage, time, isActive, isOnline, unreadCount }: ConversationItemProps) {
  return (
    <div className={`px-4 py-3 mx-2 ${isActive ? 'bg-primary-container/10' : 'hover:bg-surface-container'} rounded-2xl flex items-center gap-3 cursor-pointer transition-colors group mt-1`}>
      <div className="relative">
        {avatarSrc ? (
          <img alt={name} className={`w-12 h-12 rounded-full object-cover ${!isActive && !isOnline ? 'grayscale-[0.5]' : ''}`} src={avatarSrc} />
        ) : (
          <div className="w-12 h-12 rounded-full bg-tertiary-fixed flex items-center justify-center text-tertiary font-bold">
            {avatarInitials}
          </div>
        )}
        <span className={`absolute bottom-0 right-0 w-3.5 h-3.5 ${isOnline ? 'bg-primary' : 'bg-stone-300'} border-2 border-white rounded-full`}></span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline">
          <p className="font-bold text-on-surface truncate">{name}</p>
          <span className={`text-[10px] font-bold ${isActive ? 'text-primary' : 'text-stone-400'}`}>{time}</span>
        </div>
        <div className="flex justify-between items-center">
          <p className={`text-xs truncate ${isActive ? 'text-on-surface-variant font-medium' : 'text-stone-500'}`}>{lastMessage}</p>
          {unreadCount && unreadCount > 0 && (
            <span className="bg-primary text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">{unreadCount}</span>
          )}
        </div>
      </div>
    </div>
  );
}
