import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export function ResetSuccess() {
  return (
    <Button
      asChild
      size="lg"
      variant="secondary"
      className="w-full rounded-2xl font-headline font-bold text-lg h-14"
    >
      <Link to="/login" className="gap-2">
        <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        Back to Login
      </Link>
    </Button>
  );
}
