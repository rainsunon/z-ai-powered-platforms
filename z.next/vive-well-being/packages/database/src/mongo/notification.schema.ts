import { ObjectId, type Collection, type Document } from "mongodb";

export interface Notification {
  _id?: ObjectId;
  userId: string;
  type: string;
  channel: string;
  title: string;
  body: string;
  status: string;
  isRead: boolean;
  recipient?: string;
  errorMessage?: string;
  sentAt?: Date;
  readAt?: Date;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export type NotificationDocument = Notification & Document;

export function getNotificationsCollection(
  collection: Collection<NotificationDocument>,
) {
  return {
    collection,

    async findByUserId(userId: string, limit = 50) {
      return collection
        .find({ userId })
        .sort({ createdAt: -1 })
        .limit(limit)
        .toArray();
    },

    async findUnreadByUserId(userId: string) {
      return collection
        .find({ userId, isRead: false })
        .sort({ createdAt: -1 })
        .toArray();
    },

    async findById(id: string) {
      return collection.findOne({ _id: new ObjectId(id) });
    },

    async create(notification: Omit<Notification, "_id" | "createdAt" | "updatedAt">) {
      const now = new Date();
      const doc: Notification = {
        ...notification,
        createdAt: now,
        updatedAt: now,
      };
      const result = await collection.insertOne(doc);
      return { ...doc, _id: result.insertedId };
    },

    async markAsRead(id: string) {
      return collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { isRead: true, readAt: new Date(), updatedAt: new Date() } },
      );
    },

    async markAllAsRead(userId: string) {
      return collection.updateMany(
        { userId, isRead: false },
        { $set: { isRead: true, readAt: new Date(), updatedAt: new Date() } },
      );
    },

    async updateStatus(id: string, status: string, errorMessage?: string) {
      const update: Record<string, unknown> = {
        status,
        updatedAt: new Date(),
      };
      if (status === "SENT") update.sentAt = new Date();
      if (errorMessage) update.errorMessage = errorMessage;
      return collection.updateOne({ _id: new ObjectId(id) }, { $set: update });
    },

    async deleteById(id: string) {
      return collection.deleteOne({ _id: new ObjectId(id) });
    },
  };
}
