import { toNodeHandler, fromNodeHeaders } from "better-auth/node";
import type { Auth } from "./auth.js";
import type { Request, Response, NextFunction } from "express";

/**
 * Creates an Express catch-all handler for better-auth.
 *
 * Usage:
 *   app.all("/api/auth/*", expressAuthHandler(auth));
 *   // Express v5: app.all("/api/auth/*splat", expressAuthHandler(auth));
 */
export function expressAuthHandler(auth: Auth) {
  return toNodeHandler(auth);
}

/**
 * Creates an Express middleware that attaches `user` and `session` to `req`.
 *
 * Usage:
 *   app.use(expressAuthMiddleware(auth));
 *   // then in routes: req.user, req.session
 */
export function expressAuthMiddleware(auth: Auth) {
  return async (req: Request, _res: Response, next: NextFunction) => {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    (req as any).user = session?.user ?? null;
    (req as any).authSession = session?.session ?? null;
    next();
  };
}

export { toNodeHandler, fromNodeHeaders } from "better-auth/node";
export type { Auth } from "./auth.js";
