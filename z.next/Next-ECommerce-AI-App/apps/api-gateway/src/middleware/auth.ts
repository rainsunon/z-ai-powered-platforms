import { Request, Response, NextFunction, RequestHandler } from "express";
import { clerkMiddleware, getAuth } from "@clerk/express";

// Clerk middleware for authentication
export const authMiddleware: RequestHandler = clerkMiddleware();

// Custom middleware to check if user is authenticated
export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const { userId } = getAuth(req);

  if (!userId) {
    return res.status(401).json({
      error: {
        message: "Unauthorized - Authentication required",
      },
    });
  }

  next();
};

// Optional auth - doesn't block if not authenticated
export const optionalAuth = (req: Request, res: Response, next: NextFunction) => {
  // Just pass through, auth info will be available if present
  next();
};
