import React from 'react';
import { VideoControls } from './VideoControls';

interface VideoAreaProps {
  doctorName: string;
  doctorImageSrc: string;
  selfImageSrc: string;
  isMuted: boolean;
  isVideoOff: boolean;
  onToggleMute: () => void;
  onToggleVideo: () => void;
  onEndCall: () => void;
}

export function VideoArea({ doctorName, doctorImageSrc, selfImageSrc, isMuted, isVideoOff, onToggleMute, onToggleVideo, onEndCall }: VideoAreaProps) {
  return (
    <div className="lg:col-span-2 relative rounded-3xl overflow-hidden bg-surface-container-highest border border-surface-variant/50 shadow-sm flex flex-col">
      {/* Main Video (Doctor) */}
      <div className="flex-1 relative bg-black">
        <img
          src={doctorImageSrc}
          alt={doctorName}
          className="w-full h-full object-cover opacity-90"
        />
        <div className="absolute bottom-6 left-6 bg-black/50 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
          <span className="font-headline font-semibold text-white">{doctorName}</span>
        </div>
      </div>

      {/* Self Video (Patient) */}
      <div className="absolute top-6 right-6 w-48 aspect-video bg-black rounded-2xl overflow-hidden border-2 border-surface-container-lowest shadow-xl">
        {!isVideoOff ? (
          <img
            src={selfImageSrc}
            alt="You"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-surface-container-highest">
            <span className="material-symbols-outlined text-4xl text-outline">videocam_off</span>
          </div>
        )}
        <div className="absolute bottom-2 left-2 bg-black/50 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10">
          <span className="font-headline font-semibold text-white text-xs">You</span>
        </div>
      </div>

      <VideoControls
        isMuted={isMuted}
        isVideoOff={isVideoOff}
        onToggleMute={onToggleMute}
        onToggleVideo={onToggleVideo}
        onEndCall={onEndCall}
      />
    </div>
  );
}
