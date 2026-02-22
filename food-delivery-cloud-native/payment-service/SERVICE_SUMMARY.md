# Payment Service Summary

## Overview
The Payment Service is a comprehensive payment processing platform that enables customers to pay for merchant's goods/services. It implements a robust 8-step payment flow with high scalability, availability, and fault tolerance as per the CAP theorem requirements.

## Key Features
- **8-Step Payment Flow**: Complete payment lifecycle from creation to capture
- **Sharding Strategy**: Consistent hashing for even distribution across shards
- **Multiple Storage Layers**: Payment Storage, Merchant Storage, Audit Storage
- **Event-Driven Architecture**: Kafka integration for async processing
- **Webhook Notifications**: Real-time notifications to merchants
- **Retry Mechanism**: Background workers for failed operations
- **High Availability**: Replication strategies based on CAP theorem
- **Distributed Tracing**: OpenTelemetry integration
- **API Documentation**: Swagger/OpenAPI support

## Payment Flow (8 Steps)

### Step 1: Payment Details Request
- Customer goes to payment details page
- Sends request to Payment API

### Step 2: Create Payment Entity
- API creates payment with status "new"
- Stores merchant/goods related information
- Used for deduplication

### Step 3: Initiate Payment
- Customer fills in card details and presses "Pay"
- Client encrypts data and sends with payment ID

### Step 4: Authorization Request
- Payment API sends "Authorization" to Card Network
- May include interactive flow (3D Secure, OTP)
- Similar to OAuth redirection flow

### Step 5: Save Authorization Result
- API saves "auth_id" to database
- Updates status to "authorized"
- auth_id is deduplication mechanism on Card Networks

### Step 6: Capture Request
- Payment API sends "Capture" to Card Network
- Moves authorized money to merchant
- Can be done by background job or same request

### Step 7: Save Captured Status
- Server saves "Captured" status to storage

### Step 8: Merchant Payout (Background)
- Batch of payments sent to Merchant's bank
- Handled by background job

## Cross-Cutting Operations (Every Step)
1. **Send event to Merchant's webhook**
2. **Store transaction/event to Audit storage**

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     Payment Service                            │
├─────────────────────────────────────────────────────────────────┤
│  Controllers:                                                │
│  - PaymentController (REST API endpoints)                      │
├─────────────────────────────────────────────────────────────────┤
│  Services:                                                   │
│  - PaymentServiceImpl (core payment logic)                      │
│  - RetryJobService (background job processing)                  │
│  - AuditService (audit logging)                                │
│  - MerchantSyncService (merchant storage sync)                 │
│  - WebhookService (merchant notifications)                       │
├─────────────────────────────────────────────────────────────────┤
│  Sharding:                                                   │
│  - ShardingService (consistent hashing)                         │
├─────────────────────────────────────────────────────────────────┤
│  Event Handling:                                              │
│  - PaymentEventProducer (Kafka producer)                       │
├─────────────────────────────────────────────────────────────────┤
│  External Integration:                                         │
│  - CardNetworkClient (Feign client)                            │
├─────────────────────────────────────────────────────────────────┤
│  Data Layer:                                                  │
│  - PaymentRepository (JPA)                                    │
│  - AuditLogRepository (JPA)                                  │
│  - MerchantPaymentSummaryRepository (JPA)                       │
│  - RetryJobRepository (JPA)                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Storage Layers

### 1. Payment Storage
- **Sharding Key**: payment_id
- **Replication**: Consensus-based (Raft/Paxos)
- **Consistency**: Linearizable
- **Purpose**: Primary payment data with strong consistency

### 2. Merchant Storage
- **Sharding Key**: merchant_id
- **Replication**: Leader-Follower (async)
- **Consistency**: Eventually consistent
- **Purpose**: Merchant dashboard queries and aggregations
- **Note**: Data loss acceptable for merchant dashboard

### 3. Audit Storage
- **Sharding Key**: payment_id
- **Replication**: Leaderless/Leader-Leader
- **Consistency**: Eventually consistent
- **Purpose**: Legal compliance and audit trail
- **Note**: No concurrency on same PaymentUpdate object

### 4. Retry/Job Storage
- **Sharding Key**: job_id
- **Replication**: Leaderless/Leader-Leader
- **Consistency**: At least once delivery
- **Purpose**: Background job management

## Sharding Strategy

### Consistent Hashing (Rendezvous Hashing)
- **Virtual Nodes**: 150 per shard for even distribution
- **Rebalancing**: Automatic when shards added/removed
- **Benefits**:
  - Even distribution of records
  - Minimizes data movement during rebalancing
  - Handles hot merchants (celebrity problem)

### Sharding by Payment ID
- Prevents hotspots from large merchants
- Even distribution across shards
- Scatter/gather for merchant queries (solved by Merchant Storage)

## CAP Theorem Implementation

### Payment API
- **Strategy**: Stateless
- **Scalability**: Horizontal scaling with load balancers
- **Availability**: High

### Payment Storage
- **Strategy**: Consensus-based replication (Raft/Paxos)
- **Consistency**: Linearizable
- **Availability**: High (with proper clustering)
- **Reason**: Cannot lose payment data, need recency guarantee

### Merchant Storage
- **Strategy**: Leader-Follower async replication
- **Consistency**: Eventually consistent
- **Availability**: High
- **Reason**: Dashboard data can be 1-2 hours delayed
- **Fallback**: Consensus if data loss unacceptable

### Audit Storage
- **Strategy**: Leaderless/Leader-Leader replication
- **Consistency**: Eventually consistent
- **Availability**: High
- **Reason**: Legal requirements, no concurrency on updates

### Payment Events Queue (Kafka)
- **Strategy**: Multiple replicas with quorum
- **Partitioning**: By payment_id for ordering
- **Availability**: High

### Workers/Background Jobs
- **Strategy**: Stateless replication
- **Consistency**: At least once delivery
- **Availability**: High

### Retry/Job Storage
- **Strategy**: Leaderless/Leader-Leader
- **Consistency**: At least once delivery
- **Availability**: High
- **Reason**: Don't need linearizability for background jobs

## Technology Stack
- **Spring Boot**: Core framework
- **Spring Cloud**: Microservices support
- **Spring Data JPA**: Database operations
- **Spring Kafka**: Event streaming
- **Spring Cloud OpenFeign**: REST client
- **PostgreSQL**: Primary database
- **Redis**: Caching and rate limiting
- **Kafka**: Event streaming
- **OpenTelemetry**: Distributed tracing
- **Swagger/OpenAPI**: API documentation

## API Endpoints

### Payment Endpoints
- `POST /api/payments` - Create payment (Step 1-2)
- `GET /api/payments/{paymentId}` - Get payment by ID
- `POST /api/payments/{paymentId}/initiate` - Initiate payment (Step 3-7)
- `POST /api/payments/{paymentId}/capture` - Capture payment (Step 6-7)
- `GET /api/payments/merchant/{merchantId}` - Get payments by merchant
- `GET /api/payments/customer/{customerId}` - Get payments by customer

## Kafka Topics
- `payment-created` - Payment creation events
- `payment-authorized` - Authorization success events
- `payment-captured` - Capture success events
- `payment-failed` - Payment failure events

## Payment Status Enum
- **NEW**: Payment created, waiting for initiation
- **AUTHORIZED**: Card authorized, waiting for capture
- **CAPTURED**: Payment successfully captured
- **FAILED**: Payment failed
- **REFUNDED**: Payment refunded
- **CANCELLED**: Payment cancelled

## Scalability Features

### Horizontal Scaling
- Stateless API layer
- Multiple instances with load balancers
- Multi-region deployment

### Database Sharding
- Consistent hashing for even distribution
- Automatic rebalancing
- Hot merchant isolation

### Event-Driven Architecture
- Async processing with Kafka
- Decoupled services
- Backpressure handling

### Background Workers
- Scheduled job processing
- Exponential backoff for retries
- Job queue management

## High Availability Features

### Replication Strategies
- Consensus-based for critical data
- Async replication for non-critical data
- Leaderless for write-heavy workloads

### Fault Tolerance
- Retry mechanisms with exponential backoff
- Circuit breakers for external services
- Dead letter queues for failed events

### Monitoring
- Health checks via Actuator
- Distributed tracing with OpenTelemetry
- Metrics collection and alerting

## Security Considerations
- Card data encryption
- PCI DSS compliance
- Secure webhook communication
- API rate limiting
- Authentication and authorization

## Performance Optimizations
- Connection pooling
- Database indexing
- Caching strategies
- Batch processing
- Async operations

## Future Enhancements
- Multi-currency support
- International payments
- Subscription billing
- Payment analytics
- Fraud detection
- Multi-tenant support
