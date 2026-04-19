import { MongoClient, type Db } from "mongodb";
import {
  getSubscriptionsCollection,
  type SubscriptionDocument,
} from "./subscribe.schema.js";
import {
  getNotificationsCollection,
  type NotificationDocument,
} from "./notification.schema.js";

export interface MongoCollections {
  subscriptions: ReturnType<typeof getSubscriptionsCollection>;
  notifications: ReturnType<typeof getNotificationsCollection>;
}

export async function createMongoDb(connectionString: string, dbName: string) {
  const client = new MongoClient(connectionString);
  await client.connect();
  const db = client.db(dbName);
  const collections = initCollections(db);
  return { db, client, collections, close: async () => await client.close() };
}

function initCollections(db: Db): MongoCollections {
  return {
    subscriptions: getSubscriptionsCollection(
      db.collection<SubscriptionDocument>("subscriptions"),
    ),
    notifications: getNotificationsCollection(
      db.collection<NotificationDocument>("notifications"),
    ),
  };
}

export type MongoDatabase = Awaited<ReturnType<typeof createMongoDb>>;

export * from "./schema.js";
