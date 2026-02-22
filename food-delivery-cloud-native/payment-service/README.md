# Payment Service

A comprehensive payment processing platform for the food delivery system, implementing a robust 8-step payment flow with high scalability, availability, and fault tolerance.

## Features

- **8-Step Payment Flow**: Complete payment lifecycle from creation to capture
- **Sharding Strategy**: Consistent hashing for even distribution across shards
- **Multiple Storage Layers**: Payment Storage, Merchant Storage, Audit Storage
- **Event-Driven Architecture**: Kafka integration for async processing
- **Webhook Notifications**: Real-time notifications to merchants
- **Retry Mechanism**: Background workers for failed operations
- **High Availability**: Replication strategies based on CAP theorem
- **Distributed Tracing**: OpenTelemetry integration
- **API Documentation**: Swagger/OpenAPI support

## Architecture

The payment service follows a distributed architecture with multiple storage layers optimized for different use cases:

- **Payment Storage**: Sharded by payment_id with consensus-based replication (linearizable consistency)
- **Merchant Storage**: Sharded by merchant_id with leader-follower replication (eventual consistency)
- **Audit Storage**: Sharded by payment_id with leaderless replication (eventual consistency)
- **Retry/Job Storage**: Sharded by job_id with leaderless replication (at least once delivery)

## Quick Start

### Prerequisites

- Java 21+
- Maven 3.6+
- PostgreSQL 14+
- Redis 6+
- Kafka 3.0+
- Config Server
- Eureka Server

### Running Locally

1. **Start Infrastructure Services**:
   ```bash
   docker-compose -f docker-compose.local.infra.yml up -d
   ```

2. **Start Discovery Service**:
   ```bash
   cd discovery-service
   ../mvnw spring-boot:run
   ```

3. **Start Config Server**:
   ```bash
   cd config-server
   ../mvnw spring-boot:run
   ```

4. **Start Payment Service**:
   ```bash
   cd payment-service
   ../mvnw spring-boot:run
   ```

### Running with Docker

1. **Build the Docker image**:
   ```bash
   cd payment-service
   docker build -t payment-service:1.0.0 .
   ```

2. **Run with Docker Compose**:
   ```bash
   docker-compose -f docker-compose.main.yml up -d
   ```

## API Endpoints

### Create Payment
```http
POST /api/payments
Content-Type: application/json

{
  "customerId": 1,
  "merchantId": 1,
  "orderId": 1,
  "amount": 100.00,
  "currency": "USD",
  "description": "Order #12345",
  "merchantWebhookUrl": "https://merchant.example.com/webhook",
  "items": [
    {
      "itemId": "item-1",
      "name": "Pizza",
      "quantity": 2,
      "price": 50.00
    }
  ]
}
```

### Get Payment by ID
```http
GET /api/payments/{paymentId}
```

### Initiate Payment
```http
POST /api/payments/{paymentId}/initiate
Content-Type: application/json

{
  "paymentId": "PAY-ABC123XYZ",
  "encryptedCardData": "encrypted_card_data_here",
  "cardholderName": "John Doe",
  "expiryMonth": "12",
  "expiryYear": "25"
}
```

### Capture Payment
```http
POST /api/payments/{paymentId}/capture
```

### Get Payments by Merchant
```http
GET /api/payments/merchant/{merchantId}
```

### Get Payments by Customer
```http
GET /api/payments/customer/{customerId}
```

## Payment Flow

### Step 1: Payment Details Request
Customer goes to payment details page and sends request to Payment API.

### Step 2: Create Payment Entity
API creates payment with status "new" and stores merchant/goods information.

### Step 3: Initiate Payment
Customer fills in card details and presses "Pay". Client encrypts data and sends with payment ID.

### Step 4: Authorization Request
Payment API sends "Authorization" to Card Network. May include interactive flow (3D Secure).

### Step 5: Save Authorization Result
API saves "auth_id" to database and updates status to "authorized".

### Step 6: Capture Request
Payment API sends "Capture" to Card Network to move authorized money.

### Step 7: Save Captured Status
Server saves "Captured" status to storage.

### Step 8: Merchant Payout (Background)
Batch of payments sent to Merchant's bank via background job.

## Cross-Cutting Operations

Every step includes:
1. **Send event to Merchant's webhook**
2. **Store transaction/event to Audit storage**

## Configuration

### Application Properties

```yaml
server:
  port: 8086

spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/payment_db
    username: payment_user
    password: payment_pass
  kafka:
    bootstrap-servers: localhost:9092
  redis:
    host: localhost
    port: 6379

card:
  network:
    url: http://localhost:8087

eureka:
  client:
    service-url:
      defaultZone: http://discovery-service:8761/eureka/
```

### Kafka Topics

- `payment-created`: Payment creation events
- `payment-authorized`: Authorization success events
- `payment-captured`: Capture success events
- `payment-failed`: Payment failure events

## Payment Status

- **NEW**: Payment created, waiting for initiation
- **AUTHORIZED**: Card authorized, waiting for capture
- **CAPTURED**: Payment successfully captured
- **FAILED**: Payment failed
- **REFUNDED**: Payment refunded
- **CANCELLED**: Payment cancelled

## Sharding Strategy

### Consistent Hashing

The service uses consistent hashing (Rendezvous hashing) for even distribution of payments across shards:

- **Virtual Nodes**: 150 per shard
- **Rebalancing**: Automatic when shards added/removed
- **Benefits**:
  - Even distribution of records
  - Minimizes data movement during rebalancing
  - Handles hot merchants (celebrity problem)

## CAP Theorem Implementation

### Payment Storage (CP)
- **Consistency**: Linearizable (strong consistency)
- **Partition Tolerance**: Yes (Raft consensus)
- **Availability**: High (with proper clustering)
- **Reason**: Cannot lose payment data, need recency

### Merchant Storage (AP)
- **Consistency**: Eventually consistent
- **Partition Tolerance**: Yes
- **Availability**: High
- **Reason**: Dashboard data can be delayed, data loss acceptable

### Audit Storage (AP)
- **Consistency**: Eventually consistent
- **Partition Tolerance**: Yes
- **Availability**: High
- **Reason**: Legal requirements, no concurrency on updates

## Monitoring

### Health Checks

```bash
curl http://localhost:8086/actuator/health
```

### Metrics

```bash
curl http://localhost:8086/actuator/metrics
```

### Prometheus

```bash
curl http://localhost:8086/actuator/prometheus
```

## API Documentation

Swagger UI is available at:
```
http://localhost:8086/swagger-ui.html
```

OpenAPI spec:
```
http://localhost:8086/v3/api-docs
```

## Testing

### Run Tests

```bash
cd payment-service
../mvnw test
```

### Run Integration Tests

```bash
../mvnw verify
```

## Development

### Project Structure

```
payment-service/
├── src/main/java/com/xrs/fooddelivery/payment/
│   ├── controller/          # REST API controllers
│   ├── service/            # Business logic
│   ├── repository/         # Data access layer
│   ├── entity/            # JPA entities
│   ├── dto/               # Data transfer objects
│   ├── config/            # Configuration classes
│   ├── kafka/             # Kafka producers/consumers
│   ├── sharding/          # Sharding logic
│   ├── audit/             # Audit logging
│   ├── merchant/          # Merchant storage sync
│   ├── webhook/           # Webhook service
│   └── exception/         # Exception handling
├── src/main/resources/
│   ├── application.yml    # Application configuration
│   └── bootstrap.yml     # Bootstrap configuration
└── Dockerfile            # Docker image definition
```

## Troubleshooting

### Common Issues

1. **Payment Service not starting**:
   - Check if Config Server is running
   - Check if Eureka Server is running
   - Verify database connection

2. **Payments not being processed**:
   - Check Kafka connection
   - Verify Card Network connectivity
   - Check webhook URL accessibility

3. **High latency**:
   - Check database query performance
   - Verify Redis caching
   - Check network latency to external services

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request

## License

This project is part of the Food Delivery Cloud Native platform.

## Support

For issues and questions, please open an issue in the repository.
