# JWT Authentication Flow Diagrams

## 1. Token Generation Flow

```mermaid
sequenceDiagram
    participant Client
    participant AuthService
    participant MongoDB
    participant Redis

    Client->>AuthService: POST /api/auth/login<br/>{email, password}
    AuthService->>MongoDB: Find user by email
    MongoDB-->>AuthService: User document
    AuthService->>AuthService: Verify password (bcrypt)
    
    alt Password Valid
        AuthService->>AuthService: Generate Access Token<br/>jwt.sign({id, role}, JWT_SECRET, {expiresIn: '1d'})
        AuthService->>AuthService: Generate Refresh Token<br/>jwt.sign({id}, JWT_REFRESH_SECRET, {expiresIn: '7d'})
        AuthService->>MongoDB: Save refresh token to user
        MongoDB-->>AuthService: Success
        AuthService-->>Client: 200 OK<br/>{token, refreshToken, user}
    else Password Invalid
        AuthService-->>Client: 401 Unauthorized<br/>{error: 'Invalid credentials'}
    end
```

## 2. Pattern 1: Local Verification (Restaurant Service)

```mermaid
sequenceDiagram
    participant Client
    participant RestaurantService
    participant JWT as JWT Library

    Client->>RestaurantService: GET /api/restaurants<br/>Authorization: Bearer <token>
    RestaurantService->>RestaurantService: Extract token from header
    RestaurantService->>JWT: jwt.verify(token, JWT_SECRET)
    
    alt Token Valid
        JWT-->>RestaurantService: Decoded payload {id, role}
        RestaurantService->>RestaurantService: Attach user to request<br/>req.owner = decoded.id
        RestaurantService->>RestaurantService: Process request
        RestaurantService-->>Client: 200 OK<br/>{restaurants: [...]}
    else Token Invalid
        JWT-->>RestaurantService: JsonWebTokenError
        RestaurantService-->>Client: 403 Forbidden<br/>{error: 'Invalid token'}
    end

    Note over RestaurantService: ⚠️ Issues:<br/>- Cannot detect revoked tokens<br/>- Cannot check user status<br/>- Cannot detect deleted users
```

## 3. Pattern 2: Remote Verification (Admin/Order/Payment/Notification Services)

```mermaid
sequenceDiagram
    participant Client
    participant OrderService
    participant AuthService
    participant MongoDB

    Client->>OrderService: POST /api/orders<br/>Authorization: Bearer <token>
    OrderService->>OrderService: Extract token from header
    OrderService->>AuthService: GET /api/auth/validate-token<br/>Authorization: Bearer <token>
    AuthService->>AuthService: jwt.verify(token, JWT_SECRET)
    
    alt JWT Valid
        AuthService->>MongoDB: Find user by decoded.id
        MongoDB-->>AuthService: User document
        
        alt User Active
            AuthService-->>OrderService: 200 OK<br/>{success: true, user: {...}}
            OrderService->>OrderService: Attach user to request<br/>req.user = user
            OrderService->>OrderService: Process order creation
            OrderService-->>Client: 201 Created<br/>{order: {...}}
        else User Inactive
            AuthService-->>OrderService: 403 Forbidden<br/>{error: 'Account suspended'}
            OrderService-->>Client: 403 Forbidden<br/>{error: 'Account suspended'}
        end
    else JWT Invalid
        AuthService-->>OrderService: 401 Unauthorized<br/>{error: 'Invalid token'}
        OrderService-->>Client: 401 Unauthorized<br/>{error: 'Invalid token'}
    end

    Note over OrderService,AuthService: ✅ Validates user status<br/>✅ Detects deleted users<br/>❌ Network latency<br/>❌ Auth service dependency
```

## 4. Pattern 3: Hybrid with Caching (Recommended)

```mermaid
sequenceDiagram
    participant Client
    participant Service
    participant Redis
    participant AuthService
    participant MongoDB

    Client->>Service: GET /api/resource<br/>Authorization: Bearer <token>
    Service->>Service: Extract token & verify JWT signature locally
    
    alt JWT Signature Valid
        Service->>Redis: GET user:{decoded.id}:status
        
        alt Cache Hit
            Redis-->>Service: {id, role, status: 'active'}
            Service->>Service: Check user status
            alt User Active
                Service->>Service: Process request
                Service-->>Client: 200 OK<br/>{data: [...]}
            else User Inactive
                Service-->>Client: 403 Forbidden<br/>{error: 'Account inactive'}
            end
        else Cache Miss
            Service->>AuthService: GET /api/auth/validate-token<br/>Authorization: Bearer <token>
            AuthService->>MongoDB: Find user by decoded.id
            MongoDB-->>AuthService: User document
            
            alt User Active
                AuthService-->>Service: 200 OK<br/>{success: true, user: {...}}
                Service->>Redis: SETEX user:{id}:status 300 {user}
                Service->>Service: Process request
                Service-->>Client: 200 OK<br/>{data: [...]}
            else User Inactive
                AuthService-->>Service: 403 Forbidden
                Service-->>Client: 403 Forbidden<br/>{error: 'Account inactive'}
            end
        end
    else JWT Signature Invalid
        Service-->>Client: 401 Unauthorized<br/>{error: 'Invalid token'}
    end

    Note over Service,Redis: ✅ Fast (cache hit)<br/>✅ Validates user status<br/>✅ Reduced auth service load<br/>✅ 5-minute cache TTL
```

## 5. Service-to-Service Communication

```mermaid
sequenceDiagram
    participant Client
    participant OrderService
    participant Redis
    participant NotificationService
    participant AuthService

    Client->>OrderService: POST /api/orders<br/>Authorization: Bearer <user_token>
    OrderService->>Redis: Validate token (cached)
    Redis-->>OrderService: User data {id, role, status: 'active'}
    OrderService->>OrderService: Create order in database
    
    Note over OrderService: Order created, now notify user
    
    OrderService->>NotificationService: POST /api/notifications/send<br/>Authorization: Bearer <user_token><br/>{orderId, userId, type: 'order_placed'}
    
    Note over NotificationService: Reuses client's token
    
    NotificationService->>Redis: Validate token (cached)
    
    alt Cache Hit
        Redis-->>NotificationService: User data
        NotificationService->>NotificationService: Send notification (email/SMS)
        NotificationService-->>OrderService: 200 OK
    else Cache Miss
        NotificationService->>AuthService: Validate token
        AuthService-->>NotificationService: User data
        NotificationService->>Redis: Cache user data (TTL: 5min)
        NotificationService->>NotificationService: Send notification
        NotificationService-->>OrderService: 200 OK
    end
    
    OrderService-->>Client: 201 Created<br/>{order: {...}}

    Note over OrderService,NotificationService: Services forward the original<br/>user token for authentication
```

## 6. Token Refresh Flow

```mermaid
sequenceDiagram
    participant Client
    participant Service
    participant AuthService
    participant MongoDB

    Client->>Service: GET /api/protected-resource<br/>Authorization: Bearer <expired_token>
    Service->>Service: Verify token
    Service-->>Client: 401 Unauthorized<br/>{error: 'Token expired'}
    
    Note over Client: Client detects token expiration
    
    Client->>AuthService: POST /api/auth/refresh<br/>{refreshToken: <refresh_token>}
    AuthService->>AuthService: Verify refresh token
    AuthService->>MongoDB: Find user & validate stored refresh token
    MongoDB-->>AuthService: User with matching refresh token
    
    alt Refresh Token Valid
        AuthService->>AuthService: Generate new access token<br/>jwt.sign({id, role}, JWT_SECRET, {expiresIn: '1d'})
        AuthService-->>Client: 200 OK<br/>{token: <new_access_token>}
        
        Note over Client: Client stores new token
        
        Client->>Service: GET /api/protected-resource<br/>Authorization: Bearer <new_token>
        Service->>Service: Verify token
        Service->>Service: Process request
        Service-->>Client: 200 OK<br/>{data: [...]}
    else Refresh Token Invalid/Expired
        AuthService-->>Client: 401 Unauthorized<br/>{error: 'Refresh token expired'}
        Note over Client: Client redirects to login
    end
```

## 7. Token Revocation Flow (Recommended)

```mermaid
sequenceDiagram
    participant Client
    participant Service
    participant AuthService
    participant Redis
    participant MongoDB

    Note over Client: User logs out or account suspended
    
    Client->>AuthService: POST /api/auth/logout<br/>Authorization: Bearer <token>
    AuthService->>AuthService: Decode token to get expiration
    AuthService->>AuthService: Calculate TTL = exp - now
    AuthService->>Redis: SETEX blacklist:{token_hash} {ttl} '1'
    Redis-->>AuthService: OK
    AuthService-->>Client: 200 OK<br/>{message: 'Logged out'}
    
    Note over Client: Later, user tries to use old token
    
    Client->>Service: GET /api/resource<br/>Authorization: Bearer <blacklisted_token>
    Service->>AuthService: GET /api/auth/validate-token<br/>Authorization: Bearer <token>
    AuthService->>AuthService: Verify JWT signature
    AuthService->>Redis: GET blacklist:{token_hash}
    
    alt Token Blacklisted
        Redis-->>AuthService: '1' (blacklisted)
        AuthService-->>Service: 401 Unauthorized<br/>{error: 'Token revoked'}
        Service-->>Client: 401 Unauthorized<br/>{error: 'Token revoked'}
    else Token Not Blacklisted
        Redis-->>AuthService: null
        AuthService->>MongoDB: Validate user
        MongoDB-->>AuthService: User data
        AuthService-->>Service: 200 OK<br/>{user: {...}}
        Service->>Service: Process request
        Service-->>Client: 200 OK<br/>{data: [...]}
    end
```

## 8. Current Architecture Overview

```mermaid
graph TB
    Client[Client Applications<br/>Web/Mobile]
    
    subgraph "Authentication Layer"
        AuthService[Auth Service<br/>Port 5001<br/>- Generate JWT<br/>- Validate JWT<br/>- Manage users]
    end
    
    subgraph "Business Services"
        OrderService[Order Service<br/>Port 5003<br/>Remote Verification]
        PaymentService[Payment Service<br/>Port 5005<br/>Remote Verification]
        RestaurantService[Restaurant Service<br/>Port 5002<br/>⚠️ Local Verification]
        AdminService[Admin Service<br/>Port 5006<br/>Remote Verification]
        NotificationService[Notification Service<br/>Port 5004<br/>Remote Verification]
        FoodServer[Food Delivery Server<br/>Port 5000<br/>Hybrid Verification]
    end
    
    subgraph "Data Layer"
        MongoDB[(MongoDB<br/>User Data)]
        Redis[(Redis<br/>❌ Not Used Yet<br/>Should cache:<br/>- User status<br/>- Token blacklist)]
    end
    
    Client -->|1. Login| AuthService
    AuthService -->|Generate Token| Client
    
    Client -->|2. API Calls<br/>Bearer Token| OrderService
    Client -->|2. API Calls<br/>Bearer Token| PaymentService
    Client -->|2. API Calls<br/>Bearer Token| RestaurantService
    Client -->|2. API Calls<br/>Bearer Token| AdminService
    Client -->|2. API Calls<br/>Bearer Token| NotificationService
    Client -->|2. API Calls<br/>Bearer Token| FoodServer
    
    OrderService -->|3. Validate Token| AuthService
    PaymentService -->|3. Validate Token| AuthService
    AdminService -->|3. Validate Token| AuthService
    NotificationService -->|3. Validate Token| AuthService
    FoodServer -->|3. Validate Token| AuthService
    
    RestaurantService -.->|⚠️ No Validation| AuthService
    
    AuthService --> MongoDB
    
    OrderService -.->|4. Forward Token| NotificationService
    OrderService -.->|4. Forward Token| PaymentService
    
    style RestaurantService fill:#ff6b6b
    style Redis fill:#ffd93d
    style AuthService fill:#6bcf7f
```

## 9. Recommended Future Architecture

```mermaid
graph TB
    Client[Client Applications<br/>Web/Mobile]
    
    subgraph "API Gateway / Istio"
        Gateway[API Gateway<br/>- Rate Limiting<br/>- JWT Validation<br/>- Request Routing]
        RateLimiter[Rate Limiter Service<br/>Port 3000<br/>Redis + PostgreSQL]
    end
    
    subgraph "Authentication Layer"
        AuthService[Auth Service<br/>Port 5001<br/>- Generate JWT<br/>- Validate JWT<br/>- Token Blacklist<br/>- Manage Users]
    end
    
    subgraph "Business Services"
        OrderService[Order Service<br/>✅ Hybrid Verification<br/>✅ Cached]
        PaymentService[Payment Service<br/>✅ Hybrid Verification<br/>✅ Cached]
        RestaurantService[Restaurant Service<br/>✅ Hybrid Verification<br/>✅ Cached]
        AdminService[Admin Service<br/>✅ Hybrid Verification<br/>✅ Cached]
        NotificationService[Notification Service<br/>✅ Hybrid Verification<br/>✅ Cached]
    end
    
    subgraph "Data Layer"
        MongoDB[(MongoDB<br/>User Data<br/>Rate Limit Rules)]
        RedisCache[(Redis Cluster<br/>✅ User Status Cache<br/>✅ Token Blacklist<br/>✅ Token Buckets<br/>TTL: 5 minutes)]
    end
    
    subgraph "Observability"
        Prometheus[Prometheus<br/>Metrics]
        Grafana[Grafana<br/>Dashboards]
        Jaeger[Jaeger<br/>Tracing]
    end
    
    Client -->|1. Login| Gateway
    Gateway -->|Check Rate Limit| RateLimiter
    RateLimiter --> RedisCache
    Gateway --> AuthService
    AuthService -->|JWT Tokens| Client
    
    Client -->|2. API Calls<br/>Bearer Token| Gateway
    Gateway -->|3. Verify JWT| RedisCache
    Gateway -->|Cache Miss| AuthService
    AuthService --> RedisCache
    
    Gateway -->|4. Validated Request| OrderService
    Gateway -->|4. Validated Request| PaymentService
    Gateway -->|4. Validated Request| RestaurantService
    Gateway -->|4. Validated Request| AdminService
    Gateway -->|4. Validated Request| NotificationService
    
    OrderService -->|Critical Ops<br/>Re-verify| AuthService
    PaymentService -->|Critical Ops<br/>Re-verify| AuthService
    
    AuthService --> MongoDB
    OrderService --> RedisCache
    PaymentService --> RedisCache
    RestaurantService --> RedisCache
    
    OrderService --> Prometheus
    AuthService --> Prometheus
    Gateway --> Prometheus
    Prometheus --> Grafana
    
    OrderService --> Jaeger
    AuthService --> Jaeger
    Gateway --> Jaeger
    
    style Gateway fill:#6bcf7f
    style RedisCache fill:#6bcf7f
    style AuthService fill:#6bcf7f
    style OrderService fill:#95e1d3
    style PaymentService fill:#95e1d3
    style RestaurantService fill:#95e1d3
    style AdminService fill:#95e1d3
    style NotificationService fill:#95e1d3
```

## 10. Security Decision Tree

```mermaid
flowchart TD
    Start[Incoming Request] --> HasToken{Has Bearer Token?}
    
    HasToken -->|No| Return401[Return 401 Unauthorized]
    HasToken -->|Yes| VerifySignature[Verify JWT Signature Locally]
    
    VerifySignature --> SignatureValid{Signature Valid?}
    SignatureValid -->|No| Return401
    SignatureValid -->|Yes| CheckCache{Check Redis Cache}
    
    CheckCache -->|Cache Hit| CacheData[Get User Status from Cache]
    CheckCache -->|Cache Miss| CallAuthService[Call Auth Service<br/>/validate-token]
    
    CacheData --> UserActive{User Status<br/>= Active?}
    
    CallAuthService --> AuthResponse{Auth Service<br/>Response}
    AuthResponse -->|Success| CacheUser[Cache User Data<br/>TTL: 5 minutes]
    AuthResponse -->|Error| Return401
    
    CacheUser --> UserActive
    
    UserActive -->|Yes| CriticalOp{Critical<br/>Operation?}
    UserActive -->|No| Return403[Return 403 Forbidden<br/>Account Suspended]
    
    CriticalOp -->|Yes<br/>Payment/Admin| ReVerify[Re-verify with<br/>Auth Service]
    CriticalOp -->|No<br/>Read-only| ProcessRequest[Process Request]
    
    ReVerify --> DoubleCheck{Double Check<br/>Passed?}
    DoubleCheck -->|Yes| ProcessRequest
    DoubleCheck -->|No| Return401
    
    ProcessRequest --> Success[Return 200 OK<br/>with Data]
    
    style Start fill:#e1f5ff
    style Return401 fill:#ff6b6b
    style Return403 fill:#ff922b
    style Success fill:#6bcf7f
    style ProcessRequest fill:#95e1d3
    style CheckCache fill:#ffd93d
```

---

## Legend

- 🟢 **Green**: Recommended/Good practice
- 🟡 **Yellow**: Needs improvement
- 🔴 **Red**: Security issue/Anti-pattern
- ✅ **Checkmark**: Implemented/Working
- ❌ **X**: Not implemented/Broken
- ⚠️ **Warning**: Potential issue

---

## Key Takeaways

1. **Three Verification Patterns** exist in the current system (inconsistent)
2. **Remote Verification** is most secure but slowest
3. **Hybrid with Caching** provides best balance (security + performance)
4. **API Gateway** should handle primary JWT validation
5. **Redis Caching** reduces auth service load by 95%+
6. **Token Blacklist** enables instant revocation
7. **Rate Limiting** prevents abuse of validation endpoints
