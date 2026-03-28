import React, { useState } from 'react';
import { useMedicationStore, type Medication } from '@/store/useMedicationStore';
import {
  MedicationsHeader,
  TodayScheduleCard,
  ActivePrescriptionsCard,
  MedicationFormModal,
  DeleteConfirmDialog,
  emptyForm
} from './components';

export function Medications() {
  const { medications, addMedication, updateMedication, deleteMedication, toggleTaken } = useMedicationStore();
  const [modalMode, setModalMode] = useState<'add' | 'edit' | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const morningMeds = medications.filter((m) => m.frequency === 'morning' || m.frequency === 'both');
  const eveningMeds = medications.filter((m) => m.frequency === 'evening' || m.frequency === 'both');

  const openAdd = () => {
    setForm(emptyForm);
    setEditingId(null);
    setModalMode('add');
  };

  const openEdit = (med: Medication) => {
    const { id, ...rest } = med;
    setForm(rest);
    setEditingId(id);
    setModalMode('edit');
  };

  const handleSave = () => {
    if (!form.name || !form.dosage) return;
    if (modalMode === 'add') {
      addMedication(form);
    } else if (modalMode === 'edit' && editingId) {
      updateMedication(editingId, form);
    }
    setModalMode(null);
  };

  const handleDelete = (id: string) => {
    deleteMedication(id);
    setDeleteConfirmId(null);
  };

  return (
    <div className="space-y-8 pb-12">
      <MedicationsHeader onAdd={openAdd} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Daily Tracker */}
        <div className="lg:col-span-2 space-y-6">
          <TodayScheduleCard
            morningMeds={morningMeds}
            eveningMeds={eveningMeds}
            onToggleTaken={toggleTaken}
            onEdit={openEdit}
            onDelete={setDeleteConfirmId}
          />
        </div>

        {/* Active Prescriptions */}
        <div className="space-y-6">
          <ActivePrescriptionsCard medications={medications} />
        </div>
      </div>

      {/* Add/Edit Modal */}
      {modalMode && (
        <MedicationFormModal
          mode={modalMode}
          form={form}
          onFormChange={setForm}
          onSave={handleSave}
          onCancel={() => setModalMode(null)}
        />
      )}

      {/* Delete Confirmation */}
      {deleteConfirmId && (
        <DeleteConfirmDialog
          onConfirm={() => handleDelete(deleteConfirmId)}
          onCancel={() => setDeleteConfirmId(null)}
        />
      )}
    </div>
  );
}
