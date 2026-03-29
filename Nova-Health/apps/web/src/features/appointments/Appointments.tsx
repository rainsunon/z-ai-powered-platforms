import React, { useState, useMemo } from 'react';
import { useAppointmentStore, type Appointment } from '@/store/useAppointmentStore';
import { exportAppointmentToICS, exportAllAppointmentsToICS } from '@/lib/icsExport';
import { usePageTitle } from '@/hooks/usePageTitle';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { AppointmentCard } from './components/AppointmentCard';
import { AppointmentFormSheet, emptyForm, type AppointmentFormData } from './components/AppointmentFormSheet';
import { DeleteAppointmentDialog } from './components/DeleteAppointmentDialog';

type FilterValue = 'all' | 'upcoming' | 'completed' | 'cancelled';

function StatCard({ icon, iconClass, label, children }: { icon: string; iconClass: string; label: string; children: React.ReactNode }) {
  return (
    <Card className="rounded-3xl border-surface-variant/50 bg-surface-container-lowest shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconClass}`}>
            <span className="material-symbols-outlined">{icon}</span>
          </div>
          <span className="font-body text-sm text-outline">{label}</span>
        </div>
        {children}
      </CardContent>
    </Card>
  );
}

export function Appointments() {
  usePageTitle('Appointments');
  const { appointments, addAppointment, updateAppointment, deleteAppointment, cancelAppointment } = useAppointmentStore();

  const [filter, setFilter] = useState<FilterValue>('all');
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetMode, setSheetMode] = useState<'add' | 'edit'>('add');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<AppointmentFormData>(emptyForm);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const sorted = useMemo(() => {
    const list = filter === 'all' ? appointments : appointments.filter((a) => a.status === filter);
    return [...list].sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));
  }, [appointments, filter]);

  const upcomingCount = appointments.filter((a) => a.status === 'upcoming').length;
  const completedCount = appointments.filter((a) => a.status === 'completed').length;
  const nextAppointment = appointments
    .filter((a) => a.status === 'upcoming')
    .sort((a, b) => a.date.localeCompare(b.date))[0];

  // --- Sheet handlers ---
  const openAdd = () => {
    setForm(emptyForm);
    setEditingId(null);
    setSheetMode('add');
    setSheetOpen(true);
  };

  const openEdit = (apt: Appointment) => {
    const { id, ...rest } = apt;
    setForm(rest);
    setEditingId(id);
    setSheetMode('edit');
    setSheetOpen(true);
  };

  const handleSave = () => {
    if (sheetMode === 'add') {
      addAppointment(form);
    } else if (editingId) {
      updateAppointment(editingId, form);
    }
    setSheetOpen(false);
  };

  // --- Delete handlers ---
  const openDeleteDialog = (id: string) => {
    setDeletingId(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (deletingId) deleteAppointment(deletingId);
    setDeleteDialogOpen(false);
    setDeletingId(null);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline font-bold text-3xl text-on-surface">Appointments</h1>
          <p className="font-body text-outline mt-1">Manage your upcoming and past medical appointments.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="lg"
            onClick={() => exportAllAppointmentsToICS(appointments)}
            className="rounded-2xl font-headline font-bold gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">calendar_add_on</span>
            Export .ics
          </Button>
          <Button
            size="lg"
            onClick={openAdd}
            className="rounded-2xl primary-gradient text-on-primary font-headline font-bold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            New Appointment
          </Button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard icon="event_upcoming" iconClass="bg-primary/10 text-primary" label="Upcoming">
          <p className="font-headline font-bold text-3xl text-on-surface">{upcomingCount}</p>
        </StatCard>
        <StatCard icon="check_circle" iconClass="bg-secondary-container text-secondary" label="Completed">
          <p className="font-headline font-bold text-3xl text-on-surface">{completedCount}</p>
        </StatCard>
        <StatCard icon="schedule" iconClass="bg-surface-container text-on-surface-variant" label="Next Appointment">
          <p className="font-headline font-bold text-lg text-on-surface">
            {nextAppointment ? `${nextAppointment.date} at ${nextAppointment.time}` : 'None scheduled'}
          </p>
        </StatCard>
      </div>

      {/* Filter Tabs + List */}
      <Tabs value={filter} onValueChange={(val) => setFilter(val as FilterValue)}>
        <TabsList className="bg-surface-container rounded-full p-1 h-auto gap-0.5">
          <TabsTrigger value="all" className="px-5 py-2 rounded-full text-sm font-bold capitalize data-active:bg-surface-container-lowest data-active:text-on-surface data-active:shadow-sm">All</TabsTrigger>
          <TabsTrigger value="upcoming" className="px-5 py-2 rounded-full text-sm font-bold capitalize data-active:bg-surface-container-lowest data-active:text-on-surface data-active:shadow-sm">Upcoming</TabsTrigger>
          <TabsTrigger value="completed" className="px-5 py-2 rounded-full text-sm font-bold capitalize data-active:bg-surface-container-lowest data-active:text-on-surface data-active:shadow-sm">Completed</TabsTrigger>
          <TabsTrigger value="cancelled" className="px-5 py-2 rounded-full text-sm font-bold capitalize data-active:bg-surface-container-lowest data-active:text-on-surface data-active:shadow-sm">Cancelled</TabsTrigger>
        </TabsList>

        {/* All filters share the same sorted list so we use a single content area */}
        {(['all', 'upcoming', 'completed', 'cancelled'] as const).map((val) => (
          <TabsContent key={val} value={val}>
            <div className="space-y-4 mt-2">
              {sorted.length === 0 ? (
                <Card className="rounded-3xl border-surface-variant/50 bg-surface-container-lowest">
                  <CardContent className="p-12 text-center">
                    <span className="material-symbols-outlined text-4xl text-outline mb-4 block">event_busy</span>
                    <p className="font-headline font-bold text-lg text-on-surface">No appointments found</p>
                    <p className="font-body text-outline mt-1">Try a different filter or add a new appointment.</p>
                  </CardContent>
                </Card>
              ) : (
                sorted.map((apt) => (
                  <AppointmentCard
                    key={apt.id}
                    appointment={apt}
                    onEdit={openEdit}
                    onDelete={openDeleteDialog}
                    onCancel={cancelAppointment}
                    onExport={exportAppointmentToICS}
                  />
                ))
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Form Sheet (Add / Edit) */}
      <AppointmentFormSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        mode={sheetMode}
        form={form}
        onFormChange={setForm}
        onSave={handleSave}
      />

      {/* Delete Confirmation */}
      <DeleteAppointmentDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
      />
    </div>
  );
}
