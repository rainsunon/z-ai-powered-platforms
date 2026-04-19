import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import type { PostgresDatabase } from "@vive/database/postgres";
import { createDocumentController } from "../controllers/document.controller.js";
import { createDocumentSchema, updateDocumentSchema, documentQuerySchema } from "../validators/document.validator.js";

export function documentRoutes(db: PostgresDatabase) {
  const router = new Hono();
  const ctrl = createDocumentController(db);

  router.get("/documents", zValidator("query", documentQuerySchema), async (c) => {
    const user = c.get("user");
    if (!user) return c.json({ error: "Unauthorized" }, 401);
    const query = c.req.valid("query");
    const result = await ctrl.list(user.id, query.page, query.limit, {
      documentType: query.documentType,
      search: query.search,
      startDate: query.startDate,
      endDate: query.endDate,
    });
    return c.json(result);
  });

  router.get("/documents/export", async (c) => {
    const user = c.get("user");
    if (!user) return c.json({ error: "Unauthorized" }, 401);
    const allDocs = await ctrl.list(user.id, 1, 10000);
    c.header("Content-Type", "application/json");
    c.header("Content-Disposition", "attachment; filename=health-documents-export.json");
    return c.json(allDocs);
  });

  router.get("/documents/export-report", async (c) => {
    const user = c.get("user");
    if (!user) return c.json({ error: "Unauthorized" }, 401);
    const docs = await ctrl.list(user.id, 1, 10000);
    const report = {
      generatedAt: new Date().toISOString(),
      totalDocuments: docs.total,
      documents: docs.items.map((d: any) => ({
        title: d.title,
        type: d.documentType,
        issuedDate: d.issuedDate,
        providerName: d.providerName,
      })),
    };
    c.header("Content-Type", "application/json");
    c.header("Content-Disposition", "attachment; filename=health-report.json");
    return c.json(report);
  });

  router.get("/documents/:id", async (c) => {
    const user = c.get("user");
    if (!user) return c.json({ error: "Unauthorized" }, 401);
    const item = await ctrl.getById(user.id, c.req.param("id"));
    if (!item) return c.json({ error: "Not found" }, 404);
    return c.json(item);
  });

  router.post("/documents", zValidator("json", createDocumentSchema), async (c) => {
    const user = c.get("user");
    if (!user) return c.json({ error: "Unauthorized" }, 401);
    const data = c.req.valid("json");
    const item = await ctrl.create(user.id, data);
    return c.json(item, 201);
  });

  router.patch("/documents/:id", zValidator("json", updateDocumentSchema), async (c) => {
    const user = c.get("user");
    if (!user) return c.json({ error: "Unauthorized" }, 401);
    const data = c.req.valid("json");
    const item = await ctrl.update(user.id, c.req.param("id"), data);
    if (!item) return c.json({ error: "Not found" }, 404);
    return c.json(item);
  });

  router.delete("/documents/:id", async (c) => {
    const user = c.get("user");
    if (!user) return c.json({ error: "Unauthorized" }, 401);
    const deleted = await ctrl.delete(user.id, c.req.param("id"));
    if (!deleted) return c.json({ error: "Not found" }, 404);
    return c.json({ success: true });
  });

  return router;
}
