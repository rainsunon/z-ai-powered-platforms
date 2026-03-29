import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const memberData: Record<string, { name: string; role: string; avatar: string; color: string; gradient: string }> = {
  sarah: { name: 'Sarah Rivera', role: 'Account Owner', avatar: 'face_4', color: 'bg-primary', gradient: 'from-primary to-primary/70' },
  leo: { name: 'Leo Rivera', role: 'Teen Member', avatar: 'face_3', color: 'bg-tertiary', gradient: 'from-tertiary to-tertiary/70' },
  maya: { name: 'Maya Rivera', role: 'Child Member', avatar: 'face_5', color: 'bg-secondary', gradient: 'from-secondary to-secondary/70' },
};

interface ToggleState {
  [key: string]: boolean;
}

export function FamilyPermissionDetail() {
  const { memberId } = useParams();
  const navigate = useNavigate();
  const member = memberData[memberId || 'sarah'] || memberData.sarah;

  const [coreAccess, setCoreAccess] = useState<ToggleState>({
    viewDashboard: true,
    accessRecords: true,
    emergencyAlerts: true,
  });

  const [dataCategories, setDataCategories] = useState<ToggleState>({
    vitals: true,
    medication: true,
    labResults: false,
    mentalHealth: false,
  });

  const [functionalPerms, setFunctionalPerms] = useState<ToggleState>({
    bookAppointments: true,
    communicateCareTeam: false,
    manageBilling: false,
  });

  const toggleCore = (key: string) => setCoreAccess((prev) => ({ ...prev, [key]: !prev[key] }));
  const toggleData = (key: string) => setDataCategories((prev) => ({ ...prev, [key]: !prev[key] }));
  const toggleFunc = (key: string) => setFunctionalPerms((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleReset = () => {
    setCoreAccess({ viewDashboard: true, accessRecords: true, emergencyAlerts: true });
    setDataCategories({ vitals: true, medication: true, labResults: false, mentalHealth: false });
    setFunctionalPerms({ bookAppointments: true, communicateCareTeam: false, manageBilling: false });
  };

  const Toggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
    <button
      onClick={onChange}
      className={`relative w-12 h-7 rounded-full transition-colors duration-200 ${checked ? 'bg-primary' : 'bg-outline-variant/30'}`}
    >
      <span className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-200 ${checked ? 'left-6' : 'left-1'}`} />
    </button>
  );

  return (
    <div className="space-y-12 max-w-4xl mx-auto pb-20">
      {/* Header */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <button onClick={() => navigate('/family/permissions')} className="p-2 rounded-full hover:bg-surface-container transition-colors">
            <span className="material-symbols-outlined text-on-surface-variant">arrow_back</span>
          </button>
          <span className="text-xs font-bold text-primary uppercase tracking-widest">Family Permissions</span>
        </div>
        {/* Member Info Card */}
        <div className={`bg-gradient-to-r ${member.gradient} rounded-[2rem] p-8 text-white`}>
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <span className="material-symbols-outlined text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>{member.avatar}</span>
            </div>
            <div>
              <h2 className="text-3xl font-extrabold font-headline">{member.name}</h2>
              <p className="text-white/80 mt-1">{member.role}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Access Permissions */}
      <section className="bg-surface-container-lowest p-8 rounded-[2rem] shadow-sm">
        <h3 className="font-headline font-bold text-xl text-on-surface mb-2 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>shield</span>
          Core Access
        </h3>
        <p className="text-sm text-on-surface-variant mb-6">Fundamental access permissions for this family member.</p>
        <div className="space-y-4">
          {[
            { key: 'viewDashboard', icon: 'dashboard', label: 'View Dashboard', desc: 'Access the family health dashboard and overview' },
            { key: 'accessRecords', icon: 'folder_shared', label: 'Access Health Records', desc: 'View shared medical records and history' },
            { key: 'emergencyAlerts', icon: 'emergency', label: 'Emergency Alerts', desc: 'Receive critical health notifications and alerts' },
          ].map(({ key, icon, label, desc }) => (
            <div key={key} className="flex items-center gap-4 p-5 rounded-2xl bg-surface-container/50">
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-primary">{icon}</span>
              </div>
              <div className="flex-1">
                <p className="font-bold text-on-surface">{label}</p>
                <p className="text-xs text-on-surface-variant">{desc}</p>
              </div>
              <Toggle checked={coreAccess[key]} onChange={() => toggleCore(key)} />
            </div>
          ))}
        </div>
      </section>

      {/* Data Category Permissions */}
      <section className="bg-surface-container-lowest p-8 rounded-[2rem] shadow-sm">
        <h3 className="font-headline font-bold text-xl text-on-surface mb-2 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>database</span>
          Data Categories
        </h3>
        <p className="text-sm text-on-surface-variant mb-6">Control which types of health data this member can access.</p>
        <div className="space-y-4">
          {[
            { key: 'vitals', icon: 'monitor_heart', label: 'Vitals & Biometrics', desc: 'Heart rate, blood pressure, temperature, SpO2' },
            { key: 'medication', icon: 'medication', label: 'Medication Records', desc: 'Prescriptions, dosage schedules, pharmacy info' },
            { key: 'labResults', icon: 'biotech', label: 'Lab Results', desc: 'Blood work, imaging, diagnostic test results' },
            { key: 'mentalHealth', icon: 'psychology', label: 'Mental Health', desc: 'Mood tracking, therapy notes, wellness assessments' },
          ].map(({ key, icon, label, desc }) => (
            <div key={key} className="flex items-center gap-4 p-5 rounded-2xl bg-surface-container/50">
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-primary">{icon}</span>
              </div>
              <div className="flex-1">
                <p className="font-bold text-on-surface">{label}</p>
                <p className="text-xs text-on-surface-variant">{desc}</p>
              </div>
              <Toggle checked={dataCategories[key]} onChange={() => toggleData(key)} />
            </div>
          ))}
        </div>
      </section>

      {/* Functional Permissions */}
      <section className="bg-surface-container-lowest p-8 rounded-[2rem] shadow-sm">
        <h3 className="font-headline font-bold text-xl text-on-surface mb-2 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>settings</span>
          Functional Permissions
        </h3>
        <p className="text-sm text-on-surface-variant mb-6">Actions this member is authorized to perform.</p>
        <div className="space-y-4">
          {[
            { key: 'bookAppointments', icon: 'calendar_month', label: 'Book Appointments', desc: 'Schedule, modify, or cancel medical appointments' },
            { key: 'communicateCareTeam', icon: 'forum', label: 'Communicate with Care Team', desc: 'Send messages and participate in care discussions' },
            { key: 'manageBilling', icon: 'payments', label: 'Manage Billing', desc: 'View invoices, make payments, update payment methods' },
          ].map(({ key, icon, label, desc }) => (
            <div key={key} className="flex items-center gap-4 p-5 rounded-2xl bg-surface-container/50">
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-primary">{icon}</span>
              </div>
              <div className="flex-1">
                <p className="font-bold text-on-surface">{label}</p>
                <p className="text-xs text-on-surface-variant">{desc}</p>
              </div>
              <Toggle checked={functionalPerms[key]} onChange={() => toggleFunc(key)} />
            </div>
          ))}
        </div>
      </section>

      {/* Security Information */}
      <section className="bg-surface-container-lowest p-8 rounded-[2rem] shadow-sm">
        <h3 className="font-headline font-bold text-xl text-on-surface mb-6 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>security</span>
          Security Information
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: 'Last Permission Change', value: 'Oct 15, 2024 at 3:42 PM', icon: 'history' },
            { label: 'Changed By', value: 'Elena Vance (Owner)', icon: 'person' },
            { label: 'Two-Factor Auth', value: 'Enabled', icon: 'verified_user' },
            { label: 'Session Timeout', value: '30 minutes', icon: 'timer' },
          ].map(({ label, value, icon }) => (
            <div key={label} className="flex items-start gap-3 p-4 rounded-xl bg-surface-container/50">
              <span className="material-symbols-outlined text-primary text-lg mt-0.5">{icon}</span>
              <div>
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">{label}</p>
                <p className="text-sm font-bold text-on-surface mt-1">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Save / Reset Buttons */}
      <section className="flex flex-col sm:flex-row gap-4">
        <button className="flex-1 primary-gradient text-white font-headline font-bold py-4 rounded-2xl shadow-lg shadow-primary/20 hover:opacity-90 transition-all flex items-center justify-center gap-2">
          <span className="material-symbols-outlined">save</span>
          Save Permissions
        </button>
        <button
          onClick={handleReset}
          className="flex-1 bg-surface-container text-on-surface font-headline font-bold py-4 rounded-2xl hover:bg-surface-container-high transition-colors flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined">restart_alt</span>
          Reset to Default
        </button>
      </section>
    </div>
  );
}
