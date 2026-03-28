import { pgTable, serial, text, timestamp, boolean, jsonb } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users';

export const supportTickets = pgTable('support_tickets', {
  id: serial('id').primaryKey(),
  userId: serial('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  subject: text('subject').notNull(),
  description: text('description').notNull(),
  category: text('category', {
    enum: ['technical', 'billing', 'medical', 'account', 'other'],
  }).notNull(),
  status: text('status', {
    enum: ['open', 'in_progress', 'resolved', 'closed'],
  }).notNull(),
  priority: text('priority', {
    enum: ['low', 'medium', 'high', 'urgent'],
  }).notNull(),
  assignedTo: serial('assigned_to').references(() => users.id),
  metadata: jsonb('metadata').$type<{
    lastActivityAt?: string;
    resolutionTime?: number;
    satisfactionRating?: number;
    tags?: string[];
  }>(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  resolvedAt: timestamp('resolved_at'),
});

export const ticketMessages = pgTable('ticket_messages', {
  id: serial('id').primaryKey(),
  ticketId: serial('ticket_id')
    .notNull()
    .references(() => supportTickets.id, { onDelete: 'cascade' }),
  senderId: serial('sender_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  isInternal: boolean('is_internal').notNull().default(false),
  attachments: jsonb('attachments').$type<Array<{
    name: string;
    url: string;
    size: number;
  }>>(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const securityLogs = pgTable('security_logs', {
  id: serial('id').primaryKey(),
  userId: serial('user_id').references(() => users.id, { onDelete: 'cascade' }),
  action: text('action').notNull(),
  ipAddress: text('ip_address').notNull(),
  userAgent: text('user_agent'),
  success: boolean('success').notNull(),
  details: jsonb('details').$type<{
    attemptNumber?: number;
    failureReason?: string;
    additionalInfo?: any;
  }>(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const systemAlerts = pgTable('system_alerts', {
  id: serial('id').primaryKey(),
  type: text('type', {
    enum: ['maintenance', 'security', 'feature', 'emergency'],
  }).notNull(),
  title: text('title').notNull(),
  message: text('message').notNull(),
  severity: text('severity', {
    enum: ['info', 'warning', 'error', 'critical'],
  }).notNull(),
  active: boolean('active').notNull().default(true),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date'),
  targetAudience: jsonb('target_audience').$type<{
    roles?: string[];
    userIds?: number[];
  }>(),
  metadata: jsonb('metadata').$type<{
    createdBy?: number;
    updatedBy?: number;
    dismissible?: boolean;
  }>(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const accessRequests = pgTable('access_requests', {
  id: serial('id').primaryKey(),
  requesterId: serial('requester_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  targetUserId: serial('target_user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  type: text('type', {
    enum: ['health_data', 'appointments', 'medications', 'documents'],
  }).notNull(),
  reason: text('reason').notNull(),
  status: text('status', {
    enum: ['pending', 'approved', 'denied', 'expired'],
  }).notNull(),
  expiresAt: timestamp('expires_at'),
  metadata: jsonb('metadata').$type<{
    grantedAt?: string;
    deniedAt?: string;
    denialReason?: string;
    accessDuration?: string;
  }>(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  respondedAt: timestamp('responded_at'),
});

export const supportTicketsRelations = relations(supportTickets, ({ one, many }) => ({
  user: one(users, {
    fields: [supportTickets.userId],
    references: [users.id],
  }),
  assignedToUser: one(users, {
    fields: [supportTickets.assignedTo],
    references: [users.id],
  }),
  messages: many(ticketMessages),
}));

export const ticketMessagesRelations = relations(ticketMessages, ({ one }) => ({
  ticket: one(supportTickets, {
    fields: [ticketMessages.ticketId],
    references: [supportTickets.id],
  }),
  sender: one(users, {
    fields: [ticketMessages.senderId],
    references: [users.id],
  }),
}));

export const securityLogsRelations = relations(securityLogs, ({ one }) => ({
  user: one(users, {
    fields: [securityLogs.userId],
    references: [users.id],
  }),
}));

export const accessRequestsRelations = relations(accessRequests, ({ one }) => ({
  requester: one(users, {
    fields: [accessRequests.requesterId],
    references: [users.id],
  }),
  targetUser: one(users, {
    fields: [accessRequests.targetUserId],
    references: [users.id],
  }),
}));
