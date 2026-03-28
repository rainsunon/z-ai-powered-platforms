import { pgTable, serial, text, timestamp, boolean, jsonb } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users';

export const medications = pgTable('medications', {
  id: serial('id').primaryKey(),
  userId: serial('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  type: text('type', {
    enum: ['prescription', 'over_the_counter', 'supplement', 'herbal'],
  }).notNull(),
  dosage: text('dosage').notNull(),
  frequency: text('frequency').notNull(),
  instructions: text('instructions'),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date'),
  active: boolean('active').notNull().default(true),
  prescribedBy: text('prescribed_by'),
  pharmacyId: text('pharmacy_id'),
  refillInfo: jsonb('refill_info').$type<{
    remaining: number;
    nextRefillDate?: string;
    prescriptionNumber?: string;
  }>(),
  sideEffects: jsonb('side_effects').$type<string[]>(),
  interactions: jsonb('interactions').$type<string[]>(),
  metadata: jsonb('metadata').$type<{
    manufacturer?: string;
    genericName?: string;
    ndcCode?: string;
    rxNumber?: string;
    lastFilled?: string;
  }>(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const medicationSchedules = pgTable('medication_schedules', {
  id: serial('id').primaryKey(),
  medicationId: serial('medication_id')
    .notNull()
    .references(() => medications.id, { onDelete: 'cascade' }),
  scheduledTime: timestamp('scheduled_time').notNull(),
  taken: boolean('taken').notNull().default(false),
  takenAt: timestamp('taken_at'),
  notes: text('notes'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const medicationsRelations = relations(medications, ({ one, many }) => ({
  user: one(users, {
    fields: [medications.userId],
    references: [users.id],
  }),
  schedules: many(medicationSchedules),
}));

export const medicationSchedulesRelations = relations(medicationSchedules, ({ one }) => ({
  medication: one(medications, {
    fields: [medicationSchedules.medicationId],
    references: [medications.id],
  }),
}));
