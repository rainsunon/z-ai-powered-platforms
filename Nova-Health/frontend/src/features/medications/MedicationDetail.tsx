import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MedicationBreadcrumb,
  MedicationDetailHero,
  DrugInteractionsCard,
  MedicationHistoryTable,
  SideEffectsCard,
  PrescriptionInfoCard,
  DosageScheduleCard,
  PharmacyCard,
  interactions,
  historyEntries,
  prescriptionFields,
  sideEffectsData
} from './components';

export function MedicationDetail() {
  const navigate = useNavigate();

  return (
    <div className="space-y-12 max-w-6xl mx-auto pb-20">
      {/* Breadcrumb & Back */}
      <MedicationBreadcrumb />

      {/* Medication Hero Header */}
      <MedicationDetailHero />

      {/* Bento Grid Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Dosage Schedule Card */}
          <DosageScheduleCard />

          {/* Drug Interactions Card */}
          <DrugInteractionsCard interactions={interactions} />

          <MedicationHistoryTable entries={historyEntries} />
        </div>

        {/* Right Sidebar */}
        <div className="space-y-8">
          <SideEffectsCard
            common={sideEffectsData.common}
            serious={sideEffectsData.serious}
          />

          <PrescriptionInfoCard fields={prescriptionFields} />

          {/* Pharmacy Card */}
          <PharmacyCard />
        </div>
      </div>
    </div>
  );
}
