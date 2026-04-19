import mongoose, { Schema, Document } from "mongoose";

export interface IAuditLog extends Document {
  // Event Information
  eventType: string;
  eventCategory: string;
  action: string;

  // Actor Information
  userId?: string;
  userEmail?: string;
  userRole?: string;

  // Target Information
  resourceType?: string;
  resourceId?: string;
  resourceName?: string;

  // Change Details
  changes?: {
    before?: any;
    after?: any;
  };

  // Request Context
  ipAddress?: string;
  userAgent?: string;
  requestId?: string;

  // Metadata
  timestamp: Date;
  service: string;
  success: boolean;
  errorMessage?: string;
  metadata?: Record<string, any>;
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    // Event Information
    eventType: { type: String, required: true, index: true },
    eventCategory: { type: String, required: true, index: true },
    action: { type: String, required: true },

    // Actor Information
    userId: { type: String, index: true },
    userEmail: { type: String },
    userRole: { type: String },

    // Target Information
    resourceType: { type: String, index: true },
    resourceId: { type: String, index: true },
    resourceName: { type: String },

    // Change Details
    changes: {
      before: { type: Schema.Types.Mixed },
      after: { type: Schema.Types.Mixed },
    },

    // Request Context
    ipAddress: { type: String },
    userAgent: { type: String },
    requestId: { type: String },

    // Metadata
    timestamp: { type: Date, required: true, index: true },
    service: { type: String, required: true },
    success: { type: Boolean, required: true, default: true },
    errorMessage: { type: String },
    metadata: { type: Schema.Types.Mixed },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for common queries
AuditLogSchema.index({ userId: 1, timestamp: -1 });
AuditLogSchema.index({ resourceType: 1, resourceId: 1, timestamp: -1 });
AuditLogSchema.index({ eventType: 1, timestamp: -1 });
AuditLogSchema.index({ eventCategory: 1, timestamp: -1 });

// TTL index for automatic deletion after retention period
// This will be set based on AUDIT_RETENTION_DAYS env variable
const retentionDays = parseInt(process.env.AUDIT_RETENTION_DAYS || "90");
AuditLogSchema.index(
  { timestamp: 1 },
  { expireAfterSeconds: retentionDays * 24 * 60 * 60 }
);

export const AuditLog = mongoose.model<IAuditLog>("AuditLog", AuditLogSchema);
