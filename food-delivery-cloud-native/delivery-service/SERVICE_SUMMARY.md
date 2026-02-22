# Delivery Service Summary

## Overview
The Delivery Service manages the delivery lifecycle for food orders in the platform. It handles delivery assignment, status updates, and publishes events to coordinate with other services like tracking and notification.

## Key Features
- **Delivery Management**: Create and manage delivery records
- **Order Integration**: Consumes order creation events from Kafka
- **Status Tracking**: Updates delivery status throughout the lifecycle
- **Event Publishing**: Publishes delivery status events to Kafka
- **MapStruct**: Efficient entity-DTO mapping
- **Service Discovery**: Integrates with Eureka

## Technology Stack
- **Spring Boot**: Core framework
- **Spring Data JPA**: Database operations
- **Spring Kafka**: Event consumption and publishing
- **Spring Cloud Config**: Centralized configuration
- **Spring Cloud Netflix Eureka**: Service discovery
- **MapStruct**: Type-safe bean mapping
- **PostgreSQL/H2**: Database
- **OpenTelemetry**: Distributed tracing
- **Swagger/OpenAPI**: API documentation

## Architecture
```
┌─────────────────────────────────────────────────────────┐
│                  Delivery Service                        │
├─────────────────────────────────────────────────────────┤
│  Controllers:                                           │
│  - DeliveryController (delivery CRUD operations)          │
├─────────────────────────────────────────────────────────┤
│  Services:                                               │
│  - DeliveryServiceImpl (business logic)                  │
├─────────────────────────────────────────────────────────┤
│  Event Handling:                                         │
│  - KafkaConsumer (consumes order events)                 │
│  - DeliveryEventProducer (publishes delivery events)    │
├─────────────────────────────────────────────────────────┤
│  Data Layer:                                             │
│  - DeliveryRepository (JPA)                              │
│  - DeliveryMapper (MapStruct)                            │
└─────────────────────────────────────────────────────────┘
```

## Delivery Lifecycle
1. **ASSIGNED**: Delivery agent is assigned to the order
2. **PICKED_UP**: Agent picks up the order from restaurant
3. **IN_TRANSIT**: Order is being delivered to customer
4. **DELIVERED**: Order is successfully delivered
5. **CANCELLED**: Delivery is cancelled

## Data Models
- **Delivery**: Main delivery entity with order ID, agent ID, and status
- **DeliveryDTO**: Data transfer object for API responses
- **DeliveryStatusUpdate**: DTO for status update requests

## Event Flow
```
Order Service (Kafka)
        ↓
OrderCreatedEvent
        ↓
Delivery Service (Kafka Consumer)
        ↓
Create Delivery Record
        ↓
DeliveryStatusUpdatedEvent (Kafka Producer)
        ↓
Notification Service & Tracking Service
```

## Kafka Integration
- **Consumes**: `order-created` topic
  - Creates delivery record when order is created
- **Produces**: `delivery-status-updated` topic
  - Publishes delivery status changes
  - Triggers notifications and tracking updates

## API Endpoints
- `GET /api/deliveries`: Get all deliveries
- `GET /api/deliveries/{id}`: Get delivery by ID
- `PUT /api/deliveries/{id}/status`: Update delivery status

## Dependencies
- spring-boot-starter-web
- spring-boot-starter-data-jpa
- spring-cloud-starter-config
- spring-cloud-starter-bootstrap
- spring-cloud-starter-netflix-eureka-client
- spring-kafka
- springdoc-openapi-starter-webmvc-ui
- postgresql, h2
- mapstruct, mapstruct-processor
- lombok
- common module

## Integration Points
- **Order Service**: Consumes order creation events via Kafka
- **Notification Service**: Publishes delivery status events
- **Tracking Service**: Publishes delivery status events for tracking
- **Database**: Persistent delivery storage

## Scalability
- Stateless service can be horizontally scaled
- Event-driven architecture for async processing
- Kafka consumer groups for parallel processing
- Connection pooling for database

## Monitoring
- Actuator endpoints for health checks
- Distributed tracing with OpenTelemetry
- Structured logging with Logstash
- Kafka consumer metrics

## Error Handling
- Global exception handler
- Resource not found exceptions
- Kafka consumer error handling
- Database transaction management

## Performance Considerations
- Efficient entity-DTO mapping with MapStruct
- Batch processing for Kafka events
- Database indexing on order_id
- Connection pooling configuration

## Future Enhancements
- Real-time delivery agent tracking
- Route optimization
- Delivery time estimation
- Agent assignment algorithms
- Multi-stop deliveries
