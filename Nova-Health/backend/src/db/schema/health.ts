import { pgTable, serial, text, timestamp, boolean, jsonb, numeric } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users';

export const vitalReadings = pgTable('vital_readings', {
  id: serial('id').primaryKey(),
  userId: serial('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  type: text('type', {
    enum: ['blood_pressure', 'heart_rate', 'blood_sugar', 'weight', 'temperature', 'oxygen_saturation'],
  }).notNull(),
  value: numeric('value', { precision: 10, scale: 2 }).notNull(),
  unit: text('unit').notNull(),
  timestamp: timestamp('timestamp').notNull(),
  notes: text('notes'),
  deviceId: text('device_id'),
  metadata: jsonb('metadata').$type<{
    systolic?: number;
    diastolic?: number;
    position?: 'standing' | 'sitting' | 'lying';
    activityLevel?: string;
    mealContext?: 'before_meal' | 'after_meal' | 'fasting';
  }>(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const symptoms = pgTable('symptoms', {
  id: serial('id').primaryKey(),
  userId: serial('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  severity: text('severity', {
    enum: ['mild', 'moderate', 'severe'],
  }).notNull(),
  description: text('description'),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date'),
  triggers: jsonb('triggers').$type<string[]>(),
  metadata: jsonb('metadata').$type<{
    bodyParts?: string[];
    associatedSymptoms?: string[];
    relievingFactors?: string[];
    aggravatingFactors?: string[];
  }>(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const healthGoals = pgTable('health_goals', {
  id: serial('id').primaryKey(),
  userId: serial('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  type: text('type', {
    enum: ['weight_loss', 'weight_gain', 'exercise', 'medication_adherence', 'vital_target', 'symptom_reduction'],
  }).notNull(),
  targetValue: numeric('target_value', { precision: 10, scale: 2 }),
  currentValue: numeric('current_value', { precision: 10, scale: 2 }),
  unit: text('unit'),
  startDate: timestamp('start_date').notNull(),
  targetDate: timestamp('target_date').notNull(),
  status: text('status', {
    enum: ['active', 'completed', 'paused', 'cancelled'],
  }).notNull(),
  metadata: jsonb('metadata').$type<{
    description?: string;
    milestones?: Array<{
      value: number;
      date: string;
      achieved: boolean;
    }>;
    reminders?: boolean;
  }>(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const healthRecords = pgTable('health_records', {
  id: serial('id').primaryKey(),
  userId: serial('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  recordType: text('record_type', {
    enum: ['lab_result', 'imaging', 'procedure', 'vaccination', 'checkup', 'hospitalization', 'other'],
  }).notNull(),
  title: text('title').notNull(),
  description: text('description'),
  provider: text('provider'),
  facility: text('facility'),
  date: timestamp('date').notNull(),
  documentIds: jsonb('document_ids').$type<number[]>(),
  metadata: jsonb('metadata').$type<{
    icdCodes?: string[];
    cptCodes?: string[];
    results?: any;
    notes?: string;
    followUpRequired?: boolean;
    followUpDate?: string;
  }>(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const vitalReadingsRelations = relations(vitalReadings, ({ one }) => ({
  user: one(users, {
    fields: [vitalReadings.userId],
    references: [users.id],
  }),
}));

export const symptomsRelations = relations(symptoms, ({ one }) => ({
  user: one(users, {
    fields: [symptoms.userId],
    references: [users.id],
  }),
}));

export const healthGoalsRelations = relations(healthGoals, ({ one }) => ({
  user: one(users, {
    fields: [healthGoals.userId],
    references: [users.id],
  }),
}));

export const healthRecordsRelations = relations(healthRecords, ({ one }) => ({
  user: one(users, {
    fields: [healthRecords.userId],
    references: [users.id],
  }),
}));
