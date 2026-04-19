import { fromNodeHeaders } from "better-auth/node";
import type { Auth } from "./auth.js";
import type {
  FastifyInstance,
  FastifyRequest,
  FastifyReply,
} from "fastify";

/**
 * Registers the better-auth catch-all route as a Fastify plugin.
 *
 * Usage:
 *   fastify.register(fastifyAuthPlugin(auth));
 */
export function fastifyAuthPlugin(auth: Auth) {
  return async function plugin(fastify: FastifyInstance) {
    fastify.route({
      method: ["GET", "POST"],
      url: "/api/auth/*",
      async handler(request: FastifyRequest, reply: FastifyReply) {
        const url = new URL(
          request.url,
          `http://${request.headers.host}`,
        );
        const headers = fromNodeHeaders(request.headers);
        const req = new Request(url.toString(), {
          method: request.method,
          headers,
          ...(request.body ? { body: JSON.stringify(request.body) } : {}),
        });

        const response = await auth.handler(req);

        reply.status(response.status);
        response.headers.forEach((value, key) => reply.header(key, value));
        reply.send(response.body ? await response.text() : null);
      },
    });
  };
}

/**
 * Creates a Fastify preHandler hook that attaches `user` and `session` to the request.
 *
 * Usage:
 *   fastify.addHook("preHandler", fastifyAuthMiddleware(auth));
 *   // then in routes: request.user, request.authSession
 */
export function fastifyAuthMiddleware(auth: Auth) {
  return async (request: FastifyRequest, _reply: FastifyReply) => {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(request.headers),
    });

    (request as any).user = session?.user ?? null;
    (request as any).authSession = session?.session ?? null;
  };
}

export { fromNodeHeaders } from "better-auth/node";
export type { Auth } from "./auth.js";
