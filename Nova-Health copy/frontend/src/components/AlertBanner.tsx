import React from 'react';

interface AlertBannerProps {
  variant: 'warning' | 'error' | 'info';
  title: string;
  description: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  icon?: string;
}

const variantStyles = {
  warning: {
    bg: 'bg-amber-50 border-amber-200/60',
    iconBg: 'bg-amber-200/40 text-amber-700',
    title: 'text-amber-900',
    desc: 'text-amber-800/80',
    btn: 'bg-amber-600 hover:bg-amber-700',
    gradient: 'from-amber-400',
  },
  error: {
    bg: 'bg-error-container',
    iconBg: 'bg-error/10 text-error',
    title: 'text-on-error-container',
    desc: 'text-on-error-container/80',
    btn: 'bg-error hover:bg-error/90',
    gradient: 'from-error',
  },
  info: {
    bg: 'bg-primary-container/10 border-primary-container/20',
    iconBg: 'bg-primary/10 text-primary',
    title: 'text-on-surface',
    desc: 'text-on-surface-variant',
    btn: 'bg-primary hover:bg-primary/90',
    gradient: 'from-primary',
  },
};

export function AlertBanner({ variant, title, description, actionLabel, onAction, icon }: AlertBannerProps) {
  const styles = variantStyles[variant];

  return (
    <section className={`relative overflow-hidden ${styles.bg} border rounded-[2rem] p-6 flex flex-col md:flex-row items-center justify-between gap-6`}>
      <div className="flex items-center gap-5">
        <div className={`w-14 h-14 ${styles.iconBg} rounded-2xl flex items-center justify-center`}>
          <span className="material-symbols-outlined text-3xl">{icon ?? 'warning'}</span>
        </div>
        <div>
          <h3 className={`font-headline font-bold ${styles.title} text-lg`}>{title}</h3>
          <p className={`${styles.desc} text-sm`}>{description}</p>
        </div>
      </div>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className={`whitespace-nowrap px-6 py-3 ${styles.btn} text-white rounded-full font-bold text-sm transition-all shadow-md`}
        >
          {actionLabel}
        </button>
      )}
      <div className={`absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] ${styles.gradient} via-transparent to-transparent`}></div>
    </section>
  );
}
