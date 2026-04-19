import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import type { PostgresDatabase } from "@vive/database/postgres";
import { createAppointmentController } from "../controllers/appointment.controller.js";
import { createAppointmentSchema, updateAppointmentSchema, appointmentQuerySchema, batchCreateAppointmentSchema } from "../validators/appointment.validator.js";

export function appointmentRoutes(db: PostgresDatabase) {
  const router = new Hono();
  const ctrl = createAppointmentController(db);

  router.get("/appointments", zValidator("query", appointmentQuerySchema), async (c) => {
    const user = c.get("user");
    if (!user) return c.json({ error: "Unauthorized" }, 401);
    const query = c.req.valid("query");
    const result = await ctrl.list(user.id, query.page, query.limit, {
      status: query.status,
      date: query.date,
      startDate: query.startDate,
      endDate: query.endDate,
    });
    return c.json(result);
  });

  router.get("/appointments/:id", async (c) => {
    const user = c.get("user");
    if (!user) return c.json({ error: "Unauthorized" }, 401);
    const item = await ctrl.getById(user.id, c.req.param("id"));
    if (!item) return c.json({ error: "Not found" }, 404);
    return c.json(item);
  });

  router.post("/appointments", zValidator("json", createAppointmentSchema), async (c) => {
    const user = c.get("user");
    if (!user) return c.json({ error: "Unauthorized" }, 401);
    const data = c.req.valid("json");
    const item = await ctrl.create(user.id, data);
    return c.json(item, 201);
  });

  router.post("/appointments/batch", zValidator("json", batchCreateAppointmentSchema), async (c) => {
    const user = c.get("user");
    if (!user) return c.json({ error: "Unauthorized" }, 401);
    const { dates, appointment } = c.req.valid("json");
    const items = await ctrl.batchCreateForDates(user.id, dates, appointment);
    return c.json(items, 201);
  });

  router.patch("/appointments/:id", zValidator("json", updateAppointmentSchema), async (c) => {
    const user = c.get("user");
    if (!user) return c.json({ error: "Unauthorized" }, 401);
    const data = c.req.valid("json");
    const item = await ctrl.update(user.id, c.req.param("id"), data);
    if (!item) return c.json({ error: "Not found" }, 404);
    return c.json(item);
  });

  router.delete("/appointments/:id", async (c) => {
    const user = c.get("user");
    if (!user) return c.json({ error: "Unauthorized" }, 401);
    const deleted = await ctrl.delete(user.id, c.req.param("id"));
    if (!deleted) return c.json({ error: "Not found" }, 404);
    return c.json({ success: true });
  });

  return router;
}
