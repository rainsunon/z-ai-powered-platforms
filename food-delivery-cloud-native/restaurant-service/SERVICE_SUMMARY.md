# Restaurant Service Summary

## Overview
The Restaurant Service manages restaurant and menu information for the food delivery platform. It handles restaurant registration, menu management, search functionality, and publishes menu update events to Kafka.

## Key Features
- **Restaurant Management**: CRUD operations for restaurants
- **Menu Management**: Manage menu items for restaurants
- **Search Functionality**: Search restaurants by city and menu items
- **Event Publishing**: Publishes menu update events to Kafka
- **MapStruct**: Efficient entity-DTO mapping
- **Service Discovery**: Integrates with Eureka

## Technology Stack
- **Spring Boot**: Core framework
- **Spring Data JPA**: Database operations
- **Spring Kafka**: Event publishing
- **Spring Cloud Config**: Centralized configuration
- **Spring Cloud Netflix Eureka**: Service discovery
- **MapStruct**: Type-safe bean mapping
- **PostgreSQL/H2**: Database
- **OpenTelemetry**: Distributed tracing
- **Swagger/OpenAPI**: API documentation

## Architecture
```
┌─────────────────────────────────────────────────────────┐
│                Restaurant Service                         │
├─────────────────────────────────────────────────────────┤
│  Controllers:                                           │
│  - RestaurantController (restaurant CRUD operations)    │
│  - MenuItemController (menu item CRUD operations)       │
├─────────────────────────────────────────────────────────┤
│  Services:                                               │
│  - RestaurantServiceImpl (restaurant business logic)     │
│  - MenuItemServiceImpl (menu item business logic)        │
├─────────────────────────────────────────────────────────┤
│  Event Publishing:                                        │
│  - KafkaProducer (publishes menu update events)          │
├─────────────────────────────────────────────────────────┤
│  Data Layer:                                             │
│  - RestaurantRepository (JPA)                            │
│  - MenuItemRepository (JPA)                              │
│  - RestaurantMapper (MapStruct)                         │
│  - MenuItemMapper (MapStruct)                            │
└─────────────────────────────────────────────────────────┘
```

## Data Models
- **Restaurant**: Restaurant entity with name, address, city, active status
- **MenuItem**: Menu item entity with name, description, price, restaurant reference
- **RestaurantDTO**: Data transfer object for restaurant API
- **MenuItemDTO**: Data transfer object for menu item API

## Restaurant Features
- Create, read, update, delete restaurants
- Toggle restaurant active status
- Search restaurants by city
- Search restaurants by menu items
- Combined search by city and menu items

## Menu Features
- Create, read, update, delete menu items
- Menu items are linked to restaurants
- Price and description management
- Menu update events published to Kafka

## API Endpoints
### Restaurant Endpoints
- `POST /api/restaurants`: Create a new restaurant
- `GET /api/restaurants`: Get all restaurants
- `GET /api/restaurants/{id}`: Get restaurant by ID
- `PUT /api/restaurants/{id}`: Update restaurant
- `DELETE /api/restaurants/{id}`: Delete restaurant
- `GET /api/restaurants/search`: Search restaurants by city and menu item

### Menu Item Endpoints
- `POST /api/restaurants/{restaurantId}/menu-items`: Create menu item
- `GET /api/restaurants/{restaurantId}/menu-items`: Get all menu items for restaurant
- `GET /api/menu-items/{id}`: Get menu item by ID
- `PUT /api/menu-items/{id}`: Update menu item
- `DELETE /api/menu-items/{id}`: Delete menu item

## Event Publishing
- Publishes `MenuUpdatedEvent` to Kafka topic
- Events are triggered when menu items are created, updated, or deleted
- Enables other services to react to menu changes

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
- **Order Service**: Provides restaurant information via Feign client
- **Kafka**: Publishes menu update events
- **Database**: Persistent restaurant and menu storage
- **Config Server**: Centralized configuration

## Scalability
- Stateless service can be horizontally scaled
- Database connection pooling
- Read replicas for search queries
- Caching for frequently accessed restaurants

## Monitoring
- Actuator endpoints for health checks
- Distributed tracing with OpenTelemetry
- Structured logging with Logstash
- API metrics via Swagger

## Error Handling
- Global exception handler
- Resource not found exceptions
- Validation errors
- Database transaction management

## Performance Considerations
- Efficient entity-DTO mapping with MapStruct
- Database indexing on city and restaurant_id
- Query optimization for search operations
- Connection pooling configuration

## Search Optimization
- Database indexes on city and menu item fields
- Full-text search capabilities
- Pagination for large result sets
- Caching of popular search queries

## Future Enhancements
- Restaurant ratings and reviews
- Advanced search filters (cuisine type, price range)
- Restaurant photos and galleries
- Operating hours management
- Special offers and promotions
- Geospatial search for nearby restaurants
