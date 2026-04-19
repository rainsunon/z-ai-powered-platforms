import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import type { PostgresDatabase } from "@vive/database/postgres";
import { createDeviceSyncController } from "../controllers/device-sync.controller.js";
import { createDeviceSyncSchema, updateDeviceSyncSchema } from "../validators/device-sync.validator.js";

export function deviceSyncRoutes(db: PostgresDatabase) {
  const router = new Hono();
  const ctrl = createDeviceSyncController(db);

  router.get("/devices", async (c) => {
    const user = c.get("user");
    if (!user) return c.json({ error: "Unauthorized" }, 401);
    const items = await ctrl.list(user.id);
    return c.json(items);
  });

  router.get("/devices/:id", async (c) => {
    const user = c.get("user");
    if (!user) return c.json({ error: "Unauthorized" }, 401);
    const item = await ctrl.getById(user.id, c.req.param("id"));
    if (!item) return c.json({ error: "Not found" }, 404);
    return c.json(item);
  });

  router.post("/devices", zValidator("json", createDeviceSyncSchema), async (c) => {
    const user = c.get("user");
    if (!user) return c.json({ error: "Unauthorized" }, 401);
    const data = c.req.valid("json");
    const item = await ctrl.create(user.id, data);
    return c.json(item, 201);
  });

  router.patch("/devices/:id", zValidator("json", updateDeviceSyncSchema), async (c) => {
    const user = c.get("user");
    if (!user) return c.json({ error: "Unauthorized" }, 401);
    const data = c.req.valid("json");
    const item = await ctrl.update(user.id, c.req.param("id"), data);
    if (!item) return c.json({ error: "Not found" }, 404);
    return c.json(item);
  });

  router.post("/devices/:id/sync", async (c) => {
    const user = c.get("user");
    if (!user) return c.json({ error: "Unauthorized" }, 401);
    const item = await ctrl.sync(user.id, c.req.param("id"));
    if (!item) return c.json({ error: "Not found" }, 404);
    return c.json(item);
  });

  router.delete("/devices/:id", async (c) => {
    const user = c.get("user");
    if (!user) return c.json({ error: "Unauthorized" }, 401);
    const deleted = await ctrl.delete(user.id, c.req.param("id"));
    if (!deleted) return c.json({ error: "Not found" }, 404);
    return c.json({ success: true });
  });

  return router;
}
