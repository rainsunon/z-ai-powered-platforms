import { type Appointment } from '@/store/useAppointmentStore';

export const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export const statusColors: Record<string, string> = {
  upcoming: 'bg-primary text-on-primary',
  completed: 'bg-secondary text-on-secondary',
  cancelled: 'bg-error/50 text-on-error line-through',
};

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

export function formatDateKey(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export function getTodayKey(): string {
  const t = new Date();
  return formatDateKey(t.getFullYear(), t.getMonth(), t.getDate());
}

export function buildMonthPrefix(year: number, month: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}`;
}

export function groupByDate(appointments: Appointment[]): Record<string, Appointment[]> {
  const map: Record<string, Appointment[]> = {};
  appointments.forEach((apt) => {
    if (!map[apt.date]) map[apt.date] = [];
    map[apt.date].push(apt);
  });
  return map;
}

export interface CalendarCell {
  day: number;
  dateKey: string;
  isCurrentMonth: boolean;
}

export function buildMonthCells(year: number, month: number): CalendarCell[] {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const prevMonthDays = getDaysInMonth(year, month - 1);
  const cells: CalendarCell[] = [];

  for (let i = firstDay - 1; i >= 0; i--) {
    const d = prevMonthDays - i;
    cells.push({ day: d, dateKey: formatDateKey(year, month - 1, d), isCurrentMonth: false });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, dateKey: formatDateKey(year, month, d), isCurrentMonth: true });
  }
  const remaining = 42 - cells.length;
  for (let d = 1; d <= remaining; d++) {
    cells.push({ day: d, dateKey: formatDateKey(year, month + 1, d), isCurrentMonth: false });
  }
  return cells;
}

export interface WeekDate {
  day: number;
  dateKey: string;
  label: string;
  monthLabel: string;
}

export function buildWeekDates(currentDate: Date): WeekDate[] {
  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    return {
      day: d.getDate(),
      dateKey: formatDateKey(d.getFullYear(), d.getMonth(), d.getDate()),
      label: WEEKDAYS[d.getDay()],
      monthLabel: MONTHS[d.getMonth()].slice(0, 3),
    };
  });
}
