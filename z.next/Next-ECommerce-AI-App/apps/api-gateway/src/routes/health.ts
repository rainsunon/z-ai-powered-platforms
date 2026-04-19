import express, { Request, Response, Router } from "express";
import { serviceConfig } from "../config/services.js";

const router:Router = express.Router();

// Gateway health check
router.get("/health", (req: Request, res: Response) => {
  res.json({
    status: "ok",
    service: "api-gateway",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Services health check
router.get("/health/services", async (req: Request, res: Response) => {
  const services = Object.entries(serviceConfig);
  const healthChecks = await Promise.allSettled(
    services.map(async ([name, url]) => {
      try {
        const response = await fetch(`${url}/health`, {
          signal: AbortSignal.timeout(5000),
        });
        return {
          name,
          url,
          status: response.ok ? "healthy" : "unhealthy",
          statusCode: response.status,
        };
      } catch (error) {
        return {
          name,
          url,
          status: "unhealthy",
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }
    })
  );

  const results = healthChecks.map((result, index) => {
    if (result.status === "fulfilled") {
      return result.value;
    }
    return {
      name: services[index]![0],
      url: services[index]![1],
      status: "error",
      error: result.reason,
    };
  });

  const allHealthy = results.every((r) => r.status === "healthy");

  res.status(allHealthy ? 200 : 503).json({
    status: allHealthy ? "ok" : "degraded",
    services: results,
    timestamp: new Date().toISOString(),
  });
});

export default router;
