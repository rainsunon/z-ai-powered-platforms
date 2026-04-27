import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono } from "@hono/zod-openapi";
import { serveStatic } from "@hono/node-server/serve-static";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import "dotenv/config";

import { auth } from "./lib/auth";
import type { AppType } from "./lib/hono";
import customers from "./routes/customers";
import products from "./routes/products";
import invoices from "./routes/invoices";
import sales from "./routes/sales";
import estimates from "./routes/estimates";
import purchases from "./routes/purchases";
import transactions from "./routes/transactions";
import dashboard from "./routes/dashboard";
import reports from "./routes/reports";
import auditLogs from "./routes/audit-logs";
import settings from "./routes/settings";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = new OpenAPIHono<AppType>();

app.use("*", logger());
app.use("*", prettyJSON());
app.use(
  "*",
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") || [
      "http://localhost:5173",
      "http://localhost:3000",
    ],
    credentials: true,
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  })
);

app.get("/", (c) => {
  return c.json({
    message: "NovaStone API Server",
    version: "1.0.0",
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
});

app.get("/health", (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.on(["POST", "GET"], "/api/auth/**", (c) => {
  return auth.handler(c.req.raw);
});

app.route("/api/customers", customers);
app.route("/api/products", products);
app.route("/api/invoices", invoices);
app.route("/api/sales", sales);
app.route("/api/estimates", estimates);
app.route("/api/purchases", purchases);
app.route("/api/transactions", transactions);
app.route("/api/dashboard", dashboard);
app.route("/api/reports", reports);
app.route("/api/audit-logs", auditLogs);
app.route("/api/settings", settings);

app.doc("/doc", {
  openapi: "3.0.0",
  info: {
    version: "1.0.0",
    title: "NovaStone API",
    description:
      "Complete accounting and financial management API with PostgreSQL JSONB support",
  },
  servers: [
    {
      url: process.env.BETTER_AUTH_URL || "http://localhost:3000",
      description: "Development server",
    },
  ],
  tags: [
    { name: "Auth", description: "Authentication endpoints" },
    { name: "Customers", description: "Customer management" },
    { name: "Products", description: "Product and service management" },
    { name: "Invoices", description: "Invoice management" },
    { name: "Sales", description: "Sales tracking" },
    { name: "Estimates", description: "Estimate/Quote management" },
    { name: "Purchases", description: "Purchase tracking" },
    { name: "Transactions", description: "Financial transactions" },
    { name: "Dashboard", description: "Dashboard KPIs and analytics" },
    { name: "Reports", description: "Financial reports" },
    { name: "AuditLogs", description: "Audit trail logs" },
    { name: "Settings", description: "User settings" },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  security: [{ bearerAuth: [] }],
});

app.get("/ui", swaggerUI({ url: "/doc" }));

const clientDistPath = path.resolve(__dirname, "../../client/dist");

if (fs.existsSync(clientDistPath)) {
  app.use("/*", serveStatic({ root: clientDistPath }));

  app.get("*", (c) => {
    const indexPath = path.join(clientDistPath, "index.html");
    const html = fs.readFileSync(indexPath, "utf-8");
    return c.html(html);
  });
}

app.notFound((c) => {
  return c.json({ error: "Not Found", path: c.req.path }, 404);
});

app.onError((err, c) => {
  console.error(`Error: ${err.message}`);
  return c.json(
    {
      error: err.message || "Internal Server Error",
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    },
    500
  );
});

const port = Number(process.env.PORT) || 3000;

console.log(`NovaStone API Server starting on port ${port}`);

serve(
  {
    fetch: app.fetch,
    port,
  },
  (info) => {
    console.log(`Server running at http://localhost:${info.port}`);
    console.log(`API Documentation: http://localhost:${info.port}/ui`);
    console.log(`Auth endpoints: http://localhost:${info.port}/api/auth/*`);
    if (fs.existsSync(clientDistPath)) {
      console.log(`Serving frontend from ${clientDistPath}`);
    } else {
      console.log(`Frontend not built yet. Run 'cd client && npm run build' first.`);
    }
  }
);
