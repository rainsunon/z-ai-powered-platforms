import type { Context, Next } from "hono";
import { auth } from "../lib/auth";
import { AUTH_CONFIG } from "../lib/auth-config";
import type { AuthVariables } from "../lib/hono";

export async function authMiddleware(
  c: Context<{ Variables: AuthVariables }>,
  next: Next
) {
  const authHeader = c.req.header("Authorization");

  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.substring(7);
    try {
      const result = await auth.api.verifyJWT({
        body: { token, issuer: AUTH_CONFIG.jwtIssuer },
      });

      if (!result?.payload || !result.payload.sub) {
        return c.json({ error: "Unauthorized - Invalid or expired JWT" }, 401);
      }

      const payload = result.payload as {
        sub: string;
        email?: string;
        name?: string;
        role?: string;
        sessionId?: string;
        [key: string]: unknown;
      };

      c.set("userId", payload.sub);
      c.set("userEmail", payload.email || "");
      c.set("userName", payload.name || "");
      c.set("jwtPayload", payload);
      return next();
    } catch {
      return c.json({ error: "Unauthorized - JWT verification failed" }, 401);
    }
  }

  try {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    if (!session?.user?.id) {
      return c.json({ error: "Unauthorized - No valid session" }, 401);
    }
    c.set("userId", session.user.id);
    c.set("userEmail", session.user.email || "");
    c.set("userName", session.user.name || "");
    c.set("jwtPayload", null);
    return next();
  } catch {
    return c.json({ error: "Unauthorized - No token provided" }, 401);
  }
}
