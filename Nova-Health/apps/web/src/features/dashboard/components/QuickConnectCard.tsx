import React from 'react';
import { useNavigate } from 'react-router-dom';

export function QuickConnectCard() {
  const navigate = useNavigate();

  return (
    <div className="bg-surface-container-highest p-6 rounded-[2rem]">
      <h3 className="font-headline font-bold text-sm uppercase tracking-widest text-outline mb-4">
        Quick Connect
      </h3>
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => navigate('/consultation')}
          className="flex flex-col items-center justify-center p-4 bg-surface-container-lowest rounded-2xl hover:bg-primary-fixed transition-colors"
        >
          <span className="material-symbols-outlined text-primary mb-2">videocam</span>
          <span className="text-xs font-bold">Teleconsult</span>
        </button>
        <button
          onClick={() => navigate('/chat')}
          className="flex flex-col items-center justify-center p-4 bg-surface-container-lowest rounded-2xl hover:bg-primary-fixed transition-colors"
        >
          <span className="material-symbols-outlined text-primary mb-2">chat_bubble</span>
          <span className="text-xs font-bold">Message Lab</span>
        </button>
      </div>
    </div>
  );
}
