import { Request, Response, NextFunction } from "express";
import { getAuth } from "@clerk/express";
import { producer } from "../utils/kafka.js";
import { logger } from "../utils/logger.js";

export const auditMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  // Attach request ID to request
  (req as any).requestId = requestId;

  // Log response
  res.on("finish", async () => {
   
    try {
      let userId: string | null | undefined = undefined;
      let sessionId: string | null | undefined = undefined;

      try {
        const auth = getAuth(req);
        userId = auth.userId;
        sessionId = auth.sessionId;
      } catch (e) {
        // Auth context missing (public route or middleware not run)
        // This is expected for public routes
      }

      const duration = Date.now() - startTime;

      // Extract resource info from path
      const pathParts = req.path.split("/").filter(Boolean);
      const resourceType = pathParts[1]; // e.g., 'products', 'orders'
      const resourceId = pathParts[2]; // e.g., product ID

      const auditEvent = {
        eventType: `api.${req.method.toLowerCase()}`,
        eventCategory: "api",
        action: req.method.toLowerCase(),
        userId: userId || undefined,
        userEmail: (req as any).user?.email,
        userRole: (req as any).user?.role,
        resourceType: resourceType || undefined,
        resourceId: resourceId || undefined,
        ipAddress: req.ip || req.socket.remoteAddress,
        userAgent: req.get("user-agent"),
        requestId,
        timestamp: new Date().toISOString(),
        service: "api-gateway",
        success: res.statusCode < 400,
        errorMessage: res.statusCode >= 400 ? `HTTP ${res.statusCode}` : undefined,
        metadata: {
          path: req.path,
          method: req.method,
          statusCode: res.statusCode,
          duration: `${duration}ms`,
          sessionId: sessionId || undefined,
        },
      };

      logger.info("Audit info", {auditEvent});

      // Publish to Kafka
      const save = await producer.send("audit.api", { value: auditEvent });

      logger.info("HAppy boy", {save});
      
      logger.debug("Audit event published", { requestId, eventType: auditEvent.eventType });

    } catch (error) {
      
      logger.error("Failed to publish audit event", { error });
      // Don't fail the request if audit logging fails
    }
  });

  next();
};
