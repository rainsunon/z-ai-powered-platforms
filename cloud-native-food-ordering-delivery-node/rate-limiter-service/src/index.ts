import express from "express";
import dotenv from "dotenv";
import routes from "./routes/index.js";
import { db } from "./db/index.js";
import { rateLimitRules } from "./db/schema.js";
import { eq } from "drizzle-orm";
import { redis } from "./redis/client.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// CORS for microservices communication
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use("/api/rate-limiter", routes);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.get("/ready", async (req, res) => {
  try {
    await redis.ping();
    await db.execute('SELECT 1' as any);
    res.status(200).json({ status: "ready" });
  } catch (error) {
    res.status(503).json({ status: "not ready", error: String(error) });
  }
});

// Init DB with default rule if empty
const init = async () => {
    try {
        // Simple check if global rule exists
       const globalRule = await db.query.rateLimitRules.findFirst({
           where: eq(rateLimitRules.key, "global_default")
       });
       
       if (!globalRule) {
           await db.insert(rateLimitRules).values({
               key: "global_default",
               type: "TOKEN_BUCKET",
               points: 100,
               duration: 60, // 100 req per minute
               createdAt: new Date(),
               updatedAt: new Date()
           });
           console.log("Initialized global_default rule");
       }
    } catch (e) {
        console.error("Failed to init DB rule. Ensure DB is running and migrations are applied.", e);
    }
}

const server = app.listen(PORT, () => {
  console.log(`Rate Limiter Service running on port ${PORT}`);
  init();
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(async () => {
    console.log('HTTP server closed');
    await redis.quit();
    process.exit(0);
  });
});

process.on('SIGINT', async () => {
  console.log('SIGINT signal received: closing HTTP server');
  server.close(async () => {
    console.log('HTTP server closed');
    await redis.quit();
    process.exit(0);
  });
});
