import { producer } from "../utils/kafka.js";

interface AuditEventData {
  eventType: string;
  eventCategory: string;
  action: string;
  userId?: string;
  userEmail?: string;
  userRole?: string;
  resourceType?: string;
  resourceId?: string;
  resourceName?: string;
  changes?: {
    before?: any;
    after?: any;
  };
  ipAddress?: string;
  userAgent?: string;
  requestId?: string;
  success?: boolean;
  errorMessage?: string;
  metadata?: Record<string, any>;
}

export const publishAuditEvent = async (
  topic: string,
  data: AuditEventData,
  service: string
) => {
  try {
    const auditEvent = {
      ...data,
      timestamp: new Date().toISOString(),
      service,
      success: data.success !== false,
    };

    await producer.send(topic, { value: auditEvent });
  } catch (error) {
    console.error(`Failed to publish audit event to ${topic}:`, error);
    // Don't throw - audit logging should not break the main flow
  }
};
