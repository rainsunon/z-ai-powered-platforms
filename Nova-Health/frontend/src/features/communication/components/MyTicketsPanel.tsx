import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TicketItem } from './TicketItem';

export interface Ticket {
  id: string;
  status: string;
  statusVariant: 'secondary' | 'outline';
  title: string;
  description: string;
  isResolved?: boolean;
}

interface MyTicketsPanelProps {
  tickets: Ticket[];
}

export function MyTicketsPanel({ tickets }: MyTicketsPanelProps) {
  return (
    <Card className="rounded-[2.5rem] border border-outline-variant/15 bg-surface-container-low">
      <CardHeader className="p-8 pb-0">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold tracking-tight">My Tickets</CardTitle>
          <Badge className="bg-primary/10 text-primary hover:bg-primary/10 rounded-full text-xs font-bold">
            {tickets.length} Active
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-8 pt-6">
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <TicketItem key={ticket.id} {...ticket} />
          ))}
        </div>

        <Button
          variant="outline"
          className="w-full mt-6 py-4 text-primary font-bold text-sm border-2 border-primary/20 rounded-2xl hover:bg-primary/5"
        >
          View All History
        </Button>
      </CardContent>
    </Card>
  );
}
