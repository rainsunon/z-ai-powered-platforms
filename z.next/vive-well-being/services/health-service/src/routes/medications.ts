import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import type { PostgresDatabase } from "@vive/database/postgres";
import { createMedicationController } from "../controllers/medication.controller.js";
import { createMedicationSchema, updateMedicationSchema, medicationQuerySchema } from "../validators/medication.validator.js";

export function medicationRoutes(db: PostgresDatabase) {
  const router = new Hono();
  const ctrl = createMedicationController(db);

  router.get("/medications", zValidator("query", medicationQuerySchema), async (c) => {
    const user = c.get("user");
    if (!user) return c.json({ error: "Unauthorized" }, 401);
    const query = c.req.valid("query");
    const result = await ctrl.list(user.id, query.page, query.limit, query.isActive, query.search);
    return c.json(result);
  });

  router.get("/medications/:id", async (c) => {
    const user = c.get("user");
    if (!user) return c.json({ error: "Unauthorized" }, 401);
    const item = await ctrl.getById(user.id, c.req.param("id"));
    if (!item) return c.json({ error: "Not found" }, 404);
    return c.json(item);
  });

  router.post("/medications", zValidator("json", createMedicationSchema), async (c) => {
    const user = c.get("user");
    if (!user) return c.json({ error: "Unauthorized" }, 401);
    const data = c.req.valid("json");
    const item = await ctrl.create(user.id, data);
    return c.json(item, 201);
  });

  router.patch("/medications/:id", zValidator("json", updateMedicationSchema), async (c) => {
    const user = c.get("user");
    if (!user) return c.json({ error: "Unauthorized" }, 401);
    const data = c.req.valid("json");
    const item = await ctrl.update(user.id, c.req.param("id"), data);
    if (!item) return c.json({ error: "Not found" }, 404);
    return c.json(item);
  });

  router.delete("/medications/:id", async (c) => {
    const user = c.get("user");
    if (!user) return c.json({ error: "Unauthorized" }, 401);
    const deleted = await ctrl.delete(user.id, c.req.param("id"));
    if (!deleted) return c.json({ error: "Not found" }, 404);
    return c.json({ success: true });
  });

  return router;
}
