import cors from "cors";
import { corsConfig } from "../config/services.js";

export const corsMiddleware = cors({
  origin: corsConfig.origin,
  credentials: corsConfig.credentials,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["Content-Range", "X-Content-Range"],
  maxAge: 600, // 10 minutes
});
