import React from 'react';

interface DeleteConfirmDialogProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteConfirmDialog({ onConfirm, onCancel }: DeleteConfirmDialogProps) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onCancel}>
      <div className="bg-surface-container-lowest rounded-3xl p-8 w-full max-w-sm shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-error-container flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-error text-3xl">delete_forever</span>
          </div>
          <h3 className="font-headline font-bold text-xl text-on-surface mb-2">Delete Medication?</h3>
          <p className="font-body text-outline">This will remove medication from your schedule.</p>
        </div>
        <div className="flex gap-3 mt-6">
          <button
            onClick={onCancel}
            className="flex-1 px-6 py-3 rounded-xl bg-surface-container text-on-surface-variant font-headline font-bold hover:bg-surface-container-high transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-6 py-3 rounded-xl bg-error text-on-error font-headline font-bold hover:bg-error/90 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
