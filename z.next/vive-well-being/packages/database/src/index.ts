import "dotenv/config";
import { createPostgresDb, type PostgresDatabase } from "./postgres/index.js";
import { createMongoDb, type MongoDatabase } from "./mongo/index.js";

export function getEnvOrThrow(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export function initPostgresDb(url?: string): PostgresDatabase {
  return createPostgresDb(url ?? getEnvOrThrow("POSTGRES_DATABASE_URL"));
}

export async function initMongoDb(
  url?: string,
  dbName?: string,
): Promise<MongoDatabase> {
  return createMongoDb(
    url ?? getEnvOrThrow("MONGO_DATABASE_URL"),
    dbName ?? getEnvOrThrow("MONGO_DATABASE_NAME"),
  );
}

export { createPostgresDb, createMongoDb };
export type { PostgresDatabase, MongoDatabase };
export * from "./postgres/schema.js";
export * from "./mongo/schema.js";
