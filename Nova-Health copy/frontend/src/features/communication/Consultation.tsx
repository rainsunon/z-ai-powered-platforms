import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { VideoArea } from './components/VideoArea';
import { SessionNotesPanel } from './components/SessionNotesPanel';

const symptoms = [
  { label: 'Migraine', variant: 'error' as const },
  { label: 'Fatigue', variant: 'secondary' as const },
];

const DOCTOR_NOTES = "Patient reporting increased frequency of migraines over the last 7 days. Will discuss adjusting Lisinopril dosage and reviewing sleep patterns.";

export function Consultation() {
  const navigate = useNavigate();
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline font-bold text-3xl text-on-surface">Consultation</h1>
          <p className="font-body text-outline mt-1">Dr. Sarah Aris • Neurology Follow-up</p>
        </div>
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="px-4 py-2 h-auto rounded-xl bg-surface-container-highest text-on-surface-variant font-headline font-semibold hover:bg-outline-variant/30 transition-colors flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          Back to Dashboard
        </Button>
      </div>

      <div className="flex-1 grid lg:grid-cols-3 gap-6 min-h-0">
        <VideoArea
          doctorName="Dr. Sarah Aris"
          doctorImageSrc="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=2070&auto=format&fit=crop"
          selfImageSrc="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1976&auto=format&fit=crop"
          isMuted={isMuted}
          isVideoOff={isVideoOff}
          onToggleMute={() => setIsMuted(!isMuted)}
          onToggleVideo={() => setIsVideoOff(!isVideoOff)}
          onEndCall={() => navigate('/')}
        />

        <SessionNotesPanel
          symptoms={symptoms}
          doctorNotes={DOCTOR_NOTES}
          doctorName="Dr. Aris"
        />
      </div>
    </div>
  );
}
