import { useState } from "react";
import type { HealthLog, HealthMetricType } from "../../types";
import { Button } from "../ui/button";

const LOG_TYPES: HealthMetricType[] = [
  "HEART_RATE", "BLOOD_PRESSURE", "BLOOD_SUGAR", "WEIGHT", "HEIGHT",
  "STEPS", "SLEEP", "CALORIES", "WATER_INTAKE", "EXERCISE", "OTHER",
];

export default function HealthLogForm({
  initial,
  onSubmit,
}: {
  initial?: Partial<HealthLog>;
  onSubmit: (data: any) => void;
}) {
  const [title, setTitle] = useState(initial?.title || "");
  const [logType, setLogType] = useState<HealthMetricType>(initial?.logType || "OTHER");
  const [value, setValue] = useState(initial?.value || "");
  const [unit, setUnit] = useState(initial?.unit || "");
  const [mood, setMood] = useState(initial?.mood?.toString() || "");
  const [notes, setNotes] = useState(initial?.notes || "");
  const [symptoms, setSymptoms] = useState(initial?.symptoms?.join(", ") || "");
  const [tags, setTags] = useState(initial?.tags?.join(", ") || "");

  return (
    <div className="space-y-3">
      <input className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Log Title *" value={title} onChange={(e) => setTitle(e.target.value)} />
      <select className="w-full border rounded-lg px-3 py-2 text-sm" value={logType} onChange={(e) => setLogType(e.target.value as HealthMetricType)}>
        {LOG_TYPES.map((t) => <option key={t} value={t}>{t.replace(/_/g, " ")}</option>)}
      </select>
      <div className="grid grid-cols-2 gap-3">
        <input className="border rounded-lg px-3 py-2 text-sm" placeholder="Value" value={value || ""} onChange={(e) => setValue(e.target.value)} />
        <input className="border rounded-lg px-3 py-2 text-sm" placeholder="Unit" value={unit || ""} onChange={(e) => setUnit(e.target.value)} />
      </div>
      <div>
        <label className="text-xs text-muted-foreground">Mood (1-10)</label>
        <input className="w-full border rounded-lg px-3 py-2 text-sm" type="number" min={1} max={10} value={mood || ""} onChange={(e) => setMood(e.target.value)} />
      </div>
      <input className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Symptoms (comma separated)" value={symptoms} onChange={(e) => setSymptoms(e.target.value)} />
      <input className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Tags (comma separated)" value={tags} onChange={(e) => setTags(e.target.value)} />
      <textarea className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Notes" rows={2} value={notes || ""} onChange={(e) => setNotes(e.target.value)} />
      <div className="flex justify-end gap-2">
        <Button onClick={() => onSubmit({
          title, logType, value: value || null, unit: unit || null,
          mood: mood ? parseInt(mood) : null,
          symptoms: symptoms ? symptoms.split(",").map((s) => s.trim()) : [],
          tags: tags ? tags.split(",").map((t) => t.trim()) : [],
          notes,
        })} disabled={!title}>
          {initial ? "Update" : "Add Log"}
        </Button>
      </div>
    </div>
  );
}
