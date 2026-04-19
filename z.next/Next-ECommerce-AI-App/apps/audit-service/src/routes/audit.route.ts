import { FastifyInstance } from "fastify";
import { AuditLog } from "../models/AuditLog.js";

export const auditRoute = async (fastify: FastifyInstance) => {
  // GET /api/audit/logs - Query audit logs with filters
  fastify.get("/logs", async (request, reply) => {
    try {
      const {
        userId,
        eventType,
        eventCategory,
        resourceType,
        resourceId,
        startDate,
        endDate,
        success,
        limit = 100,
        offset = 0,
      } = request.query as any;

      // Build query
      const query: any = {};

      if (userId) query.userId = userId;
      if (eventType) query.eventType = eventType;
      if (eventCategory) query.eventCategory = eventCategory;
      if (resourceType) query.resourceType = resourceType;
      if (resourceId) query.resourceId = resourceId;
      if (success !== undefined) query.success = success === "true";

      // Date range filter
      if (startDate || endDate) {
        query.timestamp = {};
        if (startDate) query.timestamp.$gte = new Date(startDate);
        if (endDate) query.timestamp.$lte = new Date(endDate);
      }

      // Execute query with pagination
      const [logs, total] = await Promise.all([
        AuditLog.find(query)
          .sort({ timestamp: -1 })
          .limit(parseInt(limit))
          .skip(parseInt(offset))
          .lean(),
        AuditLog.countDocuments(query),
      ]);

      return reply.send({
        logs,
        pagination: {
          total,
          limit: parseInt(limit),
          offset: parseInt(offset),
          hasMore: total > parseInt(offset) + parseInt(limit),
        },
      });
    } catch (error) {
      console.error(error);
      return reply.status(500).send({ error: "Failed to fetch audit logs" });
    }
  });

  // GET /api/audit/users/:userId/activity - Get user activity
  fastify.get("/users/:userId/activity", async (request, reply) => {
    try {
      const { userId } = request.params as any;
      const { startDate, endDate, limit = 100 } = request.query as any;

      const query: any = { userId };

      if (startDate || endDate) {
        query.timestamp = {};
        if (startDate) query.timestamp.$gte = new Date(startDate);
        if (endDate) query.timestamp.$lte = new Date(endDate);
      }

      const logs = await AuditLog.find(query)
        .sort({ timestamp: -1 })
        .limit(parseInt(limit))
        .lean();

      return reply.send({ userId, logs });
    } catch (error) {
      console.error(error);
      return reply.status(500).send({ error: "Failed to fetch user activity" });
    }
  });

  // GET /api/audit/resources/:resourceType/:resourceId/history - Get resource history
  fastify.get("/resources/:resourceType/:resourceId/history", async (request, reply) => {
    try {
      const { resourceType, resourceId } = request.params as any;
      const { limit = 50 } = request.query as any;

      const logs = await AuditLog.find({ resourceType, resourceId })
        .sort({ timestamp: -1 })
        .limit(parseInt(limit))
        .lean();

      return reply.send({
        resourceType,
        resourceId,
        history: logs,
      });
    } catch (error) {
      console.error(error);
      return reply.status(500).send({ error: "Failed to fetch resource history" });
    }
  });

  // GET /api/audit/stats - Get audit statistics
  fastify.get("/stats", async (request, reply) => {
    try {
      const { startDate, endDate, groupBy = "eventType" } = request.query as any;

      const matchStage: any = {};
      if (startDate || endDate) {
        matchStage.timestamp = {};
        if (startDate) matchStage.timestamp.$gte = new Date(startDate);
        if (endDate) matchStage.timestamp.$lte = new Date(endDate);
      }

      const stats = await AuditLog.aggregate([
        ...(Object.keys(matchStage).length > 0 ? [{ $match: matchStage }] : []),
        {
          $group: {
            _id: `$${groupBy}`,
            count: { $sum: 1 },
            successCount: {
              $sum: { $cond: ["$success", 1, 0] },
            },
            failureCount: {
              $sum: { $cond: ["$success", 0, 1] },
            },
          },
        },
        { $sort: { count: -1 } },
      ]);

      return reply.send({ stats, groupBy });
    } catch (error) {
      console.error(error);
      return reply.status(500).send({ error: "Failed to fetch statistics" });
    }
  });

  // GET /api/audit/export - Export audit logs as CSV
  fastify.get("/export", async (request, reply) => {
    try {
      const { startDate, endDate, eventType, userId } = request.query as any;

      const query: any = {};
      if (eventType) query.eventType = eventType;
      if (userId) query.userId = userId;
      if (startDate || endDate) {
        query.timestamp = {};
        if (startDate) query.timestamp.$gte = new Date(startDate);
        if (endDate) query.timestamp.$lte = new Date(endDate);
      }

      const logs = await AuditLog.find(query)
        .sort({ timestamp: -1 })
        .limit(10000) // Limit export to 10k records
        .lean();

      // Create CSV
      const headers = [
        "Timestamp",
        "Event Type",
        "Category",
        "Action",
        "User ID",
        "User Email",
        "Resource Type",
        "Resource ID",
        "Success",
        "IP Address",
        "Service",
      ];

      const rows = logs.map((log) => [
        log.timestamp.toISOString(),
        log.eventType,
        log.eventCategory,
        log.action,
        log.userId || "",
        log.userEmail || "",
        log.resourceType || "",
        log.resourceId || "",
        log.success ? "Yes" : "No",
        log.ipAddress || "",
        log.service,
      ]);

      const csv = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");

      reply.header("Content-Type", "text/csv");
      reply.header(
        "Content-Disposition",
        `attachment; filename="audit-logs-${new Date().toISOString().split("T")[0]}.csv"`
      );
      return reply.send(csv);
    } catch (error) {
      console.error(error);
      return reply.status(500).send({ error: "Failed to export audit logs" });
    }
  });
};
