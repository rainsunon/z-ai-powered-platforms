import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  Activity,
  Heart,
  Pill,
  Calendar,
  Watch,
  FileText,
  TrendingUp,
  Plus,
  Pencil,
  Trash2,
  Eye,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useDashboardStore, useMedicationStore, useAppointmentStore, useHealthLogStore, useDeviceStore } from "../stores";
import { cn, formatDate, formatRelative, formatMetricType } from "../lib/utils";
import type { Medication, Appointment, HealthLog } from "../types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription, DialogTrigger } from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import HealthLogForm from "../components/shared/HealthLogForm";
import MedicationForm from "../components/shared/MedicationForm";
import AppointmentForm from "../components/shared/AppointmentForm";

type QuickAddType = "medication" | "appointment" | "device" | "log" | null;

const summaryCardConfig = [
  { key: "activeMedications", label: "Active Medications", icon: Pill, color: "text-emerald-600", bg: "bg-emerald-50" },
  { key: "upcomingAppointments", label: "Upcoming Appointments", icon: Calendar, color: "text-blue-600", bg: "bg-blue-50" },
  { key: "connectedDevices", label: "Connected Devices", icon: Watch, color: "text-violet-600", bg: "bg-violet-50" },
  { key: "logsThisWeek", label: "Logs This Week", icon: Activity, color: "text-orange-600", bg: "bg-orange-50" },
  { key: "totalDocuments", label: "Total Documents", icon: FileText, color: "text-rose-600", bg: "bg-rose-50" },
  { key: "metricsRecorded30d", label: "Metrics (30d)", icon: TrendingUp, color: "text-cyan-600", bg: "bg-cyan-50" },
] as const;

export default function DashboardPage() {
  const { summary, trendData, fetchSummary, fetchTrend, isLoading } = useDashboardStore();
  const medStore = useMedicationStore();
  const aptStore = useAppointmentStore();
  const logStore = useHealthLogStore();
  const deviceStore = useDeviceStore();
  const [quickAdd, setQuickAdd] = useState<QuickAddType>(null);
  const [detailItem, setDetailItem] = useState<{ type: string; data: Medication | Appointment | HealthLog } | null>(null);
  const [editItem, setEditItem] = useState<{ type: string; data: Medication | Appointment | HealthLog } | null>(null);
  const [activeListTab, setActiveListTab] = useState<"medications" | "appointments" | "logs">("medications");

  useEffect(() => {
    fetchSummary();
    medStore.fetchMedications({ limit: 5 });
    aptStore.fetchAppointments({ limit: 5 });
    logStore.fetchLogs({ limit: 5 });
    deviceStore.fetchDevices();
    fetchTrend("HEART_RATE", 30);
    fetchTrend("BLOOD_PRESSURE", 30);
    fetchTrend("STEPS", 30);
  }, []);

  const trendChartData = Object.entries(trendData).flatMap(([type, points]) =>
    points.map((p) => ({
      date: new Date(p.recordedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      [type]: parseFloat(p.value),
    }))
  );

  const aggregated = trendChartData.reduce<Record<string, Record<string, number>>>((acc, point) => {
    const key = point.date;
    if (!acc[key]) acc[key] = {};
    Object.entries(point).forEach(([k, v]) => {
      if (k !== "date") acc[key][k] = v as number;
    });
    return acc;
  }, {});

  const chartData = Object.entries(aggregated).map(([date, values]) => ({ date, ...values }));

  const trendColors: Record<string, string> = {
    HEART_RATE: "#ef4444",
    BLOOD_PRESSURE: "#3b82f6",
    STEPS: "#10b981",
  };

  const [medPage, setMedPage] = useState(1);
  const [aptPage, setAptPage] = useState(1);
  const [logPage, setLogPage] = useState(1);

  const handleDelete = async (type: string, id: string) => {
    if (type === "medication") await medStore.deleteMedication(id);
    else if (type === "appointment") await aptStore.deleteAppointment(id);
    else if (type === "log") await logStore.deleteLog(id);
    fetchSummary();
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-primary font-semibold tracking-widest text-xs uppercase mb-1">Vitality & Wellness</p>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Health Ecosystem</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          {([
            { type: "medication" as const, label: "Add Medication", icon: Pill },
            { type: "appointment" as const, label: "Add Appointment", icon: Calendar },
            { type: "device" as const, label: "Sync Device", icon: Watch },
            { type: "log" as const, label: "Health Log", icon: LogOut },
          ]).map(({ type, label, icon: Icon }) => (
            <Button key={type} onClick={() => setQuickAdd(type)} size="sm" className="gap-1.5">
              <Icon className="w-4 h-4" />
              {label}
            </Button>
          ))}
        </div>
      </header>

      {isLoading && <div className="text-muted-foreground text-sm">Loading dashboard...</div>}

      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {summaryCardConfig.map(({ key, label, icon: Icon, color, bg }) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 bg-white rounded-2xl border border-black/5 shadow-sm"
            >
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-3", bg)}>
                <Icon className={cn("w-5 h-5", color)} />
              </div>
              <p className="text-2xl font-black">{summary[key]}</p>
              <p className="text-xs text-muted-foreground font-medium mt-1">{label}</p>
            </motion.div>
          ))}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-6">
        <h2 className="text-lg font-bold mb-4">Overall Health Trend</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            {Object.keys(trendData).map((type) => (
              <Line
                key={type}
                type="monotone"
                dataKey={type}
                stroke={trendColors[type] || "#6b7280"}
                strokeWidth={2}
                dot={false}
                name={formatMetricType(type)}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-2xl border border-black/5 shadow-sm">
        <div className="flex border-b">
          {(["medications", "appointments", "logs"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveListTab(tab)}
              className={cn(
                "px-6 py-3 text-sm font-semibold transition-colors capitalize",
                activeListTab === tab
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="p-4">
          {activeListTab === "medications" && (
            <ListTable
              items={medStore.medications}
              page={medPage}
              total={medStore.total}
              onPageChange={(p) => { setMedPage(p); medStore.fetchMedications({ page: p, limit: 5 }); }}
              columns={[
                { header: "Name", render: (m: Medication) => <span className="font-semibold">{m.name}</span> },
                { header: "Dosage", render: (m: Medication) => m.dosage },
                { header: "Frequency", render: (m: Medication) => m.frequency },
                { header: "Start", render: (m: Medication) => formatDate(m.startDate) },
              ]}
              onView={(m) => setDetailItem({ type: "medication", data: m })}
              onEdit={(m) => setEditItem({ type: "medication", data: m })}
              onDelete={(m) => handleDelete("medication", m.id)}
            />
          )}

          {activeListTab === "appointments" && (
            <ListTable
              items={aptStore.appointments}
              page={aptPage}
              total={aptStore.total}
              onPageChange={(p) => { setAptPage(p); aptStore.fetchAppointments({ page: p, limit: 5 }); }}
              columns={[
                { header: "Title", render: (a: Appointment) => <span className="font-semibold">{a.title}</span> },
                { header: "Provider", render: (a: Appointment) => a.providerName || "—" },
                { header: "Date", render: (a: Appointment) => formatDate(a.appointmentDate) },
                { header: "Time", render: (a: Appointment) => a.startTime },
                { header: "Status", render: (a: Appointment) => <StatusBadge status={a.status} /> },
              ]}
              onView={(a) => setDetailItem({ type: "appointment", data: a })}
              onEdit={(a) => setEditItem({ type: "appointment", data: a })}
              onDelete={(a) => handleDelete("appointment", a.id)}
            />
          )}

          {activeListTab === "logs" && (
            <ListTable
              items={logStore.logs}
              page={logPage}
              total={logStore.total}
              onPageChange={(p) => { setLogPage(p); logStore.fetchLogs({ page: p, limit: 5 }); }}
              columns={[
                { header: "Title", render: (l: HealthLog) => <span className="font-semibold">{l.title}</span> },
                { header: "Type", render: (l: HealthLog) => formatMetricType(l.logType) },
                { header: "Value", render: (l: HealthLog) => l.value ? `${l.value} ${l.unit || ""}` : "—" },
                { header: "Logged", render: (l: HealthLog) => formatRelative(l.loggedAt) },
              ]}
              onView={(l) => setDetailItem({ type: "log", data: l })}
              onEdit={(l) => setEditItem({ type: "log", data: l })}
              onDelete={(l) => handleDelete("log", l.id)}
            />
          )}
        </div>
      </div>

      <Dialog open={quickAdd !== null} onOpenChange={(open) => { if (!open) setQuickAdd(null); }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {quickAdd === "medication" && "Add Medication"}
              {quickAdd === "appointment" && "Add Appointment"}
              {quickAdd === "log" && "Add Health Log"}
              {quickAdd === "device" && "Sync Device"}
            </DialogTitle>
            <DialogDescription />
          </DialogHeader>
          {quickAdd === "medication" && (
            <MedicationForm onSubmit={async (data) => { await medStore.createMedication(data); setQuickAdd(null); fetchSummary(); }} />
          )}
          {quickAdd === "appointment" && (
            <AppointmentForm onSubmit={async (data) => { await aptStore.createAppointment(data); setQuickAdd(null); fetchSummary(); }} />
          )}
          {quickAdd === "log" && (
            <HealthLogForm onSubmit={async (data) => { await logStore.createLog(data); setQuickAdd(null); fetchSummary(); }} />
          )}
          {quickAdd === "device" && (
            <DeviceSyncForm onSubmit={async (data) => { await deviceStore.addDevice(data); setQuickAdd(null); fetchSummary(); }} />
          )}
        </DialogContent>
      </Dialog>

      <DetailDialog item={detailItem} onClose={() => setDetailItem(null)} />
      <EditDialog item={editItem} onClose={() => setEditItem(null)} onSave={async (type, id, data) => {
        if (type === "medication") await medStore.updateMedication(id, data);
        else if (type === "appointment") await aptStore.updateAppointment(id, data);
        else if (type === "log") await logStore.updateLog(id, data);
        setEditItem(null);
        fetchSummary();
      }} />
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    SCHEDULED: "bg-blue-100 text-blue-700",
    CONFIRMED: "bg-green-100 text-green-700",
    IN_PROGRESS: "bg-yellow-100 text-yellow-700",
    COMPLETED: "bg-gray-100 text-gray-700",
    CANCELLED: "bg-red-100 text-red-700",
    NO_SHOW: "bg-orange-100 text-orange-700",
  };
  return (
    <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full", colors[status] || "bg-gray-100 text-gray-600")}>
      {status.replace(/_/g, " ")}
    </span>
  );
}

function ListTable<T extends { id: string }>({
  items,
  page,
  total,
  onPageChange,
  columns,
  onView,
  onEdit,
  onDelete,
}: {
  items: T[];
  page: number;
  total: number;
  onPageChange: (page: number) => void;
  columns: { header: string; render: (item: T) => React.ReactNode }[];
  onView: (item: T) => void;
  onEdit: (item: T) => void;
  onDelete: (item: T) => void;
}) {
  const totalPages = Math.ceil(total / 5);
  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              {columns.map((col) => (
                <th key={col.header} className="text-left py-2 px-3 text-muted-foreground font-semibold text-xs uppercase tracking-wider">{col.header}</th>
              ))}
              <th className="text-right py-2 px-3 text-muted-foreground font-semibold text-xs uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                {columns.map((col) => (
                  <td key={col.header} className="py-3 px-3">{col.render(item)}</td>
                ))}
                <td className="py-3 px-3 text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" onClick={() => onView(item)}><Eye className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => onEdit(item)}><Pencil className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => onDelete(item)}><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td colSpan={columns.length + 1} className="py-8 text-center text-muted-foreground">No items found</td></tr>
            )}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-3">
          <span className="text-xs text-muted-foreground">Page {page} of {totalPages}</span>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

function DetailDialog({ item, onClose }: { item: { type: string; data: any } | null; onClose: () => void }) {
  if (!item) return null;
  const d = item.data;
  return (
    <Dialog open={!!item} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{d.name || d.title} — Detail</DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <div className="space-y-2 text-sm">
          {Object.entries(d).map(([key, value]) => {
            if (value === null || value === undefined || key === "id" || key === "userId") return null;
            return (
              <div key={key} className="flex justify-between border-b py-1.5">
                <span className="text-muted-foreground capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                <span className="font-medium text-right max-w-[60%] truncate">
                  {Array.isArray(value) ? value.join(", ") : String(value)}
                </span>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function EditDialog({ item, onClose, onSave }: { item: { type: string; data: any } | null; onClose: () => void; onSave: (type: string, id: string, data: any) => Promise<void> }) {
  if (!item) return null;
  return (
    <Dialog open={!!item} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit {item.type}</DialogTitle>
          <DialogDescription />
        </DialogHeader>
        {item.type === "medication" && (
          <MedicationForm initial={item.data} onSubmit={async (data) => { await onSave(item.type, item.data.id, data); }} />
        )}
        {item.type === "appointment" && (
          <AppointmentForm initial={item.data} onSubmit={async (data) => { await onSave(item.type, item.data.id, data); }} />
        )}
        {item.type === "log" && (
          <HealthLogForm initial={item.data} onSubmit={async (data) => { await onSave(item.type, item.data.id, data); }} />
        )}
      </DialogContent>
    </Dialog>
  );
}

function DeviceSyncForm({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  return (
    <div className="space-y-3">
      <input className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Device Name" value={name} onChange={(e) => setName(e.target.value)} />
      <input className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Device Type (e.g. smartwatch)" value={type} onChange={(e) => setType(e.target.value)} />
      <DialogFooter>
        <Button onClick={() => onSubmit({ deviceName: name, deviceType: type })} disabled={!name || !type}>Connect Device</Button>
      </DialogFooter>
    </div>
  );
}
