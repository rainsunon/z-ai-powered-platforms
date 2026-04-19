import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import type { PostgresDatabase } from "@vive/database/postgres";
import { createHealthLogController } from "../controllers/health-log.controller.js";
import { createHealthLogSchema, updateHealthLogSchema, healthLogQuerySchema } from "../validators/health-log.validator.js";

export function healthLogRoutes(db: PostgresDatabase) {
  const router = new Hono();
  const ctrl = createHealthLogController(db);

  router.get("/health-logs", zValidator("query", healthLogQuerySchema), async (c) => {
    const user = c.get("user");
    if (!user) return c.json({ error: "Unauthorized" }, 401);
    const query = c.req.valid("query");
    const result = await ctrl.list(user.id, query.page, query.limit, {
      logType: query.logType,
      startDate: query.startDate,
      endDate: query.endDate,
      search: query.search,
    });
    return c.json(result);
  });

  router.get("/health-logs/:id", async (c) => {
    const user = c.get("user");
    if (!user) return c.json({ error: "Unauthorized" }, 401);
    const item = await ctrl.getById(user.id, c.req.param("id"));
    if (!item) return c.json({ error: "Not found" }, 404);
    return c.json(item);
  });

  router.post("/health-logs", zValidator("json", createHealthLogSchema), async (c) => {
    const user = c.get("user");
    if (!user) return c.json({ error: "Unauthorized" }, 401);
    const data = c.req.valid("json");
    const item = await ctrl.create(user.id, data);
    return c.json(item, 201);
  });

  router.patch("/health-logs/:id", zValidator("json", updateHealthLogSchema), async (c) => {
    const user = c.get("user");
    if (!user) return c.json({ error: "Unauthorized" }, 401);
    const data = c.req.valid("json");
    const item = await ctrl.update(user.id, c.req.param("id"), data);
    if (!item) return c.json({ error: "Not found" }, 404);
    return c.json(item);
  });

  router.delete("/health-logs/:id", async (c) => {
    const user = c.get("user");
    if (!user) return c.json({ error: "Unauthorized" }, 401);
    const deleted = await ctrl.delete(user.id, c.req.param("id"));
    if (!deleted) return c.json({ error: "Not found" }, 404);
    return c.json({ success: true });
  });

  return router;
}
