# Common Service Summary

## Overview
The Common Service is a shared library module that provides common data transfer objects (DTOs), enums, exceptions, and utilities used across all microservices in the food delivery platform. It promotes code reuse and consistency across the system.

## Key Features
- **Shared DTOs**: Common data transfer objects for inter-service communication
- **Shared Enums**: Common enumerations for status types and constants
- **Shared Exceptions**: Common exception classes for error handling
- **Utilities**: Common utility functions and helpers
- **Type Safety**: Strong typing for shared data structures

## Technology Stack
- **Spring Boot**: Core framework
- **Lombok**: Code generation for getters, setters, and constructors
- **Jackson**: JSON serialization/deserialization

## Architecture
```
┌─────────────────────────────────────────────────────────┐
│                   Common Module                          │
├─────────────────────────────────────────────────────────┤
│  DTOs:                                                   │
│  - RestaurantDTO (restaurant information)                │
│  - OrderItem (order item details)                        │
├─────────────────────────────────────────────────────────┤
│  Enums:                                                  │
│  - OrderStatus (order lifecycle states)                  │
│  - DeliveryStatus (delivery lifecycle states)             │
├─────────────────────────────────────────────────────────┤
│  Kafka Events:                                           │
│  - OrderCreatedEvent (order creation event)               │
│  - DeliveryStatusUpdatedEvent (delivery status event)    │
│  - MenuUpdatedEvent (menu update event)                  │
│  - RestaurantAvailabilityEvent (availability event)      │
├─────────────────────────────────────────────────────────┤
│  Exceptions:                                             │
│  - ResourceNotFoundException (404 errors)                │
├─────────────────────────────────────────────────────────┤
│  Global Exception Handler:                               │
│  - GlobalExceptionHandler (centralized error handling)    │
└─────────────────────────────────────────────────────────┘
```

## Data Transfer Objects (DTOs)

### RestaurantDTO
- **id**: Restaurant identifier
- **name**: Restaurant name
- **address**: Restaurant address
- **city**: Restaurant city
- **active**: Active status flag
- **menuItems**: List of menu items

### OrderItem
- **menuItem**: Menu item identifier
- **quantity**: Item quantity

## Enums

### OrderStatus
- **CREATED**: Order is initially created
- **CONFIRMED**: Order is confirmed by restaurant
- **PREPARING**: Restaurant is preparing the order
- **READY**: Order is ready for pickup
- **PICKED_UP**: Delivery agent picked up the order
- **IN_TRANSIT**: Order is being delivered
- **DELIVERED**: Order is delivered to customer
- **CANCELLED**: Order is cancelled

### DeliveryStatus
- **ASSIGNED**: Delivery agent is assigned
- **PICKED_UP**: Agent picked up the order
- **IN_TRANSIT**: Order is being delivered
- **DELIVERED**: Order is delivered
- **CANCELLED**: Delivery is cancelled

## Kafka Events

### OrderCreatedEvent
- **orderId**: Order identifier
- **customerId**: Customer identifier
- **restaurantId**: Restaurant identifier
- **totalPrice**: Order total amount
- **items**: List of order items

### DeliveryStatusUpdatedEvent
- **orderId**: Order identifier
- **status**: Delivery status
- **timestamp**: Event timestamp

### MenuUpdatedEvent
- **restaurantId**: Restaurant identifier
- **menuItems**: List of menu items

### RestaurantAvailabilityEvent
- **restaurantId**: Restaurant identifier
- **available**: Availability status

## Exceptions

### ResourceNotFoundException
- Thrown when a requested resource is not found
- Includes resource identifier in error message
- Maps to HTTP 404 status code

## Global Exception Handler

### GlobalExceptionHandler
- Centralized exception handling for all services
- Consistent error response format
- Handles common exceptions:
  - ResourceNotFoundException
  - Validation errors
  - Generic exceptions

## Dependencies
- spring-boot-starter-web
- lombok

## Usage Across Services

### Services Using Common Module
- **Order Service**: Uses RestaurantDTO, OrderItem, OrderStatus, OrderCreatedEvent
- **Delivery Service**: Uses DeliveryStatus, OrderCreatedEvent, DeliveryStatusUpdatedEvent
- **Restaurant Service**: Uses RestaurantDTO, MenuUpdatedEvent, RestaurantAvailabilityEvent
- **Notification Service**: Uses OrderCreatedEvent, DeliveryStatusUpdatedEvent
- **Tracking Service**: Uses DeliveryStatusUpdatedEvent
- **Common**: Provides all shared components

## Benefits
1. **Code Reuse**: Eliminates duplicate code across services
2. **Consistency**: Ensures consistent data structures
3. **Type Safety**: Compile-time type checking
4. **Maintainability**: Single source of truth for shared types
5. **Versioning**: Easy to update shared types across all services

## Best Practices
1. **Versioning**: Use semantic versioning for the common module
2. **Documentation**: Document all DTOs and events
3. **Validation**: Add validation annotations to DTOs
4. **Serialization**: Ensure proper JSON serialization
5. **Backward Compatibility**: Maintain backward compatibility when possible

## Integration
- Added as a Maven dependency in service pom.xml files
- Shared via Maven repository or local installation
- Services import classes from `com.xrs.fooddelivery.common.*`

## Future Enhancements
- **Validation Framework**: Common validation utilities
- **Pagination**: Common pagination DTOs
- **Filtering**: Common filter and search DTOs
- **Auditing**: Common audit fields (created_at, updated_at)
- **Constants**: Common constants and configuration
- **Mappers**: Common mapping utilities
- **Converters**: Common type converters
- **Utilities**: Common helper functions
