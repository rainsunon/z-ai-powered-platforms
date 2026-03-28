import React from 'react';
import { Badge } from '@/components/ui/badge';

interface MessageDateDividerProps {
  date: string;
}

export function MessageDateDivider({ date }: MessageDateDividerProps) {
  return (
    <div className="flex justify-center">
      <span className="px-4 py-1 rounded-full bg-surface-container text-stone-400 text-[10px] font-bold uppercase tracking-widest">{date}</span>
    </div>
  );
}

interface ReceivedMessageProps {
  avatarSrc: string;
  avatarAlt: string;
  messages: string[];
  time: string;
}

export function ReceivedMessage({ avatarSrc, avatarAlt, messages, time }: ReceivedMessageProps) {
  return (
    <div className="flex gap-4 max-w-[80%]">
      <img alt={avatarAlt} className="w-8 h-8 rounded-full object-cover self-end mb-2 shadow-sm" src={avatarSrc} />
      <div className="space-y-1">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`bg-surface-container-high text-on-surface-variant p-4 text-sm leading-relaxed shadow-sm ${
              messages.length === 1
                ? 'rounded-2xl'
                : i === 0
                  ? 'rounded-t-2xl rounded-br-2xl'
                  : i === messages.length - 1
                    ? 'rounded-b-2xl rounded-tr-2xl'
                    : 'rounded-r-2xl'
            }`}
          >
            {msg}
          </div>
        ))}
        <p className="text-[10px] text-stone-400 ml-1 font-medium">{time}</p>
      </div>
    </div>
  );
}

interface SentMessageProps {
  message: string;
  time: string;
  isRead?: boolean;
}

export function SentMessage({ message, time, isRead }: SentMessageProps) {
  return (
    <div className="flex flex-row-reverse gap-4 max-w-[80%] ml-auto">
      <div className="space-y-1 flex flex-col items-end">
        <div className="bg-gradient-to-br from-primary to-primary-container text-white p-4 rounded-t-2xl rounded-bl-2xl text-sm leading-relaxed shadow-md shadow-primary/10">
          {message}
        </div>
        <div className="flex items-center gap-1.5 mt-1 mr-1">
          <p className="text-[10px] text-stone-400 font-medium">{time}</p>
          {isRead && (
            <span className="material-symbols-outlined text-primary text-[14px]" data-icon="done_all" style={{ fontVariationSettings: "'FILL' 1" }}>done_all</span>
          )}
        </div>
      </div>
    </div>
  );
}

interface DocumentMessageProps {
  avatarSrc: string;
  avatarAlt: string;
  fileName: string;
  fileSize: string;
  fileDescription: string;
  caption: string;
  time: string;
}

export function DocumentMessage({ avatarSrc, avatarAlt, fileName, fileSize, fileDescription, caption, time }: DocumentMessageProps) {
  return (
    <div className="flex gap-4 max-w-[80%]">
      <img alt={avatarAlt} className="w-8 h-8 rounded-full object-cover self-end mb-2 shadow-sm" src={avatarSrc} />
      <div className="space-y-1">
        <div className="bg-surface-container-high text-on-surface-variant p-1 rounded-2xl shadow-sm border border-white/40 overflow-hidden">
          <div className="flex items-center gap-4 p-4 bg-white/60 rounded-xl">
            <div className="w-12 h-12 bg-secondary-container/50 rounded-lg flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-3xl" data-icon="description">description</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-on-surface">{fileName}</p>
              <p className="text-xs text-stone-500">{fileSize} • {fileDescription}</p>
            </div>
            <button className="p-2 rounded-full hover:bg-primary-container/20 text-primary transition-colors">
              <span className="material-symbols-outlined" data-icon="download">download</span>
            </button>
          </div>
          <div className="p-4 pt-3">
            <p className="text-sm leading-relaxed">{caption}</p>
          </div>
        </div>
        <p className="text-[10px] text-stone-400 ml-1 font-medium">{time}</p>
      </div>
    </div>
  );
}

export function TypingIndicator() {
  return (
    <div className="flex flex-row-reverse gap-4 max-w-[80%] ml-auto">
      <div className="bg-surface-container-high text-stone-400 px-6 py-3 rounded-full flex gap-1 items-center shadow-sm">
        <span className="w-1.5 h-1.5 bg-stone-300 rounded-full animate-bounce"></span>
        <span className="w-1.5 h-1.5 bg-stone-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
        <span className="w-1.5 h-1.5 bg-stone-300 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
      </div>
    </div>
  );
}
