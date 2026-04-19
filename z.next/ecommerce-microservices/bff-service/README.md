# Backend for Frontend (BFF) Service

## Overview

The BFF Service acts as a **Backend for Frontend** facade layer that provides a single entry point for the API Gateway. It aggregates data from multiple microservices and presents optimized, client-friendly APIs.

## Architecture Pattern

This service implements the **BFF (Backend for Frontend)** and **Facade** patterns:

- **Aggregation**: Combines data from multiple microservices into single responses
- **Orchestration**: Coordinates calls to multiple services in parallel
- **Simplification**: Provides simplified APIs tailored for frontend needs
- **Resilience**: Implements circuit breakers and fallback mechanisms

## Features

### 1. Product Catalog Aggregation
- Fetches products with real-time inventory status
- Includes average ratings from rating service
- Provides enriched product details in single API call

### 2. User Profile Aggregation
- Combines user data with recent orders
- Includes favorite products
- Provides complete user profile in one request

### 3. Order Management
- Aggregates order details with product, payment, and shipping info
- Provides comprehensive order history

### 4. Circuit Breaker & Resilience
- Resilience4j circuit breakers for all external service calls
- Fallback mechanisms for graceful degradation
- Timeout management

## Technology Stack

- **Java 21**: Modern Java features (records, pattern matching)
- **Spring Boot 3.5.10**: Latest Spring Boot version
- **Spring Cloud 2025.0.1**: Microservices infrastructure
- **Spring Cloud OpenFeign**: Declarative REST clients
- **Resilience4j**: Circuit breaker and fault tolerance
- **Spring WebFlux**: Reactive programming
- **Eureka Client**: Service discovery
- **Zipkin**: Distributed tracing

## API Endpoints

### Product APIs

```
GET /api/bff/products
GET /api/bff/products/{productId}
GET /api/bff/products/category/{categoryId}
GET /api/bff/products/search?keyword={keyword}
```

### User APIs

```
GET /api/bff/users/{userId}/profile
GET /api/bff/users/profile
```

### Order APIs

```
GET /api/bff/orders
GET /api/bff/orders/{orderId}
```

### Health Check

```
GET /api/bff/health
```

## Configuration

### Application Properties

```yaml
server:
  port: 8090

spring:
  application:
    name: BFF-SERVICE

eureka:
  client:
    serviceUrl:
      defaultZone: http://localhost:8761/eureka
```

### Circuit Breaker Configuration

```yaml
resilience4j:
  circuitbreaker:
    configs:
      default:
        slidingWindowSize: 10
        minimumNumberOfCalls: 5
        failureRateThreshold: 50
        waitDurationInOpenState: 10s
```

### Feign Configuration

```yaml
feign:
  circuitbreaker:
    enabled: true
  client:
    config:
      default:
        connectTimeout: 5000
        readTimeout: 5000
```

## Running the Service

### Prerequisites

- Java 21
- Maven 3.6+
- Eureka Discovery Service running
- Required microservices running (product-service, user-service, order-service, etc.)

### Local Development

```bash
# Build the service
mvn clean install

# Run the service
mvn spring-boot:run

# Or run the JAR
java -jar target/bff-service-0.0.1-SNAPSHOT.jar
```

### Docker

```bash
# Build Docker image
docker build -t bff-service:latest .

# Run container
docker run -p 8090:8090 bff-service:latest
```

## Service Dependencies

The BFF service communicates with the following microservices:

- **Product Service**: Product catalog and categories
- **User Service**: User profile and authentication
- **Order Service**: Orders and shopping carts
- **Inventory Service**: Stock availability
- **Rating Service**: Product ratings and reviews
- **Payment Service**: Payment information
- **Shipping Service**: Shipping details

## Development Guide

### Adding New Aggregation Service

1. Create Feign client interface:
```java
@FeignClient(name = "SERVICE-NAME", fallback = ServiceFallback.class)
public interface ServiceClient {
    @GetMapping("/api/endpoint")
    Mono<Object> getData();
}
```

2. Create fallback implementation:
```java
@Component
public class ServiceFallback implements ServiceClient {
    @Override
    public Mono<Object> getData() {
        return Mono.empty();
    }
}
```

3. Create aggregation service:
```java
@Service
public class AggregationService {
    public Mono<AggregatedDto> aggregate() {
        // Combine multiple service calls
    }
}
```

4. Create controller:
```java
@RestController
@RequestMapping("/api/bff/resource")
public class BffController {
    // Expose aggregated endpoints
}
```

## Monitoring & Observability

### Health Endpoints

```
GET /actuator/health
GET /actuator/info
GET /actuator/metrics
```

### Distributed Tracing

The service is integrated with Zipkin for distributed tracing. All cross-service calls are automatically traced.

### Circuit Breaker Metrics

```
GET /actuator/circuitbreakers
GET /actuator/circuitbreakerevents
```

## API Documentation

Swagger UI is available at:
```
http://localhost:8090/swagger-ui.html
```

OpenAPI specification:
```
http://localhost:8090/api-docs
```

## Security

The BFF service implements:
- JWT token validation (OAuth2 Resource Server)
- Role-based access control
- Secure communication with downstream services

## Performance Considerations

- **Parallel Calls**: Uses reactive programming to make parallel calls to multiple services
- **Caching**: Can be extended with Spring Cache for frequently accessed data
- **Connection Pooling**: Feign clients use connection pooling
- **Timeouts**: Configured timeouts for all external calls

## Future Enhancements

- [ ] Add caching layer (Redis)
- [ ] Implement request/response transformation
- [ ] Add API versioning
- [ ] Implement GraphQL endpoint
- [ ] Add rate limiting
- [ ] Implement BFF-specific DTOs for each client type (mobile, web)
- [ ] Add comprehensive integration tests

## Contributors

This service is part of the E-commerce Microservices platform.

## License

See LICENSE file in the root directory.
