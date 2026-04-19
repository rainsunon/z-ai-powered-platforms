import { ObjectId, type Collection, type Document } from "mongodb";

export interface Subscription {
  _id?: ObjectId;
  userId: string;
  plan: string;
  status: string;
  startDate: Date;
  endDate?: Date;
  autoRenew: boolean;
  paymentMethodId?: string;
  amount?: string;
  currency?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export type SubscriptionDocument = Subscription & Document;

export function getSubscriptionsCollection(
  collection: Collection<SubscriptionDocument>,
) {
  return {
    collection,

    async findByUserId(userId: string) {
      return collection.find({ userId }).sort({ createdAt: -1 }).toArray();
    },

    async findActiveByUserId(userId: string) {
      return collection
        .find({ userId, status: "ACTIVE" })
        .sort({ createdAt: -1 })
        .toArray();
    },

    async findById(id: string) {
      return collection.findOne({ _id: new ObjectId(id) });
    },

    async create(subscription: Omit<Subscription, "_id" | "createdAt" | "updatedAt">) {
      const now = new Date();
      const doc: Subscription = {
        ...subscription,
        createdAt: now,
        updatedAt: now,
      };
      const result = await collection.insertOne(doc);
      return { ...doc, _id: result.insertedId };
    },

    async updateById(id: string, update: Partial<Subscription>) {
      return collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { ...update, updatedAt: new Date() } },
      );
    },

    async deleteById(id: string) {
      return collection.deleteOne({ _id: new ObjectId(id) });
    },
  };
}
