import React from 'react';
import { type Appointment } from '@/store/useAppointmentStore';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { type AppointmentFormData } from './appointment-form-types';

interface AppointmentFormFieldsProps {
  form: AppointmentFormData;
  onFormChange: (form: AppointmentFormData) => void;
}

export function AppointmentFormFields({ form, onFormChange }: AppointmentFormFieldsProps) {
  const update = <K extends keyof AppointmentFormData>(key: K, value: AppointmentFormData[K]) => {
    onFormChange({ ...form, [key]: value });
  };

  return (
    <div className="space-y-5 px-4 py-2">
      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="apt-title">Title *</Label>
        <Input
          id="apt-title"
          value={form.title}
          onChange={(e) => update('title', e.target.value)}
          placeholder="e.g. Cardiology Review"
        />
      </div>

      <Separator />

      {/* Doctor + Specialty */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="apt-doctor">Doctor *</Label>
          <Input
            id="apt-doctor"
            value={form.doctor}
            onChange={(e) => update('doctor', e.target.value)}
            placeholder="Dr. Name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="apt-specialty">Specialty</Label>
          <Input
            id="apt-specialty"
            value={form.specialty}
            onChange={(e) => update('specialty', e.target.value)}
            placeholder="e.g. Cardiology"
          />
        </div>
      </div>

      <Separator />

      {/* Date + Time */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="apt-date">Date *</Label>
          <Input
            id="apt-date"
            type="date"
            value={form.date}
            onChange={(e) => update('date', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="apt-time">Time *</Label>
          <Input
            id="apt-time"
            type="time"
            value={form.time}
            onChange={(e) => update('time', e.target.value)}
          />
        </div>
      </div>

      {/* Duration + Type */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="apt-duration">Duration (min)</Label>
          <Input
            id="apt-duration"
            type="number"
            min={5}
            max={240}
            value={form.duration}
            onChange={(e) => update('duration', Number(e.target.value))}
          />
        </div>
        <div className="space-y-2">
          <Label>Type</Label>
          <Select
            value={form.type}
            onValueChange={(val) => update('type', val as Appointment['type'])}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="in-person">In-person</SelectItem>
              <SelectItem value="telehealth">Telehealth</SelectItem>
              <SelectItem value="lab">Lab Work</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Separator />

      {/* Location */}
      <div className="space-y-2">
        <Label htmlFor="apt-location">Location</Label>
        <Input
          id="apt-location"
          value={form.location}
          onChange={(e) => update('location', e.target.value)}
          placeholder="e.g. St. Jude Medical Center"
        />
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="apt-notes">Notes</Label>
        <Textarea
          id="apt-notes"
          value={form.notes}
          onChange={(e) => update('notes', e.target.value)}
          placeholder="Any preparation notes..."
          rows={3}
        />
      </div>
    </div>
  );
}
