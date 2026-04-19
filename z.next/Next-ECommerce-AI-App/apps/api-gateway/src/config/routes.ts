import { serviceConfig } from "./services.js";

export interface RouteConfig {
  path: string;
  target: string;
  pathRewrite?: Record<string, string>;
  auth?: boolean;
}

export const routes: RouteConfig[] = [
  // Auth Service
  {
    path: "/api/auth",
    target: serviceConfig.auth,
    pathRewrite: { "^/api": "" }, // Strip /api prefix
    auth: false, // Auth endpoints don't need auth
  },
  {
    path: "/api/users",
    target: serviceConfig.auth,
    pathRewrite: { "^/api": "" }, // Strip /api prefix
    auth: true,
  },

  // Product Service
  {
    path: "/api/products",
    target: serviceConfig.product,
    pathRewrite: { "^/api": "" }, // Strip /api prefix
    auth: false, // Public read access
  },
  {
    path: "/api/categories",
    target: serviceConfig.product,
    pathRewrite: { "^/api": "" }, // Strip /api prefix
    auth: false,
  },

  // Order Service
  {
    path: "/api/orders",
    target: serviceConfig.order,
    pathRewrite: { "^/api": "" }, // Strip /api prefix
    auth: true, // Orders require authentication
  },

  // Payment Service
  {
    path: "/api/payments",
    target: serviceConfig.payment,
    pathRewrite: { "^/api": "" }, // Strip /api prefix
    auth: true,
  },
  {
    path: "/api/sessions",
    target: serviceConfig.payment,
    pathRewrite: { "^/api": "" }, // Strip /api prefix
    auth: true,
  },

  // Discount Service
  {
    path: "/api/discount",
    target: serviceConfig.discount,
    pathRewrite: { "^/api": "" }, // Strip /api prefix
    auth: true, // Admin only
  },

  // Inventory Service
  {
    path: "/api/inventory",
    target: serviceConfig.inventory,
    pathRewrite: { "^/api": "" }, // Strip /api prefix
    auth: true, // Admin only
  },
  {
    path: "/api/analytics",
    target: serviceConfig.inventory,
    pathRewrite: { "^/api": "" }, // Strip /api prefix
    auth: true, // Admin only
  },
  {
    path: "/api/notifications",
    target: serviceConfig.inventory,
    pathRewrite: { "^/api": "" }, // Strip /api prefix
    auth: true, // Admin only
  },
];
