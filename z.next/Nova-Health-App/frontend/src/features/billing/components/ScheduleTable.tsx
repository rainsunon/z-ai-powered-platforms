import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export interface ScheduleRow {
  label: string;
  amount: string;
  dueDate: string;
  status: 'paid' | 'upcoming';
}

interface ScheduleTableProps {
  rows: ScheduleRow[];
}

export function ScheduleTable({ rows }: ScheduleTableProps) {
  return (
    <Card className="rounded-[2rem] border-0 shadow-sm bg-surface-container p-1">
      <CardContent className="p-0 bg-surface-container-lowest rounded-[1.8rem] overflow-hidden">
        <div className="px-8 py-6 bg-surface-container-high/30 border-b border-outline-variant/10">
          <h3 className="font-headline text-xl font-bold text-on-surface">
            Installment Schedule
          </h3>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="font-label text-on-surface-variant text-xs uppercase tracking-wider">
                <TableHead className="px-8 py-4 font-semibold">Payment</TableHead>
                <TableHead className="px-8 py-4 font-semibold">Amount</TableHead>
                <TableHead className="px-8 py-4 font-semibold">Due Date</TableHead>
                <TableHead className="px-8 py-4 font-semibold">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-outline-variant/5">
              {rows.map((row) => (
                <TableRow
                  key={row.label}
                  className="hover:bg-surface-container-low transition-colors"
                >
                  <TableCell className="px-8 py-5 font-medium">{row.label}</TableCell>
                  <TableCell className="px-8 py-5">{row.amount}</TableCell>
                  <TableCell className="px-8 py-5">{row.dueDate}</TableCell>
                  <TableCell className="px-8 py-5">
                    {row.status === 'paid' ? (
                      <Badge className="bg-secondary-fixed text-on-secondary-fixed text-xs font-bold px-3 py-1 rounded-full gap-1.5 hover:bg-secondary-fixed">
                        <span
                          className="material-symbols-outlined text-sm"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          check_circle
                        </span>
                        PAID
                      </Badge>
                    ) : (
                      <Badge
                        variant="secondary"
                        className="bg-surface-container text-on-surface-variant text-xs font-bold px-3 py-1 rounded-full hover:bg-surface-container"
                      >
                        UPCOMING
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
