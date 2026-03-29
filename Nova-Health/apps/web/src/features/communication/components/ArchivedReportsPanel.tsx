import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ArchivedReportItem } from './ArchivedReportItem';

export interface ArchivedReport {
  title: string;
  date: string;
  size: string;
}

interface ArchivedReportsPanelProps {
  reports: ArchivedReport[];
}

export function ArchivedReportsPanel({ reports }: ArchivedReportsPanelProps) {
  return (
    <Card className="col-span-12 lg:col-span-7 rounded-3xl shadow-sm border-0 bg-surface-container-lowest">
      <CardContent className="p-10 flex flex-col h-full">
        <div className="flex justify-between items-center mb-8">
          <h4 className="text-2xl font-bold font-headline">Archived Reports</h4>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 text-xs font-bold bg-emerald-50 border-emerald-200 text-emerald-800 rounded-full hover:bg-emerald-100"
          >
            <span className="material-symbols-outlined text-sm">upload_file</span>
            Upload External Data
          </Button>
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 text-xs font-bold border-emerald-100 text-emerald-800 rounded-full hover:bg-emerald-50"
            >
              <span className="material-symbols-outlined text-sm">picture_as_pdf</span>
              PDF
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 text-xs font-bold border-emerald-100 text-emerald-800 rounded-full hover:bg-emerald-50"
            >
              <span className="material-symbols-outlined text-sm">csv</span>
              CSV
            </Button>
          </div>
        </div>

        <div className="divide-y divide-emerald-100/50">
          {reports.map((report) => (
            <ArchivedReportItem key={report.title} {...report} />
          ))}
        </div>

        <Button
          variant="link"
          className="mt-auto pt-6 text-sm font-bold text-emerald-800 gap-2 justify-start px-0"
        >
          View all archives
          <span className="material-symbols-outlined text-sm">open_in_new</span>
        </Button>
      </CardContent>
    </Card>
  );
}
