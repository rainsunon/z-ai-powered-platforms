# Order Service Summary

## Overview
The Order Service is responsible for managing the complete order lifecycle in the food delivery platform. It handles order creation, status management, caching, and event publishing to coordinate with other services.

## Key Features
- **Order Management**: Create and retrieve orders with full lifecycle support
- **Restaurant Integration**: Validates restaurant availability before order creation
- **Redis Caching**: High-performance caching for order data
- **Event Publishing**: Publishes order events to Kafka for async processing
- **JWT Authentication**: Secure API endpoints with JWT token validation
- **Rate Limiting**: Redis-based rate limiting for API protection
- **Feign Client**: REST client for inter-service communication

## Technology Stack
- **Spring Boot**: Core framework
- **Spring Data JPA**: Database operations
- **Spring Security**: Authentication and authorization
- **Spring Kafka**: Event publishing
- **Spring Cloud OpenFeign**: Declarative REST client
- **Redis**: Caching and rate limiting
- **PostgreSQL/H2**: Database
- **JWT**: Token-based authentication
- **OpenTelemetry**: Distributed tracing

## Architecture
```
┌─────────────────────────────────────────────────────────┐
│                    Order Service                         │
├─────────────────────────────────────────────────────────┤
│  Controllers:                                           │
│  - OrderController (order CRUD operations)               │
│  - AuthController (authentication)                       │
├─────────────────────────────────────────────────────────┤
│  Services:                                               │
│  - OrderServiceImpl (business logic)                     │
│  - RedisCacheService (caching)                          │
│  - RedisRateLimiterService (rate limiting)               │
├─────────────────────────────────────────────────────────┤
│  Integrations:                                           │
│  - RestaurantAPIClient (Feign)                           │
│  - OrderEventProducer (Kafka)                            │
│  - OrderRepository (JPA)                                 │
└─────────────────────────────────────────────────────────┘
```

## Order Lifecycle
1. **CREATED**: Order is initially created
2. **CONFIRMED**: Order is confirmed by restaurant
3. **PREPARING**: Restaurant is preparing the order
4. **READY**: Order is ready for pickup
5. **PICKED_UP**: Delivery agent picked up the order
6. **IN_TRANSIT**: Order is being delivered
7. **DELIVERED**: Order is delivered to customer
8. **CANCELLED**: Order is cancelled

## Data Models
- **Order**: Main order entity with customer, restaurant, and status
- **OrderItem**: Individual items in an order with quantity and price
- **OrderRequest**: DTO for order creation
- **OrderItemRequest**: DTO for order item creation

## Caching Strategy
- Redis-based caching for order data
- Cache key pattern: `order:{orderId}`
- Read-through caching pattern
- Improves performance for frequently accessed orders

## Event Publishing
- Publishes `OrderCreatedEvent` to Kafka topic
- Event includes order details, customer info, restaurant info
- Triggers downstream services (delivery, notification)

## Security Features
- JWT-based authentication
- Password hashing with BCrypt
- Role-based access control
- Rate limiting to prevent abuse

## Rate Limiting
- Redis-based distributed rate limiting
- Configurable limits per endpoint
- Prevents API abuse and ensures fair usage

## Dependencies
- spring-boot-starter-web
- spring-boot-starter-data-jpa
- spring-boot-starter-security
- spring-boot-starter-data-redis
- spring-cloud-starter-config
- spring-cloud-starter-openfeign
- spring-kafka
- springdoc-openapi-starter-webmvc-ui
- jjwt-api, jjwt-impl, jjwt-jackson
- postgresql, h2
- lombok

## API Endpoints
- `POST /api/orders`: Create a new order
- `GET /api/orders/{id}`: Get order by ID
- `POST /api/auth/login`: User authentication

## Integration Points
- **Restaurant Service**: Validates restaurant availability via Feign client
- **Kafka**: Publishes order creation events
- **Redis**: Caching and rate limiting
- **Database**: Persistent order storage

## Scalability
- Stateless service can be horizontally scaled
- Redis caching reduces database load
- Event-driven architecture for async processing
- Connection pooling for database

## Monitoring
- Actuator endpoints for health checks
- Distributed tracing with OpenTelemetry
- Structured logging with Logstash
- Performance metrics

## Error Handling
- Global exception handler
- Resource not found exceptions
- Validation errors
- Restaurant availability checks
