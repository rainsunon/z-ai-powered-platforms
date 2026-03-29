import React from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';

const ARCHIVE_YEARS = [
  {
    value: '2024',
    title: 'Fiscal Year 2024',
    rows: [
      { label: '12 Invoices Processed', value: '$3,420.00 Total' },
      { label: '4 Active Claims', value: 'Reviewing', valueClass: 'text-primary' },
    ],
  },
  {
    value: '2023',
    title: 'Fiscal Year 2023',
    rows: [{ label: 'No pending items for this period.', value: '' }],
  },
] as const;

export function ArchiveHistory() {
  return (
    <section className="space-y-4">
      <h4 className="text-2xl font-headline font-bold mb-6">Archive History</h4>
      <Accordion defaultValue={['2024']}>
        {ARCHIVE_YEARS.map(({ value, title, rows }) => (
          <AccordionItem
            key={value}
            value={value}
            className="bg-surface-container-low rounded-[1.5rem] overflow-hidden border-0 mb-4"
          >
            <AccordionTrigger className="p-6 text-lg font-bold hover:no-underline">
              {title}
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <Separator className="bg-outline-variant/10 mb-4" />
              <div className="space-y-2">
                {rows.map(({ label, value: rowValue, ...rest }) => (
                  <div key={label} className="flex justify-between items-center py-2 text-sm">
                    <span className="text-on-surface-variant">{label}</span>
                    {rowValue && (
                      <span className={`font-bold ${'valueClass' in rest ? (rest as { valueClass: string }).valueClass : ''}`}>
                        {rowValue}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
