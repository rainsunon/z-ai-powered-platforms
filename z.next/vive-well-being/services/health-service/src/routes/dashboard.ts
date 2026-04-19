import { Hono } from "hono";
import type { PostgresDatabase } from "@vive/database/postgres";
import { createDashboardController } from "../controllers/dashboard.controller.js";

export function dashboardRoutes(db: PostgresDatabase) {
  const router = new Hono();
  const ctrl = createDashboardController(db);

  router.get("/dashboard/summary", async (c) => {
    const user = c.get("user");
    if (!user) return c.json({ error: "Unauthorized" }, 401);
    const summary = await ctrl.getSummary(user.id);
    return c.json(summary);
  });

  return router;
}
