import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import type { PostgresDatabase } from "@vive/database/postgres";
import { createHealthMetricController } from "../controllers/health-metric.controller.js";
import { createHealthMetricSchema, healthMetricQuerySchema } from "../validators/health-metric.validator.js";

export function healthMetricRoutes(db: PostgresDatabase) {
  const router = new Hono();
  const ctrl = createHealthMetricController(db);

  router.get("/health-metrics", zValidator("query", healthMetricQuerySchema), async (c) => {
    const user = c.get("user");
    if (!user) return c.json({ error: "Unauthorized" }, 401);
    const query = c.req.valid("query");
    const result = await ctrl.list(user.id, query.page, query.limit, {
      metricType: query.metricType,
      startDate: query.startDate,
      endDate: query.endDate,
    });
    return c.json(result);
  });

  router.post("/health-metrics", zValidator("json", createHealthMetricSchema), async (c) => {
    const user = c.get("user");
    if (!user) return c.json({ error: "Unauthorized" }, 401);
    const data = c.req.valid("json");
    const item = await ctrl.create(user.id, data);
    return c.json(item, 201);
  });

  router.delete("/health-metrics/:id", async (c) => {
    const user = c.get("user");
    if (!user) return c.json({ error: "Unauthorized" }, 401);
    const deleted = await ctrl.delete(user.id, c.req.param("id"));
    if (!deleted) return c.json({ error: "Not found" }, 404);
    return c.json({ success: true });
  });

  router.get("/health-metrics/trend/:metricType", async (c) => {
    const user = c.get("user");
    if (!user) return c.json({ error: "Unauthorized" }, 401);
    const metricType = c.req.param("metricType");
    const days = parseInt(c.req.query("days") || "30");
    const items = await ctrl.getTrend(user.id, metricType, days);
    return c.json(items);
  });

  return router;
}
