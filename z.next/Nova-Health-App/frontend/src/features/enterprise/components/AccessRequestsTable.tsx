import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const accessRequests = [
  { name: 'Dr. Julianne Davis', initials: 'JD', department: 'Neurology', role: 'Medical Staff', date: 'Oct 12, 2023' },
  { name: 'Richard Sterling', initials: 'RS', department: 'Finance', role: 'Billing Manager', date: 'Oct 11, 2023' },
];

export function AccessRequestsTable() {
  return (
    <Card className="lg:col-span-12 bg-surface-container-lowest rounded-[2.5rem] p-8 shadow-sm border-0">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-xl font-extrabold font-headline text-on-surface">User Access Requests</h3>
          <p className="text-on-surface-variant text-sm">Approval queue for new personnel accounts</p>
        </div>
      </div>
      <div className="overflow-x-auto">
        <Table className="w-full text-left">
          <TableHeader>
            <TableRow className="text-on-surface-variant text-xs font-bold uppercase tracking-widest border-0">
              <TableHead className="pb-4 pl-4">Requestor</TableHead>
              <TableHead className="pb-4">Department</TableHead>
              <TableHead className="pb-4">Proposed Role</TableHead>
              <TableHead className="pb-4">Date</TableHead>
              <TableHead className="pb-4 pr-4 text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-outline-variant/10">
            {accessRequests.map((req) => (
              <TableRow key={req.name} className="border-0">
                <TableCell className="py-4 pl-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center font-bold text-xs text-primary">{req.initials}</div>
                    <span className="font-semibold">{req.name}</span>
                  </div>
                </TableCell>
                <TableCell className="py-4 text-sm text-on-surface-variant">{req.department}</TableCell>
                <TableCell className="py-4">
                  <Badge className="px-3 py-1 bg-surface-container-high rounded-full text-xs font-bold">{req.role}</Badge>
                </TableCell>
                <TableCell className="py-4 text-sm text-on-surface-variant">{req.date}</TableCell>
                <TableCell className="py-4 pr-4 text-right space-x-2">
                  <Button variant="ghost" size="icon" className="p-2 text-error hover:bg-error-container rounded-lg h-auto w-auto">
                    <span className="material-symbols-outlined text-xl">block</span>
                  </Button>
                  <Button className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:shadow-md h-auto">Approve</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
