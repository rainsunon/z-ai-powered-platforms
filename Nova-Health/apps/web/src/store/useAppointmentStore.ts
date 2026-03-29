import { create } from 'zustand';

export interface Appointment {
  id: string;
  title: string;
  doctor: string;
  specialty: string;
  date: string; // ISO date string YYYY-MM-DD
  time: string; // e.g. '14:30'
  duration: number; // minutes
  location: string;
  type: 'in-person' | 'telehealth' | 'lab';
  status: 'upcoming' | 'completed' | 'cancelled';
  notes: string;
  icon: string;
}

interface AppointmentState {
  appointments: Appointment[];
  addAppointment: (appointment: Omit<Appointment, 'id'>) => void;
  updateAppointment: (id: string, updates: Partial<Appointment>) => void;
  deleteAppointment: (id: string) => void;
  cancelAppointment: (id: string) => void;
}

const defaultAppointments: Appointment[] = [
  {
    id: 'apt-1',
    title: 'Cardiology Review',
    doctor: 'Dr. Aris Thorne',
    specialty: 'Cardiology',
    date: '2026-04-02',
    time: '14:30',
    duration: 30,
    location: 'St. Jude Medical Center, Room 412',
    type: 'in-person',
    status: 'upcoming',
    notes: 'Bring latest blood pressure readings. Fasting not required.',
    icon: 'ecg_heart',
  },
  {
    id: 'apt-2',
    title: 'Lab Work — Blood Panel',
    doctor: 'Dr. Sarah Mitchell',
    specialty: 'Pathology',
    date: '2026-04-05',
    time: '09:00',
    duration: 15,
    location: 'Nova Sanatorium Lab Wing',
    type: 'lab',
    status: 'upcoming',
    notes: '12-hour fasting required. Drink water only.',
    icon: 'biotech',
  },
  {
    id: 'apt-3',
    title: 'Tele-Consultation',
    doctor: 'Dr. James Winslow',
    specialty: 'General Practice',
    date: '2026-04-10',
    time: '11:00',
    duration: 20,
    location: 'Video Call',
    type: 'telehealth',
    status: 'upcoming',
    notes: 'Follow-up on seasonal allergy treatment plan.',
    icon: 'video_call',
  },
  {
    id: 'apt-4',
    title: 'Dermatology Follow-up',
    doctor: 'Dr. Priya Kapoor',
    specialty: 'Dermatology',
    date: '2026-03-15',
    time: '10:00',
    duration: 30,
    location: 'City Dermatology Clinic',
    type: 'in-person',
    status: 'completed',
    notes: 'Skin biopsy results reviewed — benign.',
    icon: 'dermatology',
  },
  {
    id: 'apt-5',
    title: 'Physical Therapy',
    doctor: 'Dr. Elena Torres',
    specialty: 'Physical Therapy',
    date: '2026-03-20',
    time: '16:00',
    duration: 45,
    location: 'Wellness Center, Floor 2',
    type: 'in-person',
    status: 'cancelled',
    notes: 'Session 4/6 — Rescheduled due to conflict.',
    icon: 'physical_therapy',
  },
];

export const useAppointmentStore = create<AppointmentState>((set) => ({
  appointments: defaultAppointments,
  addAppointment: (appointment) =>
    set((state) => ({
      appointments: [
        ...state.appointments,
        { ...appointment, id: `apt-${Date.now()}` },
      ],
    })),
  updateAppointment: (id, updates) =>
    set((state) => ({
      appointments: state.appointments.map((a) =>
        a.id === id ? { ...a, ...updates } : a
      ),
    })),
  deleteAppointment: (id) =>
    set((state) => ({
      appointments: state.appointments.filter((a) => a.id !== id),
    })),
  cancelAppointment: (id) =>
    set((state) => ({
      appointments: state.appointments.map((a) =>
        a.id === id ? { ...a, status: 'cancelled' as const } : a
      ),
    })),
}));
