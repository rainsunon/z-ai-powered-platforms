import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema.js";

export function createPostgresDb(databaseUrl: string) {
  const client = postgres(databaseUrl, { max: 20 });
  return drizzle(client, { schema });
}

export type PostgresDatabase = ReturnType<typeof createPostgresDb>;

export * from "./schema.js";
