import "dotenv/config";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { createPostgresDb, type PostgresDatabase } from "@vive/database/postgres";
import {
  users,
  sessions,
  accounts,
  verifications,
} from "@vive/database/schema";

function getEnvOrThrow(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export interface CreateAuthOptions {
  db?: PostgresDatabase;
  databaseUrl?: string;
  secret?: string;
  baseURL?: string;
  trustedOrigins?: string[];
}

export function createAuth(options: CreateAuthOptions = {}) {
  const db = options.db ?? createPostgresDb(
    options.databaseUrl ?? getEnvOrThrow("POSTGRES_DATABASE_URL"),
  );
  const secret = options.secret ?? getEnvOrThrow("BETTER_AUTH_SECRET");
  const baseURL = options.baseURL ?? process.env.BETTER_AUTH_URL;

  return betterAuth({
    database: drizzleAdapter(db, {
      provider: "pg",
      schema: {
        user: users,
        session: sessions,
        account: accounts,
        verification: verifications,
      },
    }),
    secret,
    baseURL,
    trustedOrigins: options.trustedOrigins,
    emailAndPassword: {
      enabled: true,
    },
  });
}

export type Auth = ReturnType<typeof createAuth>;
