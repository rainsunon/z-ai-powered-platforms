import React, { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
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
import { Separator } from '@/components/ui/separator';

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: string;
  method: string;
}

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  completed: { label: 'Completed', className: 'bg-secondary-container text-secondary hover:bg-secondary-container' },
  failed: { label: 'Failed', className: 'bg-error-container text-error hover:bg-error-container' },
  refunded: { label: 'Refunded', className: 'bg-tertiary-container text-on-tertiary-container hover:bg-tertiary-container' },
  pending: { label: 'Pending', className: 'bg-surface-variant text-on-surface-variant hover:bg-surface-variant' },
};

interface VirtualTransactionTableProps {
  filtered: Transaction[];
  totalCount: number;
}

const ROW_HEIGHT = 68;

export function VirtualTransactionTable({
  filtered,
  totalCount,
}: VirtualTransactionTableProps) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: filtered.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 10,
  });

  return (
    <Card className="rounded-[2rem] shadow-sm overflow-hidden border-0">
      <div className="overflow-x-auto">
        {/* Fixed header */}
        <Table>
          <TableHeader>
            <TableRow className="border-outline-variant/15">
              <TableHead className="font-bold text-on-surface-variant uppercase tracking-widest text-[10px] px-8 py-5">
                Transaction
              </TableHead>
              <TableHead className="font-bold text-on-surface-variant uppercase tracking-widest text-[10px] px-4 py-5">
                Date
              </TableHead>
              <TableHead className="font-bold text-on-surface-variant uppercase tracking-widest text-[10px] px-4 py-5">
                Method
              </TableHead>
              <TableHead className="font-bold text-on-surface-variant uppercase tracking-widest text-[10px] px-4 py-5 text-right">
                Amount
              </TableHead>
              <TableHead className="font-bold text-on-surface-variant uppercase tracking-widest text-[10px] px-8 py-5 text-center">
                Status
              </TableHead>
            </TableRow>
          </TableHeader>
        </Table>

        {/* Virtualized rows */}
        <div
          ref={parentRef}
          className="overflow-y-auto hide-scrollbar"
          style={{ maxHeight: 480 }}
        >
          <Table>
            <TableBody>
              <TableRow className="border-0">
                <TableCell colSpan={5} style={{ padding: 0 }}>
                  <div style={{ height: virtualizer.getTotalSize(), position: 'relative' }}>
                    {virtualizer.getVirtualItems().map((virtualRow) => {
                      const txn = filtered[virtualRow.index];
                      const cfg = STATUS_CONFIG[txn.status] ?? STATUS_CONFIG.pending;
                      return (
                        <div
                          key={txn.id}
                          className="absolute top-0 left-0 w-full"
                          style={{
                            height: virtualRow.size,
                            transform: `translateY(${virtualRow.start}px)`,
                          }}
                        >
                          <Table>
                            <TableBody>
                              <TableRow className="hover:bg-surface-container-low/50 transition-colors border-0">
                                <TableCell className="px-8 py-5">
                                  <p className="font-bold text-on-surface">{txn.description}</p>
                                  <p className="text-xs text-on-surface-variant mt-0.5">{txn.id}</p>
                                </TableCell>
                                <TableCell className="px-4 py-5 text-on-surface-variant">
                                  {txn.date}
                                </TableCell>
                                <TableCell className="px-4 py-5">
                                  <span className="flex items-center gap-2 text-on-surface-variant">
                                    <span className="material-symbols-outlined text-[16px]">
                                      credit_card
                                    </span>
                                    {txn.method}
                                  </span>
                                </TableCell>
                                <TableCell className="px-4 py-5 text-right font-headline font-bold">
                                  ${txn.amount.toFixed(2)}
                                </TableCell>
                                <TableCell className="px-8 py-5 text-center">
                                  <Badge
                                    className={`text-[10px] font-black uppercase tracking-tighter px-3 py-1 rounded-full ${cfg.className}`}
                                  >
                                    {cfg.label}
                                  </Badge>
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </div>
                      );
                    })}
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      <Separator className="bg-outline-variant/15" />
      <div className="flex items-center justify-between px-8 py-5">
        <p className="text-xs text-on-surface-variant">
          Showing {filtered.length} of {totalCount} transactions
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            disabled
          >
            <span className="material-symbols-outlined text-[18px]">chevron_left</span>
          </Button>
          <Button
            size="icon"
            className="w-8 h-8 rounded-full bg-primary text-white text-xs font-bold"
          >
            1
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8 rounded-full text-on-surface-variant text-xs font-bold"
          >
            2
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full">
            <span className="material-symbols-outlined text-[18px]">chevron_right</span>
          </Button>
        </div>
      </div>
    </Card>
  );
}
