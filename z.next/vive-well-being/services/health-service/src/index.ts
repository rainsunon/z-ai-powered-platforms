import "dotenv/config";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { serve } from "@hono/node-server";
import { createPostgresDb } from "@vive/database/postgres";
import { createAuth } from "@vive/auth";
import { honoAuthHandler, honoAuthMiddleware } from "@vive/auth/hono";
import { medicationRoutes } from "./routes/medications.js";
import { appointmentRoutes } from "./routes/appointments.js";
import { deviceSyncRoutes } from "./routes/device-syncs.js";
import { healthLogRoutes } from "./routes/health-logs.js";
import { healthMetricRoutes } from "./routes/health-metrics.js";
import { documentRoutes } from "./routes/documents.js";
import { dashboardRoutes } from "./routes/dashboard.js";

const db = createPostgresDb(process.env.DATABASE_URL!);
const auth = createAuth({ db, databaseUrl: process.env.DATABASE_URL });

const app = new Hono();
const PORT = parseInt(process.env.PORT || "3002");

app.use("*", logger());
app.use(
  "*",
  cors({
    origin: process.env.CORS_ORIGINS?.split(",") || [
      "http://localhost:3000",
      "http://localhost:3001",
    ],
    credentials: true,
  })
);

app.on(["POST", "GET"], "/api/auth/*", honoAuthHandler(auth));

app.use("/api/*", honoAuthMiddleware(auth));

app.get("/health", (c) => c.json({ status: "ok", service: "health-service" }));

const api = app.basePath("/api");

api.route("/", medicationRoutes(db));
api.route("/", appointmentRoutes(db));
api.route("/", deviceSyncRoutes(db));
api.route("/", healthLogRoutes(db));
api.route("/", healthMetricRoutes(db));
api.route("/", documentRoutes(db));
api.route("/", dashboardRoutes(db));

serve({ fetch: app.fetch, port: PORT }, (info) => {
  console.log(`Health service running on http://localhost:${info.port}`);
});

export { app };
