# Notification Service Summary

## Overview
The Notification Service is responsible for sending notifications to customers and merchants throughout the food delivery process. It consumes events from Kafka and triggers appropriate notifications via email, SMS, push notifications, or other channels.

## Key Features
- **Event-Driven Architecture**: Consumes events from Kafka topics
- **Multi-Channel Notifications**: Supports email, SMS, and push notifications
- **Order Notifications**: Notifies customers when orders are created
- **Delivery Notifications**: Notifies customers when delivery status changes
- **Service Discovery**: Integrates with Eureka
- **Configuration Management**: Fetches configuration from Config Server

## Technology Stack
- **Spring Boot**: Core framework
- **Spring Kafka**: Event consumption
- **Spring Cloud Config**: Centralized configuration
- **Spring Cloud Netflix Eureka**: Service discovery
- **OpenTelemetry**: Distributed tracing
- **Logstash**: Structured logging

## Architecture
```
┌─────────────────────────────────────────────────────────┐
│               Notification Service                        │
├─────────────────────────────────────────────────────────┤
│  Event Consumers:                                        │
│  - NotificationConsumer (consumes Kafka events)           │
├─────────────────────────────────────────────────────────┤
│  Notification Channels:                                  │
│  - Email Service (SMTP integration)                      │
│  - SMS Service (Twilio/SNS integration)                  │
│  - Push Notification Service (FCM/APNS)                  │
├─────────────────────────────────────────────────────────┤
│  Configuration:                                          │
│  - KafkaConsumerConfig (Kafka consumer settings)         │
└─────────────────────────────────────────────────────────┘
```

## Event Flow
```
Order Service
        ↓
OrderCreatedEvent (Kafka)
        ↓
Notification Service
        ↓
Send Order Confirmation Notification
        ↓
Customer receives notification

Delivery Service
        ↓
DeliveryStatusUpdatedEvent (Kafka)
        ↓
Notification Service
        ↓
Send Delivery Status Notification
        ↓
Customer receives notification
```

## Notification Types

### Order Notifications
- **Order Created**: Confirms order placement to customer
- **Order Confirmed**: Notifies when restaurant confirms order
- **Order Preparing**: Notifies when restaurant starts preparing
- **Order Ready**: Notifies when order is ready for pickup

### Delivery Notifications
- **Delivery Assigned**: Notifies when delivery agent is assigned
- **Picked Up**: Notifies when agent picks up order
- **In Transit**: Notifies when order is being delivered
- **Delivered**: Notifies when order is delivered
- **Delivery Issues**: Notifies of any delivery problems

## Kafka Topics Consumed
- `order-created`: Order creation events
- `delivery-status-updated`: Delivery status update events

## Dependencies
- spring-cloud-starter-config
- spring-cloud-starter-bootstrap
- spring-cloud-starter-netflix-eureka-client
- spring-kafka
- lombok
- common module

## Integration Points
- **Order Service**: Consumes order creation events
- **Delivery Service**: Consumes delivery status update events
- **Kafka**: Event streaming platform
- **External Services**: Email, SMS, and push notification providers

## Scalability
- Stateless service can be horizontally scaled
- Kafka consumer groups for parallel processing
- Asynchronous notification processing
- Queue-based notification delivery

## Monitoring
- Actuator endpoints for health checks
- Distributed tracing with OpenTelemetry
- Structured logging with Logstash
- Kafka consumer metrics
- Notification delivery metrics

## Error Handling
- Kafka consumer error handling
- Retry logic for failed notifications
- Dead letter queue for failed events
- Notification provider error handling

## Performance Considerations
- Batch processing for notifications
- Connection pooling for external services
- Asynchronous notification sending
- Rate limiting for external APIs

## Security Considerations
- API key management for external services
- PII protection in notifications
- Secure communication channels
- Notification content sanitization

## Configuration
- Kafka consumer settings
- Notification provider credentials
- Notification templates
- Retry policies
- Rate limiting settings

## Future Enhancements
- Notification preferences management
- Multi-language support
- Rich notifications (images, buttons)
- Notification scheduling
- A/B testing for notifications
- Notification analytics and reporting
- Webhook support for custom notifications
- In-app notification center
