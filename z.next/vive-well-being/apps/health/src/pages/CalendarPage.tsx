import { useEffect, useState, useCallback } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  isToday,
} from "date-fns";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, Plus, X, Calendar as CalendarIcon, Pill } from "lucide-react";
import { useAppointmentStore, useMedicationStore } from "../stores";
import { cn, formatDate } from "../lib/utils";
import { Button } from "../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../components/ui/dialog";
import AppointmentForm from "../components/shared/AppointmentForm";
import MedicationForm from "../components/shared/MedicationForm";
import type { Appointment, Medication } from "../types";

type CalendarItemType = { type: "appointment"; data: Appointment } | { type: "medication"; data: Medication };

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [multiSelect, setMultiSelect] = useState(false);
  const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set());
  const [popupMode, setPopupMode] = useState<"appointment" | "medication" | null>(null);
  const [showAddMenu, setShowAddMenu] = useState(false);

  const aptStore = useAppointmentStore();
  const medStore = useMedicationStore();

  useEffect(() => {
    const start = format(startOfMonth(currentMonth), "yyyy-MM-dd");
    const end = format(endOfMonth(currentMonth), "yyyy-MM-dd");
    aptStore.fetchAppointments({ startDate: start, endDate: end, limit: 100 });
    medStore.fetchMedications({ limit: 100 });
  }, [currentMonth]);

  const calendarDays = buildCalendarDays(currentMonth);

  const itemsByDate = useCallback(() => {
    const map: Record<string, CalendarItemType[]> = {};
    aptStore.appointments.forEach((a) => {
      const key = a.appointmentDate;
      if (!map[key]) map[key] = [];
      map[key].push({ type: "appointment", data: a });
    });
    medStore.medications.forEach((m) => {
      const start = new Date(m.startDate);
      const end = m.endDate ? new Date(m.endDate) : null;
      calendarDays.forEach((day) => {
        const dayStr = format(day, "yyyy-MM-dd");
        const dayDate = new Date(dayStr);
        if (dayDate >= start && (!end || dayDate <= end)) {
          if (!map[dayStr]) map[dayStr] = [];
          map[dayStr].push({ type: "medication", data: m });
        }
      });
    });
    return map;
  }, [aptStore.appointments, medStore.medications, calendarDays]);

  const dayItems = itemsByDate();

  const handleDayClick = (day: Date) => {
    if (multiSelect) {
      const key = format(day, "yyyy-MM-dd");
      setSelectedDates((prev) => {
        const next = new Set(prev);
        if (next.has(key)) next.delete(key);
        else next.add(key);
        return next;
      });
    } else {
      setSelectedDate(day);
      setShowAddMenu(true);
    }
  };

  const handlePopupSubmit = async (data: any) => {
    if (multiSelect && selectedDates.size > 0) {
      if (popupMode === "appointment") {
        await aptStore.batchCreateAppointments(Array.from(selectedDates), data);
      }
    } else if (selectedDate) {
      const dateStr = format(selectedDate, "yyyy-MM-dd");
      if (popupMode === "appointment") {
        await aptStore.createAppointment({ ...data, appointmentDate: dateStr });
      } else if (popupMode === "medication") {
        await medStore.createMedication({ ...data, startDate: dateStr });
      }
    }
    setPopupMode(null);
    setSelectedDates(new Set());
    setShowAddMenu(false);
    const start = format(startOfMonth(currentMonth), "yyyy-MM-dd");
    const end = format(endOfMonth(currentMonth), "yyyy-MM-dd");
    aptStore.fetchAppointments({ startDate: start, endDate: end, limit: 100 });
    medStore.fetchMedications({ limit: 100 });
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-primary font-semibold tracking-widest text-xs uppercase mb-1">Schedule</p>
          <h1 className="text-3xl font-extrabold tracking-tight">Calendar</h1>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={multiSelect}
              onChange={(e) => {
                setMultiSelect(e.target.checked);
                setSelectedDates(new Set());
              }}
              className="rounded border-gray-300"
            />
            Select Multiple
          </label>
          {multiSelect && selectedDates.size > 0 && (
            <span className="text-xs text-muted-foreground">{selectedDates.size} days selected</span>
          )}
        </div>
      </header>

      <div className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h2 className="text-lg font-bold">{format(currentMonth, "MMMM yyyy")}</h2>
          <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

        <div className="grid grid-cols-7">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d} className="text-center text-xs font-semibold text-muted-foreground py-2 border-b">{d}</div>
          ))}
          {calendarDays.map((day, i) => {
            const key = format(day, "yyyy-MM-dd");
            const items = dayItems[key] || [];
            const inMonth = isSameMonth(day, currentMonth);
            const selected = multiSelect ? selectedDates.has(key) : selectedDate && isSameDay(day, selectedDate);
            return (
              <div
                key={i}
                onClick={() => inMonth && handleDayClick(day)}
                className={cn(
                  "min-h-[100px] border-b border-r p-2 cursor-pointer transition-colors relative",
                  !inMonth && "bg-muted/30 text-muted-foreground",
                  selected && "bg-primary/10 ring-2 ring-primary/30",
                  isToday(day) && "bg-blue-50/50"
                )}
              >
                <span className={cn(
                  "text-sm font-medium",
                  isToday(day) && "bg-primary text-white w-6 h-6 rounded-full inline-flex items-center justify-center text-xs"
                )}>
                  {format(day, "d")}
                </span>
                <div className="mt-1 space-y-0.5">
                  {items.slice(0, 3).map((item, j) => (
                    <div
                      key={j}
                      className={cn(
                        "text-[10px] font-medium px-1.5 py-0.5 rounded truncate",
                        item.type === "appointment" ? "bg-blue-100 text-blue-700" : "bg-emerald-100 text-emerald-700"
                      )}
                    >
                      {item.type === "appointment" ? item.data.title : item.data.name}
                    </div>
                  ))}
                  {items.length > 3 && (
                    <div className="text-[10px] text-muted-foreground">+{items.length - 3} more</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Dialog open={showAddMenu && !popupMode} onOpenChange={(open) => { if (!open) setShowAddMenu(false); }}>
        <DialogContent className="sm:max-w-xs">
          <DialogHeader>
            <DialogTitle>{selectedDate ? format(selectedDate, "EEEE, MMM d") : "Select dates first"}</DialogTitle>
            <DialogDescription>Add an item to {multiSelect && selectedDates.size > 0 ? `${selectedDates.size} selected days` : selectedDate ? format(selectedDate, "MMM d") : "this day"}</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            <Button className="gap-2" onClick={() => setPopupMode("appointment")}>
              <CalendarIcon className="w-4 h-4" /> Add Appointment
            </Button>
            <Button variant="outline" className="gap-2" onClick={() => setPopupMode("medication")}>
              <Pill className="w-4 h-4" /> Add Medication
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={popupMode !== null} onOpenChange={(open) => { if (!open) setPopupMode(null); }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {popupMode === "appointment" ? "Add Appointment" : "Add Medication"}
            </DialogTitle>
            <DialogDescription />
          </DialogHeader>
          {popupMode === "appointment" && <AppointmentForm onSubmit={handlePopupSubmit} />}
          {popupMode === "medication" && <MedicationForm onSubmit={handlePopupSubmit} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function buildCalendarDays(month: Date): Date[] {
  const start = startOfWeek(startOfMonth(month));
  const end = endOfWeek(endOfMonth(month));
  const days: Date[] = [];
  let day = start;
  while (day <= end) {
    days.push(day);
    day = addDays(day, 1);
  }
  return days;
}
