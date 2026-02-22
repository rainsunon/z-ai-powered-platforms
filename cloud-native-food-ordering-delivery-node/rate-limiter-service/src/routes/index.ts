import express, { type Request, type Response } from "express";
import { RateLimiterService } from "../services/rateLimiter.js";
import { db } from "../db/index.js";
import { rateLimitRules } from "../db/schema.js";
import { eq } from "drizzle-orm";

const router = express.Router();
const rateLimiter = new RateLimiterService();

router.post("/check", async (req: Request, res: Response): Promise<void> => {
  try {
    const { key, cost } = req.body;

    if (!key) {
      res.status(400).json({ error: "Key is required" });
      return;
    }

    const result = await rateLimiter.checkLimit(key, cost || 1);

    if (result.allowed) {
      res.set("X-RateLimit-Remaining", result.remainingPoints.toString());
      res.status(200).json(result);
    } else {
      res.set("X-RateLimit-Remaining", result.remainingPoints.toString());
      res.set("Retry-After", Math.ceil(result.retryAfterMs! / 1000).toString());
      res.status(429).json(result);
    }
  } catch (error) {
    console.error("Rate limit check error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Admin endpoint to create/update rate limit rules
router.post("/rules", async (req: Request, res: Response): Promise<void> => {
  try {
    const { key, type, points, duration } = req.body;

    if (!key || !points || !duration) {
      res.status(400).json({ error: "key, points, and duration are required" });
      return;
    }

    // Check if rule exists
    const existing = await db.query.rateLimitRules.findFirst({
      where: eq(rateLimitRules.key, key)
    });

    if (existing) {
      // Update
      await db.update(rateLimitRules)
        .set({ 
          type: type || "TOKEN_BUCKET", 
          points, 
          duration, 
          updatedAt: new Date() 
        })
        .where(eq(rateLimitRules.key, key));
      
      rateLimiter.clearCache();
      res.status(200).json({ message: "Rule updated", key });
    } else {
      // Insert
      await db.insert(rateLimitRules).values({
        key,
        type: type || "TOKEN_BUCKET",
        points,
        duration,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      rateLimiter.clearCache();
      res.status(201).json({ message: "Rule created", key });
    }
  } catch (error) {
    console.error("Rule creation/update error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get all rules
router.get("/rules", async (req: Request, res: Response): Promise<void> => {
  try {
    const rules = await db.query.rateLimitRules.findMany();
    res.status(200).json({ rules });
  } catch (error) {
    console.error("Rules fetch error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete a rule
router.delete("/rules/:key", async (req: Request, res: Response): Promise<void> => {
  try {
    const { key } = req.params;
    
    if (!key || typeof key !== 'string') {
      res.status(400).json({ error: "Valid key parameter is required" });
      return;
    }
    
    await db.delete(rateLimitRules).where(eq(rateLimitRules.key, key));
    rateLimiter.clearCache();
    res.status(200).json({ message: "Rule deleted", key });
  } catch (error) {
    console.error("Rule deletion error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
