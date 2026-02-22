# Discovery Service Summary

## Overview
The Discovery Service is a Netflix Eureka Server that provides service discovery and registration capabilities for the food delivery microservices architecture. It acts as a central registry where all microservices register themselves and discover other services.

## Key Features
- **Service Registration**: Microservices register themselves with Eureka on startup
- **Service Discovery**: Services can discover and communicate with each other dynamically
- **Health Monitoring**: Eureka monitors the health of registered services
- **Load Balancing**: Works with Spring Cloud LoadBalancer for client-side load balancing

## Technology Stack
- **Spring Cloud Netflix Eureka Server**: Core service discovery framework
- **Spring Boot Actuator**: Health checks and monitoring
- **Micrometer Tracing**: Distributed tracing with OpenTelemetry
- **Logstash**: Structured logging for centralized log management

## Architecture
```
┌─────────────────┐
│  Discovery      │
│   Service       │
│   (Eureka)      │
└────────┬────────┘
         │
         ├── Order Service
         ├── Delivery Service
         ├── Restaurant Service
         ├── Notification Service
         ├── Tracking Service
         └── Gateway Service
```

## Configuration
- Port: 8761 (default Eureka port)
- Self-preservation mode enabled
- Peer awareness for high availability

## Dependencies
- spring-cloud-starter-netflix-eureka-server
- spring-boot-starter-actuator
- micrometer-tracing-bridge-otel
- logstash-logback-encoder

## Integration Points
- All microservices register with this service via `spring-cloud-starter-netflix-eureka-client`
- Gateway Service uses Eureka for routing to backend services
- Services use Eureka client for inter-service communication

## Scalability
- Can be deployed in multiple instances for high availability
- Supports peer-to-peer replication between Eureka servers
- No single point of failure with proper clustering

## Monitoring
- Exposes metrics via Actuator endpoints
- Distributed tracing with OpenTelemetry
- Health checks for all registered services

## Security Considerations
- In production, should be secured with authentication
- Network isolation recommended
- Consider using Spring Security for access control
