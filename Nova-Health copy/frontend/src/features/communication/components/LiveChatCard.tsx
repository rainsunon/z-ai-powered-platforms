import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Agent {
  src: string;
  alt: string;
}

interface LiveChatCardProps {
  agents: Agent[];
  extraCount: number;
  waitMinutes: number;
  onStartChat: () => void;
}

export function LiveChatCard({ agents, extraCount, waitMinutes, onStartChat }: LiveChatCardProps) {
  return (
    <Card className="rounded-[2.5rem] border border-white relative overflow-hidden shadow-[0px_20px_40px_rgba(21,30,18,0.06)] glass-panel">
      <CardContent className="p-8">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-12 translate-x-12 blur-2xl" />

        {/* Live indicator */}
        <div className="flex items-center gap-3 mb-6">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary" />
          </span>
          <span className="text-sm font-bold text-primary uppercase tracking-widest">Live Now</span>
        </div>

        <h4 className="text-3xl font-headline font-extrabold mb-4 leading-tight">
          Need immediate assistance?
        </h4>
        <p className="text-on-surface/70 mb-8">
          Our specialists are ready to help you with any urgent health data concerns.
        </p>

        {/* Agent avatars */}
        <div className="flex -space-x-3 mb-8">
          {agents.map((agent) => (
            <img
              key={agent.alt}
              src={agent.src}
              alt={agent.alt}
              className="w-12 h-12 rounded-full border-4 border-white object-cover"
            />
          ))}
          <div className="w-12 h-12 rounded-full border-4 border-white bg-surface-container flex items-center justify-center text-xs font-bold text-on-surface-variant">
            +{extraCount}
          </div>
        </div>

        <Button
          size="lg"
          className="w-full py-5 rounded-2xl font-bold gap-3 bg-primary text-white hover:bg-on-primary-container shadow-lg shadow-primary/20"
          onClick={onStartChat}
        >
          <span className="material-symbols-outlined">forum</span>
          Start Live Chat
        </Button>

        <p className="text-center text-xs text-on-surface-variant mt-4">
          Estimated wait time: <span className="font-bold text-primary">{waitMinutes} mins</span>
        </p>
      </CardContent>
    </Card>
  );
}
