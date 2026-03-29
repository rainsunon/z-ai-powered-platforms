import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const tickets = [
  { id: '#NH-9021', user: 'James Dalton', initials: 'JD', initialsColor: 'bg-secondary-fixed text-on-secondary-fixed', subject: 'Prescription refill issue', priority: 'High', priorityColor: 'bg-error-container text-on-error-container', status: 'Open', statusColor: 'text-primary font-bold' },
  { id: '#NH-8944', user: 'Maria Rivera', initials: 'MR', initialsColor: 'bg-tertiary-fixed text-on-tertiary-fixed', subject: 'Portal login error', priority: 'Med', priorityColor: 'bg-surface-container-high text-on-surface-variant', status: 'In Progress', statusColor: 'text-on-surface-variant/40 font-bold' },
  { id: '#NH-8922', user: 'Sam Chen', initials: 'SC', initialsColor: 'bg-primary-fixed text-on-primary-fixed', subject: 'Insurance coverage query', priority: 'Low', priorityColor: 'bg-surface-container-high text-on-surface-variant', status: 'Open', statusColor: 'text-primary font-bold' },
];

export function SupportTicketsTable() {
  return (
    <Card className="bg-surface-container-lowest rounded-[2rem] overflow-hidden border-0">
      <Table className="w-full text-left border-collapse">
        <TableHeader>
          <TableRow className="bg-surface-container-low/50">
            <TableHead className="px-8 py-6 text-xs font-bold font-headline uppercase tracking-wider text-on-surface-variant opacity-60">Ticket ID</TableHead>
            <TableHead className="px-8 py-6 text-xs font-bold font-headline uppercase tracking-wider text-on-surface-variant opacity-60">User</TableHead>
            <TableHead className="px-8 py-6 text-xs font-bold font-headline uppercase tracking-wider text-on-surface-variant opacity-60">Subject</TableHead>
            <TableHead className="px-8 py-6 text-xs font-bold font-headline uppercase tracking-wider text-on-surface-variant opacity-60 text-center">Priority</TableHead>
            <TableHead className="px-8 py-6 text-xs font-bold font-headline uppercase tracking-wider text-on-surface-variant opacity-60 text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-outline-variant/10">
          {tickets.map((ticket) => (
            <TableRow key={ticket.id} className="hover:bg-surface-container-low/30 transition-colors">
              <TableCell className="px-8 py-6 font-headline font-bold text-sm">{ticket.id}</TableCell>
              <TableCell className="px-8 py-6">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full ${ticket.initialsColor} flex items-center justify-center text-[10px] font-bold`}>{ticket.initials}</div>
                  <span className="text-sm font-medium">{ticket.user}</span>
                </div>
              </TableCell>
              <TableCell className="px-8 py-6 text-sm">{ticket.subject}</TableCell>
              <TableCell className="px-8 py-6 text-center">
                <Badge className={`px-3 py-1 ${ticket.priorityColor} text-[10px] font-black uppercase tracking-tighter rounded-full`}>{ticket.priority}</Badge>
              </TableCell>
              <TableCell className="px-8 py-6 text-right">
                <span className={`text-sm ${ticket.statusColor}`}>{ticket.status}</span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
