import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  numeric,
  pgEnum,
  jsonb,
  integer,
  boolean,
  date,
  index,
} from "drizzle-orm/pg-core";

export const healthMetricTypeEnum = pgEnum("health_metric_type", [
  "HEART_RATE",
  "BLOOD_PRESSURE",
  "BLOOD_SUGAR",
  "WEIGHT",
  "HEIGHT",
  "STEPS",
  "SLEEP",
  "CALORIES",
  "WATER_INTAKE",
  "EXERCISE",
  "OTHER",
]);

export const medicationFrequencyEnum = pgEnum("medication_frequency", [
  "DAILY",
  "TWICE_DAILY",
  "WEEKLY",
  "AS_NEEDED",
  "CUSTOM",
]);

export const appointmentStatusEnum = pgEnum("appointment_status", [
  "SCHEDULED",
  "CONFIRMED",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
  "NO_SHOW",
]);

export const deviceSyncStatusEnum = pgEnum("device_sync_status", [
  "SYNCED",
  "SYNCING",
  "ERROR",
  "DISCONNECTED",
]);

export const documentTypeEnum = pgEnum("document_type", [
  "LAB_RESULT",
  "PRESCRIPTION",
  "IMAGING",
  "VISIT_SUMMARY",
  "REFERRAL",
  "VACCINATION",
  "OTHER",
]);

export const healthGoals = pgTable("health_goals", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  metricType: healthMetricTypeEnum("metric_type").notNull(),
  targetValue: numeric("target_value", { precision: 10, scale: 2 }).notNull(),
  currentValue: numeric("current_value", { precision: 10, scale: 2 }).default("0").notNull(),
  unit: varchar("unit", { length: 50 }).notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  isActive: integer("is_active").default(1).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  index("idx_health_goals_user_id").on(table.userId),
]);

export const healthMetrics = pgTable("health_metrics", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull(),
  metricType: healthMetricTypeEnum("metric_type").notNull(),
  value: numeric("value", { precision: 10, scale: 2 }).notNull(),
  unit: varchar("unit", { length: 50 }).notNull(),
  notes: text("notes"),
  metadata: jsonb("metadata").$type<Record<string, unknown>>(),
  recordedAt: timestamp("recorded_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  index("idx_health_metrics_user_id").on(table.userId),
  index("idx_health_metrics_metric_type").on(table.metricType),
  index("idx_health_metrics_recorded_at").on(table.recordedAt),
]);

export const healthActivities = pgTable("health_activities", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull(),
  activityType: varchar("activity_type", { length: 100 }).notNull(),
  durationMinutes: integer("duration_minutes").notNull(),
  caloriesBurned: numeric("calories_burned", { precision: 8, scale: 2 }),
  distanceKm: numeric("distance_km", { precision: 8, scale: 2 }),
  notes: text("notes"),
  metadata: jsonb("metadata").$type<Record<string, unknown>>(),
  performedAt: timestamp("performed_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  index("idx_health_activities_user_id").on(table.userId),
  index("idx_health_activities_performed_at").on(table.performedAt),
]);

export const healthMedications = pgTable("health_medications", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  dosage: varchar("dosage", { length: 100 }).notNull(),
  frequency: medicationFrequencyEnum("frequency").notNull(),
  startDate: date("start_date").notNull(),
  endDate: date("end_date"),
  timeOfDay: jsonb("time_of_day").$type<string[]>().default([]),
  notes: text("notes"),
  isActive: boolean("is_active").default(true).notNull(),
  prescribedBy: varchar("prescribed_by", { length: 255 }),
  refillsRemaining: integer("refills_remaining").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  index("idx_health_medications_user_id").on(table.userId),
  index("idx_health_medications_start_date").on(table.startDate),
]);

export const healthAppointments = pgTable("health_appointments", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  providerName: varchar("provider_name", { length: 255 }),
  location: varchar("location", { length: 500 }),
  appointmentDate: date("appointment_date").notNull(),
  startTime: varchar("start_time", { length: 10 }).notNull(),
  endTime: varchar("end_time", { length: 10 }),
  status: appointmentStatusEnum("status").default("SCHEDULED").notNull(),
  reminderMinutesBefore: integer("reminder_minutes_before").default(30),
  notes: text("notes"),
  metadata: jsonb("metadata").$type<Record<string, unknown>>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  index("idx_health_appointments_user_id").on(table.userId),
  index("idx_health_appointments_date").on(table.appointmentDate),
  index("idx_health_appointments_status").on(table.status),
]);

export const healthDeviceSyncs = pgTable("health_device_syncs", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull(),
  deviceName: varchar("device_name", { length: 255 }).notNull(),
  deviceType: varchar("device_type", { length: 100 }).notNull(),
  manufacturer: varchar("manufacturer", { length: 255 }),
  lastSyncedAt: timestamp("last_synced_at"),
  syncStatus: deviceSyncStatusEnum("sync_status").default("DISCONNECTED").notNull(),
  firmwareVersion: varchar("firmware_version", { length: 100 }),
  batteryLevel: integer("battery_level"),
  metadata: jsonb("metadata").$type<Record<string, unknown>>(),
  isConnected: boolean("is_connected").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  index("idx_health_device_syncs_user_id").on(table.userId),
]);

export const healthLogs = pgTable("health_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  logType: healthMetricTypeEnum("log_type").notNull(),
  value: numeric("value", { precision: 10, scale: 2 }),
  unit: varchar("unit", { length: 50 }),
  notes: text("notes"),
  tags: jsonb("tags").$type<string[]>().default([]),
  mood: integer("mood"),
  symptoms: jsonb("symptoms").$type<string[]>().default([]),
  loggedAt: timestamp("logged_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  index("idx_health_logs_user_id").on(table.userId),
  index("idx_health_logs_log_type").on(table.logType),
  index("idx_health_logs_logged_at").on(table.loggedAt),
]);

export const healthDocuments = pgTable("health_documents", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  documentType: documentTypeEnum("document_type").notNull(),
  fileName: varchar("file_name", { length: 500 }).notNull(),
  filePath: varchar("file_path", { length: 1000 }).notNull(),
  fileSizeBytes: integer("file_size_bytes"),
  mimeType: varchar("mime_type", { length: 100 }),
  description: text("description"),
  tags: jsonb("tags").$type<string[]>().default([]),
  issuedDate: date("issued_date"),
  providerName: varchar("provider_name", { length: 255 }),
  isShared: boolean("is_shared").default(false).notNull(),
  metadata: jsonb("metadata").$type<Record<string, unknown>>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  index("idx_health_documents_user_id").on(table.userId),
  index("idx_health_documents_type").on(table.documentType),
  index("idx_health_documents_issued_date").on(table.issuedDate),
]);
