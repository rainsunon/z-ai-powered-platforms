import { useState } from "react";
import type { Medication } from "../../types";
import { Button } from "../ui/button";

const FREQUENCIES = ["DAILY", "TWICE_DAILY", "WEEKLY", "AS_NEEDED", "CUSTOM"];

export default function MedicationForm({
  initial,
  onSubmit,
}: {
  initial?: Partial<Medication>;
  onSubmit: (data: any) => void;
}) {
  const [name, setName] = useState(initial?.name || "");
  const [dosage, setDosage] = useState(initial?.dosage || "");
  const [frequency, setFrequency] = useState(initial?.frequency || "DAILY");
  const [startDate, setStartDate] = useState(initial?.startDate || "");
  const [endDate, setEndDate] = useState(initial?.endDate || "");
  const [notes, setNotes] = useState(initial?.notes || "");
  const [prescribedBy, setPrescribedBy] = useState(initial?.prescribedBy || "");

  return (
    <div className="space-y-3">
      <input className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Medication Name *" value={name} onChange={(e) => setName(e.target.value)} />
      <input className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Dosage (e.g. 500mg) *" value={dosage} onChange={(e) => setDosage(e.target.value)} />
      <select className="w-full border rounded-lg px-3 py-2 text-sm" value={frequency} onChange={(e) => setFrequency(e.target.value as any)}>
        {FREQUENCIES.map((f) => <option key={f} value={f}>{f.replace(/_/g, " ")}</option>)}
      </select>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-muted-foreground">Start Date *</label>
          <input className="w-full border rounded-lg px-3 py-2 text-sm" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </div>
        <div>
          <label className="text-xs text-muted-foreground">End Date</label>
          <input className="w-full border rounded-lg px-3 py-2 text-sm" type="date" value={endDate || ""} onChange={(e) => setEndDate(e.target.value)} />
        </div>
      </div>
      <input className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Prescribed By" value={prescribedBy || ""} onChange={(e) => setPrescribedBy(e.target.value)} />
      <textarea className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Notes" rows={2} value={notes || ""} onChange={(e) => setNotes(e.target.value)} />
      <div className="flex justify-end gap-2">
        <Button onClick={() => onSubmit({ name, dosage, frequency, startDate: startDate || undefined, endDate: endDate || null, notes, prescribedBy })} disabled={!name || !dosage || !startDate}>
          {initial ? "Update" : "Add Medication"}
        </Button>
      </div>
    </div>
  );
}
