import type { Context, MiddlewareHandler } from "hono";
import type { Auth } from "./auth.js";

/**
 * Creates a Hono route handler that forwards auth requests to better-auth.
 *
 * Usage:
 *   app.on(["POST", "GET"], "/api/auth/*", honoAuthHandler(auth));
 */
export function honoAuthHandler(auth: Auth) {
  return (c: Context) => auth.handler(c.req.raw);
}

/**
 * Creates a Hono middleware that attaches `user` and `session` to the context.
 *
 * Usage:
 *   app.use("*", honoAuthMiddleware(auth));
 *   // then in routes: c.get("user"), c.get("session")
 */
export function honoAuthMiddleware(auth: Auth): MiddlewareHandler {
  return async (c, next) => {
    const session = await auth.api.getSession({
      headers: c.req.raw.headers,
    });

    c.set("user", session?.user ?? null);
    c.set("session", session?.session ?? null);
    await next();
  };
}

export type { Auth } from "./auth.js";
