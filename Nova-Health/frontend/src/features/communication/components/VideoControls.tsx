import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface VideoControlsProps {
  isMuted: boolean;
  isVideoOff: boolean;
  onToggleMute: () => void;
  onToggleVideo: () => void;
  onEndCall: () => void;
}

export function VideoControls({ isMuted, isVideoOff, onToggleMute, onToggleVideo, onEndCall }: VideoControlsProps) {
  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-surface-container-lowest/90 backdrop-blur-xl px-6 py-4 rounded-3xl border border-surface-variant/50 shadow-2xl">
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggleMute}
        className={`w-12 h-12 rounded-full transition-colors ${isMuted ? 'bg-error-container text-on-error-container hover:bg-error-container/80' : 'bg-surface-container-highest text-on-surface-variant hover:bg-outline-variant/30'}`}
      >
        <span className="material-symbols-outlined">{isMuted ? 'mic_off' : 'mic'}</span>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggleVideo}
        className={`w-12 h-12 rounded-full transition-colors ${isVideoOff ? 'bg-error-container text-on-error-container hover:bg-error-container/80' : 'bg-surface-container-highest text-on-surface-variant hover:bg-outline-variant/30'}`}
      >
        <span className="material-symbols-outlined">{isVideoOff ? 'videocam_off' : 'videocam'}</span>
      </Button>
      <Button variant="ghost" size="icon" className="w-12 h-12 rounded-full bg-surface-container-highest text-on-surface-variant hover:bg-outline-variant/30 transition-colors">
        <span className="material-symbols-outlined">present_to_all</span>
      </Button>
      <Separator orientation="vertical" className="h-8 bg-outline-variant/30 mx-2" />
      <Button
        onClick={onEndCall}
        className="px-6 py-3 h-auto rounded-full bg-error text-on-error font-headline font-bold shadow-lg shadow-error/20 hover:shadow-xl hover:shadow-error/30 hover:-translate-y-0.5 transition-all flex items-center gap-2 hover:bg-error/90"
      >
        <span className="material-symbols-outlined">call_end</span>
        End Call
      </Button>
    </div>
  );
}
