import { createDb, type Database } from "@vive/notification-db";
import { env } from "../config/env.js";

export const db: Database = createDb(env.DATABASE_URL);
