import React from 'react';
import { Button } from '@/components/ui/button';
import { InsuranceCardPreview } from './InsuranceCardPreview';
import { CoverageDetails } from './CoverageDetails';
import { BillingSupportCard } from './BillingSupportCard';

export function InsuranceSidebar() {
  return (
    <aside className="space-y-8 sticky top-24">
      <section className="bg-surface-container-highest p-8 rounded-[2.5rem] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 primary-gradient opacity-5 rounded-full -mr-20 -mt-20" />
        <h4 className="text-xl font-headline font-bold mb-6">Insurance Provider</h4>

        <InsuranceCardPreview />
        <CoverageDetails />

        <Button
          variant="secondary"
          className="w-full mt-8 gap-2 text-primary font-bold py-4 bg-white rounded-2xl shadow-sm hover:shadow-md h-auto"
        >
          <span className="material-symbols-outlined">qr_code_2</span> View Digital Card
        </Button>
        <Button
          variant="outline"
          className="w-full mt-4 gap-2 text-on-surface-variant font-bold py-4 bg-surface-container-low border-outline-variant/30 rounded-2xl hover:bg-surface-container-high h-auto"
        >
          <span className="material-symbols-outlined">upload_file</span> Upload Insurance Card
        </Button>
      </section>

      <BillingSupportCard />
    </aside>
  );
}
