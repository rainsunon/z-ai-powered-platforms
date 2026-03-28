import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
        <button 
          onClick={() => navigate('/')}
          className="px-4 py-2 rounded-xl bg-surface-container-highest text-on-surface-variant font-headline font-semibold hover:bg-outline-variant/30 transition-colors flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          Back to Dashboard
        </button>
      </div>

      <div className="flex-1 grid lg:grid-cols-3 gap-6 min-h-0">
        {/* Video Area */}
        <div className="lg:col-span-2 relative rounded-3xl overflow-hidden bg-surface-container-highest border border-surface-variant/50 shadow-sm flex flex-col">
          {/* Main Video (Doctor) */}
          <div className="flex-1 relative bg-black">
            <img 
              src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=2070&auto=format&fit=crop" 
              alt="Dr. Sarah Aris" 
              className="w-full h-full object-cover opacity-90"
            />
            <div className="absolute bottom-6 left-6 bg-black/50 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
              <span className="font-headline font-semibold text-white">Dr. Sarah Aris</span>
            </div>
          </div>

          {/* Self Video (Patient) */}
          <div className="absolute top-6 right-6 w-48 aspect-video bg-black rounded-2xl overflow-hidden border-2 border-surface-container-lowest shadow-xl">
            {!isVideoOff ? (
              <img 
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1976&auto=format&fit=crop" 
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

          {/* Controls */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-surface-container-lowest/90 backdrop-blur-xl px-6 py-4 rounded-3xl border border-surface-variant/50 shadow-2xl">
            <button 
              onClick={() => setIsMuted(!isMuted)}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${isMuted ? 'bg-error-container text-on-error-container' : 'bg-surface-container-highest text-on-surface-variant hover:bg-outline-variant/30'}`}
            >
              <span className="material-symbols-outlined">{isMuted ? 'mic_off' : 'mic'}</span>
            </button>
            <button 
              onClick={() => setIsVideoOff(!isVideoOff)}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${isVideoOff ? 'bg-error-container text-on-error-container' : 'bg-surface-container-highest text-on-surface-variant hover:bg-outline-variant/30'}`}
            >
              <span className="material-symbols-outlined">{isVideoOff ? 'videocam_off' : 'videocam'}</span>
            </button>
            <button className="w-12 h-12 rounded-full flex items-center justify-center bg-surface-container-highest text-on-surface-variant hover:bg-outline-variant/30 transition-colors">
              <span className="material-symbols-outlined">present_to_all</span>
            </button>
            <div className="w-px h-8 bg-outline-variant/30 mx-2"></div>
            <button 
              onClick={() => navigate('/')}
              className="px-6 py-3 rounded-full bg-error text-on-error font-headline font-bold shadow-lg shadow-error/20 hover:shadow-xl hover:shadow-error/30 hover:-translate-y-0.5 transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined">call_end</span>
              End Call
            </button>
          </div>
        </div>

        {/* Sidebar (Notes & Chat) */}
        <div className="bg-surface-container-lowest rounded-3xl border border-surface-variant/50 shadow-sm flex flex-col overflow-hidden">
          <div className="p-6 border-b border-surface-variant/50">
            <h2 className="font-headline font-bold text-xl text-on-surface">Session Notes</h2>
          </div>
          <div className="flex-1 p-6 overflow-y-auto space-y-6">
            <div className="space-y-2">
              <h3 className="font-headline font-semibold text-sm text-on-surface-variant">Current Symptoms</h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-error-container text-on-error-container rounded-lg text-xs font-semibold">Migraine</span>
                <span className="px-3 py-1 bg-secondary-container text-on-secondary-container rounded-lg text-xs font-semibold">Fatigue</span>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="font-headline font-semibold text-sm text-on-surface-variant">Doctor's Notes</h3>
              <p className="font-body text-sm text-outline leading-relaxed">
                Patient reporting increased frequency of migraines over the last 7 days. Will discuss adjusting Lisinopril dosage and reviewing sleep patterns.
              </p>
            </div>
          </div>
          <div className="p-4 border-t border-surface-variant/50 bg-surface-container-low">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Type a message to Dr. Aris..." 
                className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-2xl py-3 pl-4 pr-12 font-body text-sm text-on-surface placeholder:text-outline focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-primary text-on-primary flex items-center justify-center hover:bg-primary-container hover:text-on-primary-container transition-colors">
                <span className="material-symbols-outlined text-[18px]">send</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
