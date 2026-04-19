# Architecture Diagrams

Visual representations of the microservices e-commerce platform architecture.

---

## System Architecture Overview

```mermaid
graph TB
    subgraph "Client Layer"
        Client[Client App<br/>Next.js - Port 3002]
        Admin[Admin App<br/>Next.js - Port 3003]
    end
    
    subgraph "API Gateway Layer (Future)"
        Gateway[API Gateway<br/>Optional]
    end
    
    subgraph "Microservices Layer"
        Auth[Auth Service<br/>Express - Port 8003]
        Product[Product Service<br/>Express - Port 8000]
        Order[Order Service<br/>Fastify - Port 8001]
        Payment[Payment Service<br/>Hono - Port 8002]
    end
    
    subgraph "Event Processing Layer"
        Email[Email Service<br/>Kafka Consumer]
    end
    
    subgraph "Message Broker"
        Kafka[Redpanda Cluster<br/>3 Nodes]
        KafkaUI[Kafka UI<br/>Port 8080]
    end
    
    subgraph "Data Layer"
        PostgreSQL[(PostgreSQL<br/>Products DB)]
        MongoDB[(MongoDB<br/>Orders DB)]
    end
    
    subgraph "External Services"
        Clerk[Clerk<br/>Authentication]
        Stripe[Stripe<br/>Payments]
        SMTP[SMTP Server<br/>Email Delivery]
    end
    
    Client --> Auth
    Client --> Product
    Client --> Order
    Client --> Payment
    
    Admin --> Auth
    Admin --> Product
    Admin --> Order
    
    Auth --> Clerk
    Auth --> Kafka
    
    Product --> PostgreSQL
    Product --> Clerk
    Product --> Kafka
    
    Order --> MongoDB
    Order --> Clerk
    Order --> Kafka
    
    Payment --> Stripe
    Payment --> Clerk
    Payment --> Kafka
    
    Kafka --> Email
    Email --> SMTP
    
    Kafka --> KafkaUI
    
    style Client fill:#e1f5ff
    style Admin fill:#e1f5ff
    style Auth fill:#fff4e6
    style Product fill:#fff4e6
    style Order fill:#fff4e6
    style Payment fill:#fff4e6
    style Email fill:#f3e5f5
    style Kafka fill:#e8f5e9
    style PostgreSQL fill:#fce4ec
    style MongoDB fill:#fce4ec
```

---

## Data Flow: User Registration

```mermaid
sequenceDiagram
    participant U as User
    participant C as Client App
    participant CL as Clerk
    participant A as Auth Service
    participant K as Kafka
    participant E as Email Service
    participant S as SMTP
    
    U->>C: Sign Up
    C->>CL: Create User
    CL-->>C: User Created
    C->>A: POST /users
    A->>CL: Verify Token
    CL-->>A: Token Valid
    A->>K: Publish user.created
    A-->>C: Success Response
    C-->>U: Registration Complete
    
    K->>E: Consume user.created
    E->>S: Send Welcome Email
    S-->>U: Welcome Email Delivered
```

---

## Data Flow: Product Purchase

```mermaid
sequenceDiagram
    participant U as User
    participant C as Client App
    participant PS as Product Service
    participant PY as Payment Service
    participant ST as Stripe
    participant K as Kafka
    participant OS as Order Service
    participant E as Email Service
    
    U->>C: Browse Products
    C->>PS: GET /products
    PS-->>C: Product List
    
    U->>C: Add to Cart & Checkout
    C->>PY: POST /sessions/create-checkout-session
    PY->>ST: Create Checkout Session
    ST-->>PY: Session ID & URL
    PY-->>C: Checkout URL
    
    C->>U: Redirect to Stripe
    U->>ST: Complete Payment
    
    ST->>PY: Webhook: checkout.session.completed
    PY->>K: Publish payment.success
    PY-->>ST: Webhook Received
    
    K->>OS: Consume payment.success
    OS->>OS: Create Order Record
    OS->>K: Publish order.created
    OS-->>K: Order Saved
    
    K->>E: Consume order.created
    E->>U: Send Order Confirmation Email
```

---

## Service Communication Patterns

```mermaid
graph LR
    subgraph "Synchronous (HTTP/REST)"
        C1[Client] -->|REST API| S1[Services]
        A1[Admin] -->|REST API| S1
    end
    
    subgraph "Asynchronous (Event-Driven)"
        S2[Auth Service] -->|user.created| K[Kafka]
        S3[Payment Service] -->|payment.success| K
        S4[Order Service] -->|order.created| K
        K -->|Events| S5[Email Service]
        K -->|Events| S4
    end
    
    style C1 fill:#e1f5ff
    style A1 fill:#e1f5ff
    style K fill:#e8f5e9
```

---

## Database Architecture

```mermaid
graph TB
    subgraph "Product Service"
        PS[Product Service]
    end
    
    subgraph "Order Service"
        OS[Order Service]
    end
    
    subgraph "PostgreSQL - Product Database"
        PT[Products Table]
        CT[Categories Table]
        PT -.->|Foreign Key| CT
    end
    
    subgraph "MongoDB - Order Database"
        OC[Orders Collection]
    end
    
    PS --> PT
    PS --> CT
    OS --> OC
    
    style PS fill:#fff4e6
    style OS fill:#fff4e6
    style PT fill:#fce4ec
    style CT fill:#fce4ec
    style OC fill:#fce4ec
```

---

## Monorepo Structure

```mermaid
graph TB
    Root[microservices-ecommerce-main]
    
    Root --> Apps[apps/]
    Root --> Packages[packages/]
    Root --> Config[Configuration Files]
    
    Apps --> Client[client/]
    Apps --> Admin[admin/]
    Apps --> Auth[auth-service/]
    Apps --> Product[product-service/]
    Apps --> Order[order-service/]
    Apps --> Payment[payment-service/]
    Apps --> Email[email-service/]
    
    Packages --> Kafka[kafka/]
    Packages --> ProductDB[product-db/]
    Packages --> OrderDB[order-db/]
    Packages --> Types[types/]
    Packages --> ESLint[eslint-config/]
    Packages --> TSConfig[typescript-config/]
    
    Config --> Turbo[turbo.json]
    Config --> PNPM[pnpm-workspace.yaml]
    Config --> Package[package.json]
    
    style Root fill:#e1f5ff
    style Apps fill:#fff4e6
    style Packages fill:#f3e5f5
    style Config fill:#e8f5e9
```

---

## Deployment Architecture (Future)

```mermaid
graph TB
    subgraph "Load Balancer"
        LB[Nginx/ALB]
    end
    
    subgraph "Container Orchestration - Kubernetes"
        subgraph "Frontend Pods"
            C1[Client Pod 1]
            C2[Client Pod 2]
            A1[Admin Pod 1]
        end
        
        subgraph "Service Pods"
            AS1[Auth Service Pod 1]
            AS2[Auth Service Pod 2]
            PS1[Product Service Pod 1]
            PS2[Product Service Pod 2]
            OS1[Order Service Pod 1]
            PY1[Payment Service Pod 1]
            ES1[Email Service Pod 1]
        end
        
        subgraph "Message Broker"
            K1[Kafka Pod 1]
            K2[Kafka Pod 2]
            K3[Kafka Pod 3]
        end
    end
    
    subgraph "Managed Services"
        RDS[(RDS PostgreSQL)]
        Atlas[(MongoDB Atlas)]
        Clerk[Clerk Auth]
        Stripe[Stripe Payments]
    end
    
    LB --> C1
    LB --> C2
    LB --> A1
    
    C1 --> AS1
    C1 --> PS1
    C1 --> OS1
    C1 --> PY1
    
    AS1 --> K1
    PS1 --> K1
    OS1 --> K1
    PY1 --> K1
    
    K1 --> ES1
    
    PS1 --> RDS
    OS1 --> Atlas
    
    AS1 --> Clerk
    PY1 --> Stripe
    
    style LB fill:#e1f5ff
    style RDS fill:#fce4ec
    style Atlas fill:#fce4ec
```

---

## Kafka Topic Flow

```mermaid
graph LR
    subgraph "Producers"
        Auth[Auth Service]
        Payment[Payment Service]
        Order[Order Service]
    end
    
    subgraph "Kafka Topics"
        T1[user.created]
        T2[payment.success]
        T3[order.created]
    end
    
    subgraph "Consumers"
        Email[Email Service]
        OrderC[Order Service]
    end
    
    Auth -->|Publish| T1
    Payment -->|Publish| T2
    Order -->|Publish| T3
    
    T1 -->|Subscribe| Email
    T2 -->|Subscribe| OrderC
    T3 -->|Subscribe| Email
    
    style Auth fill:#fff4e6
    style Payment fill:#fff4e6
    style Order fill:#fff4e6
    style Email fill:#f3e5f5
    style OrderC fill:#fff4e6
    style T1 fill:#e8f5e9
    style T2 fill:#e8f5e9
    style T3 fill:#e8f5e9
```

---

## Authentication Flow

```mermaid
sequenceDiagram
    participant U as User
    participant C as Client/Admin
    participant CL as Clerk
    participant S as Service
    
    U->>C: Access Protected Route
    C->>C: Check Session
    
    alt No Session
        C->>CL: Redirect to Sign In
        U->>CL: Enter Credentials
        CL->>CL: Authenticate
        CL-->>C: Return JWT Token
        C->>C: Store Session
    end
    
    C->>S: API Request + JWT Token
    S->>CL: Verify Token
    CL-->>S: Token Valid + User Info
    S->>S: Process Request
    S-->>C: Response
    C-->>U: Display Data
```

---

## Error Handling Flow

```mermaid
graph TB
    Request[Incoming Request]
    
    Request --> Auth{Authentication<br/>Valid?}
    Auth -->|No| E401[401 Unauthorized]
    Auth -->|Yes| Authz{Authorization<br/>Valid?}
    
    Authz -->|No| E403[403 Forbidden]
    Authz -->|Yes| Validate{Request<br/>Valid?}
    
    Validate -->|No| E400[400 Bad Request]
    Validate -->|Yes| Process[Process Request]
    
    Process --> DB{Database<br/>Operation}
    DB -->|Error| E500[500 Internal Error]
    DB -->|Not Found| E404[404 Not Found]
    DB -->|Success| Response[200 Success Response]
    
    E401 --> ErrorLog[Log Error]
    E403 --> ErrorLog
    E400 --> ErrorLog
    E404 --> ErrorLog
    E500 --> ErrorLog
    
    ErrorLog --> Client[Return Error to Client]
    Response --> Client
    
    style E401 fill:#ffcdd2
    style E403 fill:#ffcdd2
    style E400 fill:#ffcdd2
    style E404 fill:#ffcdd2
    style E500 fill:#ffcdd2
    style Response fill:#c8e6c9
```

---

## Scaling Strategy

```mermaid
graph TB
    subgraph "Horizontal Scaling"
        LB[Load Balancer]
        
        subgraph "Product Service Instances"
            PS1[Instance 1]
            PS2[Instance 2]
            PS3[Instance 3]
        end
        
        LB --> PS1
        LB --> PS2
        LB --> PS3
    end
    
    subgraph "Database Scaling"
        Primary[(Primary DB)]
        Replica1[(Replica 1)]
        Replica2[(Replica 2)]
        
        Primary -.->|Replication| Replica1
        Primary -.->|Replication| Replica2
    end
    
    PS1 -->|Write| Primary
    PS2 -->|Read| Replica1
    PS3 -->|Read| Replica2
    
    subgraph "Kafka Scaling"
        K1[Broker 1]
        K2[Broker 2]
        K3[Broker 3]
        
        K1 -.->|Replication| K2
        K2 -.->|Replication| K3
    end
    
    PS1 --> K1
    PS2 --> K2
    PS3 --> K3
    
    style LB fill:#e1f5ff
    style Primary fill:#fce4ec
    style Replica1 fill:#fce4ec
    style Replica2 fill:#fce4ec
```

---

## Technology Stack Visualization

```mermaid
graph TB
    subgraph "Frontend Layer"
        F1[Next.js 15]
        F2[React 19]
        F3[TailwindCSS 4]
        F4[TypeScript]
    end
    
    subgraph "Backend Layer"
        B1[Express.js]
        B2[Fastify]
        B3[Hono]
        B4[TypeScript]
    end
    
    subgraph "Data Layer"
        D1[Prisma]
        D2[Mongoose]
        D3[PostgreSQL]
        D4[MongoDB]
    end
    
    subgraph "Messaging Layer"
        M1[KafkaJS]
        M2[Redpanda]
    end
    
    subgraph "External Services"
        E1[Clerk]
        E2[Stripe]
        E3[Nodemailer]
    end
    
    subgraph "DevOps Layer"
        O1[Turborepo]
        O2[pnpm]
        O3[Docker]
        O4[ESLint/Prettier]
    end
    
    F1 --> B1
    F1 --> B2
    F1 --> B3
    
    B1 --> D1
    B2 --> D2
    
    D1 --> D3
    D2 --> D4
    
    B1 --> M1
    B2 --> M1
    B3 --> M1
    
    M1 --> M2
    
    B1 --> E1
    B3 --> E2
    M1 --> E3
    
    style F1 fill:#e1f5ff
    style B1 fill:#fff4e6
    style D1 fill:#fce4ec
    style M1 fill:#e8f5e9
    style E1 fill:#f3e5f5
    style O1 fill:#fff9c4
```

---

For detailed documentation, see:
- [PROJECT_DOCUMENTATION.md](./PROJECT_DOCUMENTATION.md) - Complete architecture details
- [QUICK_START.md](./QUICK_START.md) - Setup instructions
- [API_REFERENCE.md](./API_REFERENCE.md) - API documentation
