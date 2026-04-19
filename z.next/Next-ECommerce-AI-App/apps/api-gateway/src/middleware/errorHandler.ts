import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger.js";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error("Error occurred", {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  // Don't leak error details in production
  const isDevelopment = process.env.NODE_ENV === "development";

  res.status(err.status || 500).json({
    error: {
      message: err.message || "Internal server error",
      ...(isDevelopment && { stack: err.stack }),
    },
  });
};

export const notFoundHandler = (req: Request, res: Response) => {
  logger.warn("Route not found", {
    path: req.path,
    method: req.method,
  });

  res.status(404).json({
    error: {
      message: "Route not found",
      path: req.path,
    },
  });
};
