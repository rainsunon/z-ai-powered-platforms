import React, { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Breadcrumb } from '@/components/Breadcrumb';
import { usePageTitle } from '@/hooks/usePageTitle';
import {
  useNotificationStore,
  NotificationType,
  type Notification,
} from '@/store/useNotificationStore';

const filterButtons: { key: 'all' | NotificationType; label: string }[] = [
  { key: 'all', label: 'All Notifications' },
  { key: 'critical', label: 'Critical' },
  { key: 'warning', label: 'Warnings' },
  { key: 'info', label: 'Information' },
];

const typeStyles: Record<
  NotificationType,
  { iconBg: string; iconColor: string; barColor: string }
> = {
  critical: {
    iconBg: 'bg-error-container',
    iconColor: 'text-error',
    barColor: 'bg-error',
  },
  warning: {
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    barColor: 'bg-amber-500',
  },
  info: {
    iconBg: 'bg-secondary-container',
    iconColor: 'text-primary',
    barColor: '',
  },
};

const GAP = 16; // space-y-4 equivalent

function VirtualNotificationList({
  filtered,
  typeStyles,
  deleteNotification,
}: {
  filtered: Notification[];
  typeStyles: Record<NotificationType, { iconBg: string; iconColor: string; barColor: string }>;
  deleteNotification: (id: string) => void;
}) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: filtered.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 120,
    overscan: 5,
    gap: GAP,
  });

  return (
    <div
      ref={parentRef}
      className="overflow-y-auto hide-scrollbar"
      style={{ maxHeight: 'calc(100vh - 20rem)' }}
    >
      <div
        className="relative w-full"
        style={{ height: virtualizer.getTotalSize() }}
      >
        {virtualizer.getVirtualItems().map((virtualRow) => {
          const notification = filtered[virtualRow.index];
          const style = typeStyles[notification.type];
          return (
            <div
              key={notification.id}
              data-index={virtualRow.index}
              ref={virtualizer.measureElement}
              className="absolute top-0 left-0 w-full"
              style={{ transform: `translateY(${virtualRow.start}px)` }}
            >
              <div
                className={`group relative p-6 rounded-[2rem] flex items-start gap-6 transition-all hover:shadow-[0px_20px_40px_rgba(21,30,18,0.06)] hover:-translate-y-0.5 ${
                  notification.read
                    ? 'bg-surface-container-low/50'
                    : 'bg-surface-container-lowest'
                }`}
              >
                <div
                  className={`mt-1 flex-shrink-0 w-12 h-12 rounded-2xl ${style.iconBg} flex items-center justify-center`}
                >
                  <span
                    className={`material-symbols-outlined ${style.iconColor}`}
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    {notification.icon}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4
                      className={`font-headline font-bold text-lg text-on-surface ${
                        notification.read ? 'opacity-70' : ''
                      }`}
                    >
                      {notification.title}
                    </h4>
                    <span className="text-xs font-medium text-outline whitespace-nowrap ml-4">
                      {notification.time}
                    </span>
                  </div>
                  <p className="text-on-surface-variant text-sm leading-relaxed mb-4">
                    {notification.message}
                  </p>
                  {notification.actions && (
                    <div className="flex items-center gap-3">
                      {notification.actions.map((action) => (
                        <button
                          key={action.label}
                          className={`px-4 py-1.5 text-xs font-bold rounded-lg ${
                            action.variant === 'primary'
                              ? notification.type === 'critical'
                                ? 'bg-error text-white shadow-md shadow-error/20'
                                : 'bg-primary text-white shadow-md shadow-primary/20'
                              : 'bg-surface-container-high text-on-surface-variant'
                          }`}
                        >
                          {action.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                  <button
                    onClick={() => deleteNotification(notification.id)}
                    className="p-2 text-outline hover:text-error transition-colors"
                  >
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                </div>

                {style.barColor && (
                  <div
                    className={`absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-12 ${style.barColor} rounded-r-full`}
                  ></div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function Notifications() {
  usePageTitle('Notifications');
  const {
    notifications,
    filter,
    setFilter,
    markAllRead,
    deleteNotification,
  } = useNotificationStore();

  const filtered =
    filter === 'all'
      ? notifications
      : notifications.filter((n) => n.type === filter);

  const criticalCount = notifications.filter(
    (n) => n.type === 'critical' && !n.read,
  ).length;
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="max-w-5xl mx-auto pb-20 space-y-8">
      <Breadcrumb
        items={[{ label: 'Dashboard', to: '/' }, { label: 'Notifications' }]}
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-on-surface font-headline mb-2">
            Notifications
          </h2>
          <p className="text-on-surface-variant text-lg">
            Stay updated with your sanctuary's vital rhythms.
          </p>
        </div>
        <button
          onClick={markAllRead}
          className="px-6 py-3 bg-surface-container-high text-primary font-headline font-semibold rounded-xl hover:bg-surface-variant transition-colors flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[20px]">
            done_all
          </span>
          Mark all as read
        </button>
      </div>

      {/* Filters & Stats */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8 flex flex-wrap gap-3 items-center">
          {filterButtons.map((btn) => (
            <button
              key={btn.key}
              onClick={() => setFilter(btn.key)}
              className={`px-5 py-2.5 font-semibold rounded-full text-sm transition-colors ${
                filter === btn.key
                  ? 'bg-secondary-container text-on-secondary-container'
                  : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
        <div className="col-span-12 lg:col-span-4 flex justify-end">
          <div className="flex items-center gap-4 text-sm font-medium">
            <span className="flex items-center gap-1.5 text-error">
              <span className="w-2 h-2 rounded-full bg-error"></span>{' '}
              {criticalCount} Critical
            </span>
            <span className="flex items-center gap-1.5 text-primary">
              <span className="w-2 h-2 rounded-full bg-primary"></span>{' '}
              {unreadCount} Unread
            </span>
          </div>
        </div>
      </div>

      {/* Notification List */}
      {filtered.length > 0 ? (
        <VirtualNotificationList
          filtered={filtered}
          typeStyles={typeStyles}
          deleteNotification={deleteNotification}
        />
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-32 h-32 rounded-full bg-surface-container mb-6 flex items-center justify-center">
            <span className="material-symbols-outlined text-5xl text-outline-variant">
              notifications_off
            </span>
          </div>
          <h3 className="text-2xl font-bold font-headline text-on-surface mb-2">
            A Moment of Stillness
          </h3>
          <p className="text-on-surface-variant max-w-xs">
            Your sanctuary is calm. There are no new notifications to attend to
            right now.
          </p>
        </div>
      )}

      {/* Load Archive */}
      {filtered.length > 0 && (
        <div className="mt-12 flex justify-center">
          <button className="px-8 py-3 bg-surface-container-lowest text-primary font-headline font-bold rounded-xl shadow-sm hover:shadow-md transition-all">
            Load Archive
          </button>
        </div>
      )}
    </div>
  );
}
