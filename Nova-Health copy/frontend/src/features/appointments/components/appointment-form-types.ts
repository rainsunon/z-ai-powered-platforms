import { type Appointment } from '@/store/useAppointmentStore';

export type AppointmentFormData = Omit<Appointment, 'id'>;

export const emptyForm: AppointmentFormData = {
  title: '',
  doctor: '',
  specialty: '',
  date: '',
  time: '',
  duration: 30,
  location: '',
  type: 'in-person',
  status: 'upcoming',
  notes: '',
  icon: 'calendar_today',
};
