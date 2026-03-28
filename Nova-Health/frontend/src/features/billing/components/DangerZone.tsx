import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export function DangerZone() {
  return (
    <Card className="bg-error-container/10 border-2 border-dashed border-error/20 rounded-[2rem]">
      <CardContent className="p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="font-headline font-bold text-lg text-error">Danger Zone</h2>
          <p className="text-sm opacity-70">
            Deactivate your account and delete all health records permanently.
          </p>
        </div>
        <Button
          variant="destructive"
          className="px-6 py-3 rounded-2xl font-bold hover:brightness-110 whitespace-nowrap h-auto"
        >
          Deactivate
        </Button>
      </CardContent>
    </Card>
  );
}
