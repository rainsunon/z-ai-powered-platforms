import { useState } from "react";
import type { Appointment } from "../../types";
import { Button } from "../ui/button";

const STATUSES = ["SCHEDULED", "CONFIRMED", "IN_PROGRESS", "COMPLETED", "CANCELLED", "NO_SHOW"];

export default function AppointmentForm({
  initial,
  onSubmit,
}: {
  initial?: Partial<Appointment>;
  onSubmit: (data: any) => void;
}) {
  const [title, setTitle] = useState(initial?.title || "");
  const [providerName, setProviderName] = useState(initial?.providerName || "");
  const [location, setLocation] = useState(initial?.location || "");
  const [appointmentDate, setAppointmentDate] = useState(initial?.appointmentDate || "");
  const [startTime, setStartTime] = useState(initial?.startTime || "09:00");
  const [endTime, setEndTime] = useState(initial?.endTime || "");
  const [status, setStatus] = useState(initial?.status || "SCHEDULED");
  const [notes, setNotes] = useState(initial?.notes || "");

  return (
    <div className="space-y-3">
      <input className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Appointment Title *" value={title} onChange={(e) => setTitle(e.target.value)} />
      <input className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Provider Name" value={providerName || ""} onChange={(e) => setProviderName(e.target.value)} />
      <input className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Location" value={location || ""} onChange={(e) => setLocation(e.target.value)} />
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="text-xs text-muted-foreground">Date *</label>
          <input className="w-full border rounded-lg px-3 py-2 text-sm" type="date" value={appointmentDate} onChange={(e) => setAppointmentDate(e.target.value)} />
        </div>
        <div>
          <label className="text-xs text-muted-foreground">Start *</label>
          <input className="w-full border rounded-lg px-3 py-2 text-sm" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
        </div>
        <div>
          <label className="text-xs text-muted-foreground">End</label>
          <input className="w-full border rounded-lg px-3 py-2 text-sm" type="time" value={endTime || ""} onChange={(e) => setEndTime(e.target.value)} />
        </div>
      </div>
      <select className="w-full border rounded-lg px-3 py-2 text-sm" value={status} onChange={(e) => setStatus(e.target.value as any)}>
        {STATUSES.map((s) => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
      </select>
      <textarea className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Notes" rows={2} value={notes || ""} onChange={(e) => setNotes(e.target.value)} />
      <div className="flex justify-end gap-2">
        <Button onClick={() => onSubmit({ title, providerName, location, appointmentDate: appointmentDate || undefined, startTime, endTime: endTime || null, status, notes })} disabled={!title || !startTime}>
          {initial ? "Update" : "Add Appointment"}
        </Button>
      </div>
    </div>
  );
}
