import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('animate-pulse rounded-md bg-muted', className)} {...props} />;
}

function LoadingSpinner({ className }: { className?: string }) {
  return (
    <div className="flex h-64 items-center justify-center">
      <Loader2 className={cn('h-8 w-8 animate-spin text-primary-500', className)} />
    </div>
  );
}

export { Skeleton, LoadingSpinner };
