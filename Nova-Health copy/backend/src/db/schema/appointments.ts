import { pgTable, serial, text, timestamp, boolean, jsonb } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users';

export const appointments = pgTable('appointments', {
  id: serial('id').primaryKey(),
  userId: serial('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  doctorId: serial('doctor_id').notNull(),
  type: text('type', {
    enum: ['checkup', 'consultation', 'followup', 'procedure', 'emergency', 'therapy', 'lab_work'],
  }).notNull(),
  status: text('status', {
    enum: ['scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show'],
  }).notNull(),
  title: text('title').notNull(),
  description: text('description'),
  startTime: timestamp('start_time').notNull(),
  endTime: timestamp('end_time').notNull(),
  location: text('location'),
  notes: text('notes'),
  metadata: jsonb('metadata').$type<{
    reminderSent?: boolean;
    checkInTime?: string;
    checkOutTime?: string;
    doctorName?: string;
    doctorSpecialty?: string;
    clinicName?: string;
    roomNumber?: string;
  }>(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const appointmentsRelations = relations(appointments, ({ one }) => ({
  user: one(users, {
    fields: [appointments.userId],
    references: [users.id],
  }),
}));
