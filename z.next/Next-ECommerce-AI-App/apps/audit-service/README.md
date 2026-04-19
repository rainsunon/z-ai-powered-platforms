# Audit Service

Comprehensive audit trail system for tracking all critical actions across the microservices platform.

## Overview

The Audit Service collects, stores, and provides query capabilities for audit logs from all microservices. It enables compliance, security monitoring, debugging, and user activity tracking.

## Features

- **Comprehensive Tracking**: Authentication, data changes, admin actions, payments, orders
- **Flexible Schema**: MongoDB for storing diverse event types
- **Async Collection**: Kafka for non-blocking event publishing
- **Powerful Queries**: Search by user, resource, event type, date range
- **Export**: CSV export for reporting and analysis
- **Automatic Retention**: TTL-based automatic deletion after 90 days (configurable)

## Architecture

```
Services → Kafka Topics → Audit Service → MongoDB
                                ↓
                          Query API ← Admin UI
```

## Setup

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Configure Environment

Copy `.env.example` to `.env`:

```env
PORT=3006
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/audit-service
KAFKA_BROKERS=localhost:9092
AUDIT_RETENTION_DAYS=90
```

### 3. Start Service

```bash
cd apps/audit-service
pnpm dev
```

## Audit Events Tracked

### Authentication (`audit.auth`)
- User login (success/failure)
- User logout
- Password reset
- Token refresh

### Products (`audit.product`)
- Product created
- Product updated
- Product deleted
- Price changed

### Orders (`audit.order`)
- Order created
- Order status changed
- Order cancelled

### Payments (`audit.payment`)
- Payment initiated
- Payment successful
- Payment failed
- Refund processed

### Inventory (`audit.inventory`)
- Stock restocked
- Stock adjusted
- Low stock alert

### Discounts (`audit.discount`)
- Discount created
- Discount updated
- Discount used

### Admin Actions (`audit.admin`)
- User role changed
- Configuration changed
- Bulk operations

### API Calls (`audit.api`)
- All API requests through gateway

## API Endpoints

### Query Logs

```
GET /api/audit/logs
  ?userId=user_123
  &eventType=product.created
  &eventCategory=product
  &resourceType=product
  &resourceId=prod_456
  &startDate=2025-11-01
  &endDate=2025-11-30
  &success=true
  &limit=100
  &offset=0
```

**Response**:
```json
{
  "logs": [...],
  "pagination": {
    "total": 1234,
    "limit": 100,
    "offset": 0,
    "hasMore": true
  }
}
```

### User Activity

```
GET /api/audit/users/:userId/activity
  ?startDate=2025-11-01
  &endDate=2025-11-30
  &limit=100
```

### Resource History

```
GET /api/audit/resources/:resourceType/:resourceId/history
  ?limit=50
```

### Statistics

```
GET /api/audit/stats
  ?groupBy=eventType
  &startDate=2025-11-01
  &endDate=2025-11-30
```

**Response**:
```json
{
  "stats": [
    {
      "_id": "product.created",
      "count": 45,
      "successCount": 43,
      "failureCount": 2
    }
  ],
  "groupBy": "eventType"
}
```

### Export

```
GET /api/audit/export
  ?startDate=2025-11-01
  &endDate=2025-11-30
  &eventType=product.created
  &userId=user_123
```

Returns CSV file with audit logs (max 10,000 records).

## Event Schema

```typescript
{
  // Event Information
  eventType: string;           // 'product.created', 'order.updated'
  eventCategory: string;        // 'product', 'order', 'auth'
  action: string;               // 'create', 'update', 'delete'
  
  // Actor Information
  userId?: string;
  userEmail?: string;
  userRole?: string;
  
  // Target Information
  resourceType?: string;        // 'product', 'order'
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
```

## Publishing Audit Events

### From Services

```typescript
import { publishAuditEvent } from "./utils/audit.js";

await publishAuditEvent(
  "audit.product",
  {
    eventType: "product.created",
    eventCategory: "product",
    action: "create",
    userId: req.user.id,
    userEmail: req.user.email,
    resourceType: "product",
    resourceId: product.id,
    resourceName: product.name,
    changes: {
      after: product
    },
    ipAddress: req.ip,
    userAgent: req.get("user-agent"),
  },
  "product-service"
);
```

### From API Gateway

Automatically logs all API requests via middleware.

## Data Retention

- **Default**: 90 days
- **Configurable**: Set `AUDIT_RETENTION_DAYS` in `.env`
- **Automatic**: MongoDB TTL index handles deletion
- **Archive**: Consider archiving to S3 before deletion

## Performance

- **Write**: Async via Kafka (no blocking)
- **Read**: Indexed queries for fast retrieval
- **Storage**: ~1GB per 1M events
- **Throughput**: 1000+ events/second

## Security

- **Access Control**: Admin-only endpoints
- **Data Protection**: Sensitive data never logged
- **Encryption**: At rest and in transit
- **Compliance**: GDPR, SOX, HIPAA ready

## Monitoring

### Health Check

```bash
GET /health
```

**Response**:
```json
{
  "status": "ok",
  "service": "audit-service",
  "database": "connected",
  "timestamp": "2025-11-29T20:00:00.000Z"
}
```

### Metrics to Track

- Events per second
- Query response times
- Storage usage
- Failed writes

## Troubleshooting

### Service Won't Start

Check MongoDB connection:
```bash
mongosh mongodb://localhost:27017/audit-service
```

### Events Not Being Logged

1. Check Kafka is running
2. Verify topic exists
3. Check service logs
4. Verify event schema

### Slow Queries

1. Check indexes are created
2. Reduce date range
3. Add more specific filters
4. Consider pagination

## Integration Examples

See `apps/inventory-service/src/routes/inventory.route.ts` for example integration.

## Future Enhancements

- Real-time audit feed via WebSockets
- Anomaly detection
- Compliance reports
- Change rollback capability
- Advanced analytics
