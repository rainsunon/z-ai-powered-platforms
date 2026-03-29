import React from 'react';

interface SwitchAccountModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  memberName: string;
  memberRole: string;
  memberAvatar: string;
  memberColor: string;
}

export function SwitchAccountModal({ open, onClose, onConfirm, memberName, memberRole, memberAvatar, memberColor }: SwitchAccountModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm" onClick={onClose}></div>

      {/* Modal */}
      <div className="relative bg-surface-container-lowest/95 backdrop-blur-2xl rounded-[2rem] shadow-2xl shadow-on-surface/15 max-w-md w-full p-10 text-center animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center transition-colors"
        >
          <span className="material-symbols-outlined text-on-surface-variant">close</span>
        </button>

        {/* Avatar */}
        <div className="flex justify-center mb-6">
          <div className={`w-24 h-24 rounded-[1.75rem] ${memberColor} text-white flex items-center justify-center shadow-xl shadow-primary/20`}>
            <span className="material-symbols-outlined text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>{memberAvatar}</span>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-extrabold font-headline text-on-surface mb-2">Switch to {memberName}?</h2>
        <p className="text-on-surface-variant mb-2">{memberRole} Account</p>

        {/* Security Notice */}
        <div className="bg-surface-container rounded-2xl p-5 my-8 text-left">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-primary mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>shield</span>
            <div>
              <p className="text-sm font-bold text-on-surface mb-1">Security Notice</p>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                You are switching to a different family member's profile. All actions will be performed under their account permissions. Your session will be securely transferred.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={onConfirm}
            className="w-full primary-gradient text-white font-headline font-bold py-4 rounded-2xl shadow-lg shadow-primary/20 hover:opacity-90 transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined">swap_horiz</span>
            Switch Account
          </button>
          <button
            onClick={onClose}
            className="w-full bg-surface-container text-on-surface font-headline font-bold py-4 rounded-2xl hover:bg-surface-container-high transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
