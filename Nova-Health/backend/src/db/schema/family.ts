import { pgTable, serial, text, timestamp, boolean, jsonb } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users';

export const families = pgTable('families', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  primaryUserId: serial('primary_user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const familyMembers = pgTable('family_members', {
  id: serial('id').primaryKey(),
  userId: serial('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  familyId: serial('family_id')
    .notNull()
    .references(() => families.id, { onDelete: 'cascade' }),
  role: text('role', {
    enum: ['primary', 'spouse', 'child', 'parent', 'sibling', 'other'],
  }).notNull(),
  permissions: text('permission', {
    enum: ['view', 'edit', 'admin'],
  }).notNull(),
  healthData: jsonb('health_data').$type<{
    conditions?: string[];
    allergies?: string[];
    medications?: string[];
    bloodType?: string;
    chronicConditions?: string[];
    disabilities?: string[];
  }>(),
  emergencyContact: boolean('emergency_contact').notNull().default(false),
  joinedAt: timestamp('joined_at').notNull().defaultNow(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const familyInvitations = pgTable('family_invitations', {
  id: serial('id').primaryKey(),
  familyId: serial('family_id')
    .notNull()
    .references(() => families.id, { onDelete: 'cascade' }),
  invitedBy: serial('invited_by')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  email: text('email').notNull(),
  role: text('role', {
    enum: ['primary', 'spouse', 'child', 'parent', 'sibling', 'other'],
  }).notNull(),
  status: text('status', {
    enum: ['pending', 'accepted', 'declined', 'expired'],
  }).notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const familiesRelations = relations(families, ({ one, many }) => ({
  primaryUser: one(users, {
    fields: [families.primaryUserId],
    references: [users.id],
  }),
  members: many(familyMembers),
  invitations: many(familyInvitations),
}));

export const familyMembersRelations = relations(familyMembers, ({ one }) => ({
  user: one(users, {
    fields: [familyMembers.userId],
    references: [users.id],
  }),
  family: one(families, {
    fields: [familyMembers.familyId],
    references: [families.id],
  }),
}));

export const familyInvitationsRelations = relations(familyInvitations, ({ one }) => ({
  family: one(families, {
    fields: [familyInvitations.familyId],
    references: [families.id],
  }),
  invitedByUser: one(users, {
    fields: [familyInvitations.invitedBy],
    references: [users.id],
  }),
}));
