import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../store/store';
import { hideToast } from '../store/toastSlice';

const severityClassMap: Record<string, string> = {
  success: 'bg-success-bg border-success text-success',
  error: 'bg-error-bg border-error text-error',
  info: 'bg-info-bg border-info text-info',
  warning: 'bg-warning-bg border-warning text-warning',
};

/**
 * Global toast component driven by the Redux toast slice.
 */
export function Toast() {
  const { open, message, severity } = useAppSelector((s) => s.toast);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => dispatch(hideToast()), 4000);
    return () => clearTimeout(timer);
  }, [open, dispatch]);

  if (!open) return null;

  const cls = severityClassMap[severity] ?? severityClassMap.info;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fade-in-up">
      <div
        className={`flex items-center gap-3 px-5 py-3 rounded-xl border shadow-lg backdrop-blur-sm ${cls}`}
      >
        <span className="text-sm font-medium">{message}</span>
        <button
          onClick={() => dispatch(hideToast())}
          className="ml-2 text-current opacity-60 hover:opacity-100 transition-opacity text-lg leading-none cursor-pointer"
          aria-label="Close"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
