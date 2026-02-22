# Config Server Summary

## Overview
The Config Server is a Spring Cloud Config Server that provides centralized configuration management for all microservices in the food delivery platform. It allows services to fetch their configuration from a central location, enabling easier configuration management and updates without redeployment.

## Key Features
- **Centralized Configuration**: Single source of truth for all service configurations
- **Version Control**: Configuration files stored in a Git repository
- **Environment-Specific Configs**: Support for multiple environments (local, docker, production)
- **Dynamic Updates**: Services can refresh configuration without restart
- **Security**: Configuration encryption support
- **Service Discovery**: Integrates with Eureka

## Technology Stack
- **Spring Cloud Config Server**: Core configuration server framework
- **Spring Boot Actuator**: Health checks and monitoring
- **Git**: Configuration storage backend
- **OpenTelemetry**: Distributed tracing
- **Logstash**: Structured logging

## Architecture
```
┌─────────────────────────────────────────────────────────┐
│                Config Server                             │
├─────────────────────────────────────────────────────────┤
│  Configuration Sources:                                  │
│  - Git Repository (config-files directory)               │
├─────────────────────────────────────────────────────────┤
│  Configuration Files:                                    │
│  - application.yml (default config)                     │
│  - {service-name}.yml (service-specific config)         │
│  - {service-name}-{profile}.yml (environment-specific)  │
├─────────────────────────────────────────────────────────┤
│  Clients:                                                │
│  - Order Service                                         │
│  - Delivery Service                                      │
│  - Restaurant Service                                   │
│  - Notification Service                                 │
│  - Tracking Service                                      │
│  - Gateway Service                                       │
└─────────────────────────────────────────────────────────┘
```

## Configuration Structure
```
config-files/
├── application.yml                    # Default configuration
├── gateway-service.yml               # Gateway service config
├── gateway-service-local.yml         # Gateway local environment
├── gateway-service-docker.yml        # Gateway docker environment
├── order-service.yml                 # Order service config
├── order-service-local.yml           # Order local environment
├── order-service-docker.yml          # Order docker environment
├── delivery-service.yml              # Delivery service config
├── delivery-service-local.yml        # Delivery local environment
├── delivery-service-docker.yml       # Delivery docker environment
├── restaurant-service.yml            # Restaurant service config
├── restaurant-service-local.yml      # Restaurant local environment
├── restaurant-service-docker.yml     # Restaurant docker environment
├── notification-service.yml          # Notification service config
├── notification-service-local.yml    # Notification local environment
├── notification-service-docker.yml   # Notification docker environment
└── tracking-service.yml              # Tracking service config
```

## Configuration Properties
Each service's configuration includes:
- **Server Port**: Service port number
- **Database**: JDBC URL, username, password
- **Kafka**: Bootstrap servers, topic names
- **Eureka**: Service discovery URL
- **Logging**: Log levels and patterns
- **Tracing**: OpenTelemetry configuration
- **Service-Specific**: Custom properties per service

## Dependencies
- spring-cloud-config-server
- spring-boot-starter-web
- spring-boot-starter-actuator
- micrometer-tracing-bridge-otel
- logstash-logback-encoder

## Client Integration
Services connect to Config Server using:
1. **spring-cloud-starter-config** dependency
2. **spring-cloud-starter-bootstrap** for bootstrap context
3. **bootstrap.yml** configuration with Config Server URL
4. **spring.application.name** for service identification
5. **spring.profiles.active** for environment selection

## Configuration Refresh
Services can refresh configuration using:
- **POST /actuator/refresh**: Refresh configuration without restart
- **@RefreshScope** annotation: Beans that need to be refreshed
- **Spring Cloud Bus**: Broadcast refresh to all instances

## Security Considerations
- **Encryption**: Sensitive properties can be encrypted
- **Access Control**: Restrict access to configuration endpoints
- **HTTPS**: Use HTTPS for production deployments
- **Authentication**: Implement authentication for Config Server

## Scalability
- Stateless service can be horizontally scaled
- Git backend supports multiple instances
- Caching of configuration files
- Load balancing across multiple Config Server instances

## Monitoring
- Actuator endpoints for health checks
- Distributed tracing with OpenTelemetry
- Structured logging with Logstash
- Configuration change tracking via Git

## Error Handling
- Git repository connection errors
- Configuration file not found errors
- Malformed configuration errors
- Network connectivity issues

## Best Practices
1. **Version Control**: All configuration in Git repository
2. **Environment Separation**: Different configs for different environments
3. **Secrets Management**: Use encryption or external secret management
4. **Documentation**: Document configuration properties
5. **Validation**: Validate configuration on startup
6. **Testing**: Test configuration changes in staging first

## API Endpoints
- `GET /{application}/{profile}[/{label}]`: Get configuration
- `GET /{application}-{profile}.yml`: Get configuration as YAML
- `POST /actuator/refresh`: Refresh configuration (client-side)
- `/encrypt`: Encrypt property value
- `/decrypt`: Decrypt property value

## Configuration Management Workflow
1. Developer updates configuration file in Git
2. Push changes to Git repository
3. Config Server automatically picks up changes
4. Services refresh configuration (manual or automatic)
5. New configuration is applied without restart

## Future Enhancements
- Configuration versioning and rollback
- Configuration validation framework
- Configuration UI dashboard
- Integration with secret management systems (Vault)
- Configuration change notifications
- Configuration drift detection
- Multi-tenancy support
