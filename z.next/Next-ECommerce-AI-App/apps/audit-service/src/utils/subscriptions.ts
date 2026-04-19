import { consumer } from "./kafka.js";
import { AuditLog } from "../models/AuditLog.js";

export const runKafkaSubscriptions = async () => {
  console.log("Starting Kafka subscriptions for audit events...");

  // Subscribe to all audit topics
  const auditTopics = [
    "audit.auth",
    "audit.product",
    "audit.order",
    "audit.payment",
    "audit.inventory",
    "audit.discount",
    "audit.admin",
    "audit.api",
  ];

  // Create topic configurations with handlers
  const topicConfigurations = auditTopics.map((topic) => ({
    topicName: topic,
    topicHandler: async (message: any) => {
      try {
        const auditEvent = message;

        // console.log("Audit event received", { auditEvent });  

        // Create audit log entry
        await AuditLog.create({
          eventType: auditEvent.value.eventType,
          eventCategory: auditEvent.value.eventCategory,
          action: auditEvent.value.action,
          userId: auditEvent.value.userId,
          userEmail: auditEvent.value.userEmail,
          userRole: auditEvent.value.userRole,
          resourceType: auditEvent.value.resourceType,
          resourceId: auditEvent.value.resourceId,
          resourceName: auditEvent.value.resourceName,
          changes: auditEvent.value.changes,
          ipAddress: auditEvent.value.ipAddress,
          userAgent: auditEvent.value.userAgent,
          requestId: auditEvent.value.requestId,
          timestamp: auditEvent.value.timestamp ? new Date(auditEvent.value.timestamp) : new Date(),
          service: auditEvent.value.service,
          success: auditEvent.value.success !== false,
          errorMessage: auditEvent.value.errorMessage,
          metadata: auditEvent.value.metadata,
        });

        // console.log(`Audit event logged: ${auditEvent.value.eventType}`);
      } catch (error) {
        console.error(`Error processing audit event from ${topic}:`, error);
      }
    },
  }));

  // Subscribe to all topics at once
  await consumer.subscribe(topicConfigurations);

  console.log(`Subscribed to ${auditTopics.length} audit topics`);
};
