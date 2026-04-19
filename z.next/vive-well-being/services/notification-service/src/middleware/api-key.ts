import type { Context, Next } from "hono";
import { env } from "../config/env.js";

/**
 * API-key authentication middleware.
 * Validates the `x-api-key` header against the configured secret.
 * The /health endpoint is excluded from authentication.
 */
export async function apiKeyAuth(c: Context, next: Next) {
  // Skip auth for health checks and docs
  if (c.req.path === "/health" || c.req.path === "/docs" || c.req.path === "/openapi.json") {
    return next();
  }

  const apiKey = c.req.header("x-api-key");

  if (!apiKey || apiKey !== env.API_KEY) {
    return c.json({ error: "Unauthorized: invalid or missing API key" }, 401);
  }

  await next();
}
