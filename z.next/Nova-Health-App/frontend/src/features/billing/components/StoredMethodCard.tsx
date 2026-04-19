import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

type MethodStatus = 'primary' | 'expiring' | 'expired';

const STATUS_STYLES: Record<MethodStatus, string> = {
  primary: 'bg-primary text-white',
  expiring: 'bg-tertiary-container text-on-tertiary-container',
  expired: 'bg-error-container text-error',
};

const STATUS_LABELS: Record<MethodStatus, string> = {
  primary: 'Primary',
  expiring: 'Expiring Soon',
  expired: 'Expired',
};

interface StoredMethodCardProps {
  icon: string;
  iconColor?: string;
  title: string;
  subtitle: string;
  status: MethodStatus;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function StoredMethodCard({
  icon,
  iconColor,
  title,
  subtitle,
  status,
  onEdit,
  onDelete,
}: StoredMethodCardProps) {
  const isExpired = status === 'expired';

  return (
    <Card
      className={`rounded-[2rem] border-0 hover:shadow-xl hover:shadow-on-surface/5 transition-all duration-500 ${
        isExpired ? 'opacity-60 border border-dashed border-outline-variant bg-surface-container-low/50' : ''
      }`}
    >
      <CardContent className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div
            className={`w-16 h-12 rounded-xl flex items-center justify-center ${
              isExpired ? 'bg-surface-variant grayscale' : 'bg-surface-container-high'
            }`}
          >
            <span
              className={`material-symbols-outlined text-3xl ${iconColor ?? ''}`}
            >
              {icon}
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <p
                className={`font-headline font-bold text-on-surface ${isExpired ? 'line-through' : ''}`}
              >
                {title}
              </p>
              <Badge className={`text-[10px] font-black uppercase tracking-tighter px-2 py-0.5 rounded ${STATUS_STYLES[status]} hover:${STATUS_STYLES[status]}`}>
                {STATUS_LABELS[status]}
              </Badge>
            </div>
            <p className="text-on-surface-variant text-sm font-medium">{subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {!isExpired && onEdit && (
            <Button
              variant="secondary"
              size="sm"
              onClick={onEdit}
              className="rounded-full px-5 py-2.5 h-auto bg-surface-container-high text-primary font-bold hover:bg-surface-container-highest"
            >
              Edit
            </Button>
          )}
          {onDelete && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onDelete}
              className="rounded-full text-on-surface-variant hover:bg-error-container hover:text-error"
            >
              <span className="material-symbols-outlined">
                {isExpired ? 'delete' : 'delete_outline'}
              </span>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
