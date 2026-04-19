import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { DocumentRow } from './DocumentRow';

interface DocRecord {
  title: string;
  source: string;
  date: string;
  icon: string;
  iconBgClass: string;
  iconColorClass: string;
  typeLabel: string;
  typeBadgeClass: string;
  statusLabel?: string;
  statusDot?: string;
  metaLabel?: string;
  metaValue?: string;
}

interface DocumentListPanelProps {
  documents: DocRecord[];
}

export function DocumentListPanel({ documents }: DocumentListPanelProps) {
  return (
    <div className="col-span-12 lg:col-span-9 space-y-8">
      {/* Filters and Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-on-surface-variant/70 mr-2 uppercase tracking-wider">
            Filter by:
          </span>
          <Tabs defaultValue="all">
            <TabsList className="bg-transparent h-auto gap-2 p-0">
              <TabsTrigger
                value="all"
                className="px-4 py-1.5 rounded-full text-xs font-bold data-active:bg-secondary-fixed data-active:text-on-secondary-fixed data-active:shadow-sm bg-surface-container-highest text-on-surface-variant"
              >
                All Types
              </TabsTrigger>
              <TabsTrigger
                value="labs"
                className="px-4 py-1.5 rounded-full text-xs font-medium data-active:bg-secondary-fixed data-active:text-on-secondary-fixed data-active:shadow-sm bg-surface-container-highest text-on-surface-variant"
              >
                Labs
              </TabsTrigger>
              <TabsTrigger
                value="prescriptions"
                className="px-4 py-1.5 rounded-full text-xs font-medium data-active:bg-secondary-fixed data-active:text-on-secondary-fixed data-active:shadow-sm bg-surface-container-highest text-on-surface-variant"
              >
                Prescriptions
              </TabsTrigger>
              <TabsTrigger
                value="imaging"
                className="px-4 py-1.5 rounded-full text-xs font-medium data-active:bg-secondary-fixed data-active:text-on-secondary-fixed data-active:shadow-sm bg-surface-container-highest text-on-surface-variant"
              >
                Imaging
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="flex items-center gap-4 text-xs font-medium text-on-surface-variant">
          <span>
            Sorted by: <span className="text-on-surface font-bold">Newest First</span>
          </span>
          <span className="material-symbols-outlined text-lg cursor-pointer">filter_list</span>
        </div>
      </div>

      {/* Documents List */}
      <div className="space-y-4">
        {documents.map((doc) => (
          <DocumentRow key={doc.title} {...doc} />
        ))}
      </div>

      {/* Pagination */}
      <Pagination className="pt-6">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" size="icon" className="text-on-surface-variant hover:text-primary" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" isActive size="icon" className="rounded-full bg-primary text-white text-xs font-bold">
              1
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" size="icon" className="rounded-full hover:bg-surface-container text-on-surface-variant text-xs font-medium">
              2
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" size="icon" className="rounded-full hover:bg-surface-container text-on-surface-variant text-xs font-medium">
              3
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" size="icon" className="text-on-surface-variant hover:text-primary" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
