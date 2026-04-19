import express, { Router } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { routes } from "../config/routes.js";
import { requireAuth, authMiddleware } from "../middleware/auth.js";
import { logger } from "../utils/logger.js";

const router: Router = express.Router();

// Create proxy for each route
routes.forEach((route) => {
  logger.info(`Setting up proxy route: ${route.path} -> ${route.target}`);

  const proxyMiddleware = createProxyMiddleware({
    target: route.target,
    changeOrigin: true,
    pathRewrite: route.pathRewrite,
    onProxyReq: (proxyReq, req, res) => {
      // Forward original headers
      logger.debug(`Proxying request to ${route.target}${req.url}`);
    },
    onProxyRes: (proxyRes, req, res) => {
      logger.debug(`Received response from ${route.target}`, {
        statusCode: proxyRes.statusCode,
      });
    },
    onError: (err, req, res) => {
      logger.error(`Proxy error for ${route.target}`, {
        error: err.message,
        path: req.url,
      });
      
      res.status(503).json({
        error: {
          message: "Service temporarily unavailable",
          service: route.path,
        },
      });
    },
  });

  // Apply auth middleware if required
  if (route.auth) {
    // For protected routes, apply Clerk middleware first, then requireAuth
    router.use(route.path, authMiddleware, requireAuth, proxyMiddleware);
  } else {
    // Public routes don't need auth
    router.use(route.path, proxyMiddleware);
  }
});

export default router;
