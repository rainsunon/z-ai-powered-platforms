import { createEvents, type EventAttributes} from 'ics';
import type { Appointment } from '../store/useAppointmentStore';

export function exportAppointmentToICS(appointment: Appointment): void {
  const [year, month, day] = appointment.date.split('-').map(Number);
  const [hour, minute] = appointment.time.split(':').map(Number);

  const event: EventAttributes = {
    start: [year, month, day, hour, minute],
    duration: { minutes: appointment.duration },
    title: appointment.title,
    description: `${appointment.notes}\n\nDoctor: ${appointment.doctor}\nSpecialty: ${appointment.specialty}`,
    location: appointment.location,
    status: appointment.status === 'cancelled' ? 'CANCELLED' : 'CONFIRMED',
    organizer: { name: appointment.doctor },
  };

  createEvents([event], (error, value) => {
    if (error || !value) return;
    const blob = new Blob([value], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${appointment.title.replace(/\s+/g, '-').toLowerCase()}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  });
}

export function exportAllAppointmentsToICS(appointments: Appointment[]): void {
  const events: EventAttributes[] = appointments
    .filter((a) => a.status !== 'cancelled')
    .map((a) => {
      const [year, month, day] = a.date.split('-').map(Number);
      const [hour, minute] = a.time.split(':').map(Number);
      return {
        start: [year, month, day, hour, minute] as [number, number, number, number, number],
        duration: { minutes: a.duration },
        title: a.title,
        description: `Doctor: ${a.doctor}\nSpecialty: ${a.specialty}\n\n${a.notes}`,
        location: a.location,
        status: 'CONFIRMED' as const,
      };
    });

  createEvents(events, (error, value) => {
    if (error || !value) return;
    const blob = new Blob([value], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'appointments.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  });
}
