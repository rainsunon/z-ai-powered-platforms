import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { DrugInteractionItem } from './components/DrugInteractionItem';
import { MedicationHistoryTable } from './components/MedicationHistoryTable';
import { SideEffectsCard } from './components/SideEffectsCard';
import { PrescriptionInfoCard } from './components/PrescriptionInfoCard';

const interactions = [
  {
    icon: 'report', iconColor: 'text-tertiary', name: 'Potassium Supplements', severity: 'Moderate' as const,
    description: 'May increase potassium levels. Monitor potassium regularly when taking together.',
    borderClass: 'border-tertiary-container', bgClass: 'bg-tertiary-container/30',
  },
  {
    icon: 'dangerous', iconColor: 'text-error', name: 'NSAIDs (Ibuprofen, Naproxen)', severity: 'High' as const,
    description: 'May reduce the blood-pressure-lowering effect and increase risk of kidney problems.',
    borderClass: 'border-error-container', bgClass: 'bg-error-container/30',
  },
  {
    icon: 'info', iconColor: 'text-on-surface-variant', name: 'Atorvastatin (Current Rx)', severity: 'Safe' as const,
    description: 'No significant interaction. Safe to take together as prescribed.',
    borderClass: 'border-outline-variant/30', bgClass: 'bg-surface-container',
  },
];

const historyEntries = [
  { date: 'Mar 15, 2024', change: 'Initial prescription', provider: 'Dr. Sarah Mitchell', dosage: '10mg' },
  { date: 'Apr 15, 2024', change: '30-day refill', provider: 'Dr. Sarah Mitchell', dosage: '10mg' },
  { date: 'May 15, 2024', change: '30-day refill', provider: 'Dr. Sarah Mitchell', dosage: '10mg' },
  { date: 'Jun 10, 2024', change: 'Bloodwork check — stable', provider: 'Dr. Sarah Mitchell', dosage: '10mg' },
];

const prescriptionFields = [
  { label: 'Rx Number', value: '#RX-20240315-A' },
  { label: 'Quantity', value: '30 tablets' },
  { label: 'Refills Left', value: '2 remaining', valueClass: 'text-secondary' },
  { label: 'Next Refill', value: 'Nov 15, 2024' },
  { label: 'Expires', value: 'Mar 14, 2025' },
];

export function MedicationDetail() {
  const navigate = useNavigate();

  return (
    <div className="space-y-12 max-w-6xl mx-auto pb-20">
      {/* Breadcrumb & Back */}
      <div className="flex items-center gap-2 text-sm text-on-surface-variant">
        <button onClick={() => navigate('/medications')} className="hover:text-primary transition-colors flex items-center gap-1">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Medications
        </button>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span className="text-on-surface font-medium">Lisinopril</span>
      </div>

      {/* Medication Hero Header */}
      <section className="flex flex-col md:flex-row justify-between items-start gap-6">
        <div className="flex items-start gap-6">
          <div className="w-20 h-20 rounded-[1.5rem] bg-primary/10 flex items-center justify-center shadow-sm">
            <span className="material-symbols-outlined text-4xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>pill</span>
          </div>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-4xl md:text-5xl font-headline font-extrabold text-on-surface tracking-tight">Lisinopril</h2>
              <Badge variant="secondary" className="bg-secondary-container text-secondary text-[10px] font-black uppercase tracking-tighter px-3 py-1 rounded-full">Active</Badge>
            </div>
            <p className="text-on-surface-variant mt-1">ACE Inhibitor • 10mg Oral Tablet</p>
            <p className="text-on-surface-variant text-sm mt-1">Prescribed by <span className="font-bold text-on-surface">Dr. Sarah Mitchell</span> • Since Mar 15, 2024</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="bg-surface-container-high text-primary font-bold px-6 py-3 rounded-full hover:bg-surface-container-highest transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined">edit</span> Edit
          </button>
          <button className="primary-gradient text-white font-bold px-8 py-3 rounded-full shadow-lg hover:opacity-95 transition-opacity flex items-center gap-2">
            <span className="material-symbols-outlined">refresh</span> Request Refill
          </button>
        </div>
      </section>

      {/* Bento Grid Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Dosage Schedule Card */}
          <div className="bg-surface-container-lowest p-8 rounded-[2rem] shadow-sm">
            <h3 className="font-headline font-bold text-xl mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">schedule</span>
              Dosage Schedule
            </h3>
            <div className="divide-y divide-outline-variant/15">
              <div className="flex items-center justify-between py-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-secondary-container flex items-center justify-center">
                    <span className="material-symbols-outlined text-on-secondary-container">light_mode</span>
                  </div>
                  <div>
                    <p className="font-bold text-on-surface">Morning Dose</p>
                    <p className="text-xs text-on-surface-variant mt-1">Take with breakfast • 8:00 AM</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-headline font-bold text-lg">10mg</span>
                  <p className="text-xs text-secondary font-bold mt-1">1 tablet</p>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-surface-container rounded-2xl p-5">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary mt-0.5">info</span>
                <div>
                  <p className="font-bold text-sm text-on-surface mb-1">How to take</p>
                  <ul className="text-sm text-on-surface-variant space-y-1">
                    <li>• Take at the same time each day</li>
                    <li>• Swallow whole with a full glass of water</li>
                    <li>• Can be taken with or without food</li>
                    <li>• Do not crush or chew the tablet</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Drug Interactions Card */}
          <div className="bg-surface-container-lowest p-8 rounded-[2rem] shadow-sm">
            <h3 className="font-headline font-bold text-xl mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-tertiary">warning</span>
              Drug Interactions
            </h3>
            <div className="space-y-4">
              {interactions.map((item) => (
                <DrugInteractionItem key={item.name} {...item} />
              ))}
            </div>
          </div>

          <MedicationHistoryTable entries={historyEntries} />
        </div>

        {/* Right Sidebar */}
        <div className="space-y-8">
          <SideEffectsCard
            common={['Dizziness', 'Dry Cough', 'Headache', 'Fatigue']}
            serious={['Swelling of face/lips', 'Difficulty breathing', 'Chest pain']}
          />

          <PrescriptionInfoCard fields={prescriptionFields} />

          {/* Pharmacy Card */}
          <div className="bg-primary-gradient rounded-[2rem] p-8 text-white shadow-lg shadow-primary/20 relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>local_pharmacy</span>
                <span className="text-xs font-bold uppercase tracking-widest opacity-80">Pharmacy</span>
              </div>
              <h4 className="text-xl font-bold font-headline mb-1">HealthFirst Pharmacy</h4>
              <p className="text-sm opacity-80 mb-4">1234 Wellness Ave, Suite 200<br />San Francisco, CA 94102</p>
              <div className="flex items-center gap-2 text-sm mb-6">
                <span className="material-symbols-outlined text-[18px]">call</span>
                <span className="font-medium">(415) 555-0198</span>
              </div>
              <button className="w-full flex items-center justify-center gap-2 text-sm font-bold bg-white text-emerald-900 py-3 rounded-xl hover:bg-emerald-50 transition-colors">
                <span className="material-symbols-outlined text-sm">call</span>
                Contact Pharmacy
              </button>
            </div>
            <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
