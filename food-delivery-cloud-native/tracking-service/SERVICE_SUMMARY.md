# Tracking Service Summary

## Overview
The Tracking Service provides real-time delivery tracking capabilities for the food delivery platform. It consumes delivery status events from Kafka and maintains tracking information that can be queried by customers and merchants.

## Key Features
- **Real-Time Tracking**: Provides up-to-date delivery location and status
- **Event-Driven Architecture**: Consumes delivery status events from Kafka
- **Location Management**: Tracks delivery agent location and route
- **Status Updates**: Maintains delivery status history
- **Service Discovery**: Integrates with Eureka
- **MapStruct**: Efficient entity-DTO mapping

## Technology Stack
- **Spring Boot**: Core framework
- **Spring Data JPA**: Database operations
- **Spring Kafka**: Event consumption
- **Spring Cloud Config**: Centralized configuration
- **Spring Cloud Netflix Eureka**: Service discovery
- **MapStruct**: Type-safe bean mapping
- **PostgreSQL/H2**: Database
- **OpenTelemetry**: Distributed tracing
- **Swagger/OpenAPI**: API documentation

## Architecture
```
┌─────────────────────────────────────────────────────────┐
│                 Tracking Service                          │
├─────────────────────────────────────────────────────────┤
│  Controllers:                                           │
│  - TrackingController (tracking API endpoints)          │
├─────────────────────────────────────────────────────────┤
│  Services:                                               │
│  - TrackingServiceImpl (tracking business logic)          │
├─────────────────────────────────────────────────────────┤
│  Event Handling:                                         │
│  - KafkaConsumer (consumes delivery status events)       │
├─────────────────────────────────────────────────────────┤
│  Data Layer:                                             │
│  - TrackingRepository (JPA)                              │
│  - TrackingMapper (MapStruct)                            │
└─────────────────────────────────────────────────────────┘
```

## Data Models
- **TrackingInfo**: Tracking entity with order ID, location, status, timestamps
- **TrackingInfoDTO**: Data transfer object for API responses

## Tracking Information
- **Order ID**: Reference to the order being tracked
- **Location**: Current location of delivery agent (latitude, longitude)
- **Status**: Current delivery status
- **Updated At**: Timestamp of last update
- **ETA**: Estimated time of arrival

## Event Flow
```
Delivery Service
        ↓
DeliveryStatusUpdatedEvent (Kafka)
        ↓
Tracking Service (Kafka Consumer)
        ↓
Update Tracking Information
        ↓
Store in Database
        ↓
Available for API queries
```

## API Endpoints
- `GET /api/tracking/{orderId}`: Get tracking information for an order
- `POST /api/tracking`: Update tracking information (internal use)

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
- **Delivery Service**: Consumes delivery status update events via Kafka
- **Database**: Persistent tracking storage
- **Config Server**: Centralized configuration

## Scalability
- Stateless service can be horizontally scaled
- Database connection pooling
- Read replicas for tracking queries
- Caching for frequently accessed tracking data

## Monitoring
- Actuator endpoints for health checks
- Distributed tracing with OpenTelemetry
- Structured logging with Logstash
- Kafka consumer metrics
- API response times

## Error Handling
- Global exception handler
- Kafka consumer error handling
- Database transaction management
- Validation errors

## Performance Considerations
- Efficient entity-DTO mapping with MapStruct
- Database indexing on order_id
- Query optimization for latest tracking info
- Connection pooling configuration
- Caching strategies

## Data Retention
- Keeps historical tracking data
- Configurable retention period
- Archival strategy for old tracking data
- Cleanup jobs for expired data

## Privacy and Security
- Location data encryption
- Access control for tracking data
- Data retention policies
- GDPR compliance considerations

## Future Enhancements
- Real-time location updates via WebSocket
- Route visualization on map
- Predictive ETA calculation
- Geofencing for delivery zones
- Multi-stop delivery tracking
- Delivery agent tracking dashboard
- Historical route replay
- Anomaly detection (delays, route deviations)
