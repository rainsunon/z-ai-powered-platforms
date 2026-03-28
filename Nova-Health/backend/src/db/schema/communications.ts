import { pgTable, serial, text, timestamp, boolean, jsonb, numeric } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users';

export const conversations = pgTable('conversations', {
  id: serial('id').primaryKey(),
  participants: jsonb('participants').$type<number[]>().notNull(),
  type: text('type', {
    enum: ['doctor', 'family', 'support'],
  }).notNull(),
  subject: text('subject'),
  lastMessageAt: timestamp('last_message_at'),
  unreadCount: jsonb('unread_count').$type<Record<number, number>>().notNull(),
  metadata: jsonb('metadata').$type<{
    doctorId?: number;
    ticketId?: number;
    familyId?: number;
    isActive?: boolean;
    archived?: boolean;
  }>(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const messages = pgTable('messages', {
  id: serial('id').primaryKey(),
  conversationId: serial('conversation_id')
    .notNull()
    .references(() => conversations.id, { onDelete: 'cascade' }),
  senderId: serial('sender_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  type: text('type', {
    enum: ['text', 'image', 'document', 'system'],
  }).notNull(),
  attachments: jsonb('attachments').$type<Array<{
    id: number;
    name: string;
    type: string;
    size: number;
    url: string;
  }>>(),
  readBy: jsonb('read_by').$type<Record<number, string>>(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const notifications = pgTable('notifications', {
  id: serial('id').primaryKey(),
  userId: serial('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  type: text('type', {
    enum: ['appointment', 'medication', 'health_alert', 'family', 'system', 'billing'],
  }).notNull(),
  title: text('title').notNull(),
  message: text('message').notNull(),
  read: boolean('read').notNull().default(false),
  actionUrl: text('action_url'),
  metadata: jsonb('metadata').$type<{
    appointmentId?: number;
    medicationId?: number;
    invoiceId?: number;
    familyId?: number;
    priority?: 'low' | 'medium' | 'high';
  }>(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const documents = pgTable('documents', {
  id: serial('id').primaryKey(),
  userId: serial('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  type: text('type', {
    enum: ['lab_result', 'prescription', 'imaging', 'discharge_summary', 'insurance', 'other'],
  }).notNull(),
  title: text('title').notNull(),
  description: text('description'),
  fileName: text('file_name').notNull(),
  fileSize: numeric('file_size', { precision: 12, scale: 2 }).notNull(),
  mimeType: text('mime_type').notNull(),
  status: text('status', {
    enum: ['uploading', 'processing', 'available', 'failed'],
  }).notNull(),
  storagePath: text('storage_path').notNull(),
  storageProvider: text('storage_provider').notNull(),
  tags: jsonb('tags').$type<string[]>(),
  sharedWith: jsonb('shared_with').$type<number[]>(),
  metadata: jsonb('metadata').$type<{
    uploadId?: string;
    checksum?: string;
    thumbnailUrl?: string;
    previewUrl?: string;
    downloadCount?: number;
    lastAccessedAt?: string;
  }>(),
  uploadedAt: timestamp('uploaded_at').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const conversationsRelations = relations(conversations, ({ many }) => ({
  messages: many(messages),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  conversation: one(conversations, {
    fields: [messages.conversationId],
    references: [conversations.id],
  }),
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
  }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));

export const documentsRelations = relations(documents, ({ one }) => ({
  user: one(users, {
    fields: [documents.userId],
    references: [users.id],
  }),
}));
