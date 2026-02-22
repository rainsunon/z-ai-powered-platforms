# 🏥 Healthcare Cloud System - Project Summary

**Generated:** February 19, 2026

---

## 📋 Overview

This is a **production-grade, cloud-native healthcare management platform** built with microservices architecture. The system is designed to run on multi-cloud infrastructure (AWS & GCP) using Kubernetes, featuring event-driven architecture, real-time analytics, and comprehensive observability.

---

## 🏗️ Project Architecture

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT REQUESTS                                  │
└──────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                         API GATEWAY (Node.js/Express)                        │
│                      Port: 3000 | Rate Limiting | JWT Auth                   │
└──────────────────────────────────────────────────────────────────────────────┘
            │                    │                    │                │
            ▼                    ▼                    ▼                ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│  User Service   │  │ Appointment Svc │  │ Payment Service │  │ Notification Svc│
│  Python/FastAPI │  │ Java/Spring Boot│  │  Node.js/Express│  │  Python/FastAPI │
│    Port: 8001   │  │    Port: 8002   │  │    Port: 8003   │  │    Port: 8004   │
└─────────────────┘  └─────────────────┘  └─────────────────┘  └─────────────────┘
            │                    │                    │                │
            └──────────────┬─────┴────────────────────┴────────────────┘
                           ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                        APACHE KAFKA (AWS MSK)                                │
│          Topics: appointment-events, user-events, payment-events             │
└──────────────────────────────────────────────────────────────────────────────┘
                           │
            ┌──────────────┴──────────────┐
            ▼                             ▼
┌──────────────────────┐       ┌──────────────────────────┐
│   Flink Analytics    │       │    Lambda Processor      │
│  (GCP Dataproc)      │       │   (AWS Lambda/Python)    │
│  Real-time analytics │       │   Document Processing    │
└──────────────────────┘       └──────────────────────────┘
```

---

## 🔧 Microservices Details

### 1. API Gateway (`microservices/api-gateway/`)
| Attribute | Value |
|-----------|-------|
| **Technology** | Node.js + Express.js |
| **Port** | 3000 |
| **Purpose** | Central entry point for all API requests |

**Key Features:**
- **Rate Limiting:** 100 requests per 15 minutes per IP
- **JWT Authentication:** Token-based authentication middleware
- **Request Routing:** Routes to downstream microservices
- **Security Headers:** Uses Helmet.js for security
- **Metrics:** Prometheus metrics for request duration and counts

**Dependencies:**
- `express`, `cors`, `helmet`, `express-rate-limit`
- `jsonwebtoken`, `axios`, `prom-client`

---

### 2. User Service (`microservices/user-service/`)
| Attribute | Value |
|-----------|-------|
| **Technology** | Python + FastAPI |
| **Port** | 8001 |
| **Database** | PostgreSQL |

**Key Features:**
- User registration with password hashing (bcrypt)
- JWT-based authentication (HS256 algorithm)
- User profile management
- Event publishing to Kafka (`user-events` topic)
- Prometheus metrics integration

**API Endpoints:**
- `POST /register` - Register new user
- `POST /login` - User authentication
- `GET /profile/{id}` - Get user profile
- `GET /health` - Health check
- `GET /metrics` - Prometheus metrics

---

### 3. Appointment Service (`microservices/appointment-service/`)
| Attribute | Value |
|-----------|-------|
| **Technology** | Java 21 + Spring Boot 3.5.11 |
| **Port** | 8002 |
| **Database** | PostgreSQL |
| **Build Tool** | Maven |

**Key Features:**
- Appointment scheduling and management
- Spring Data JPA for database operations
- Kafka integration for event publishing
- Micrometer + Prometheus metrics
- Spring Boot Actuator for health monitoring

**Key Dependencies:**
- `spring-boot-starter-web`
- `spring-boot-starter-data-jpa`
- `spring-kafka`
- `micrometer-registry-prometheus`
- `lombok`

---

### 4. Payment Service (`microservices/payment-service/`)
| Attribute | Value |
|-----------|-------|
| **Technology** | Node.js + Express.js |
| **Port** | 8003 |
| **Database** | PostgreSQL |

**Key Features:**
- Payment processing with transaction tracking
- UUID-based payment IDs
- Kafka integration for payment events
- Prometheus metrics for payment counts
- Auto-creates payments table on startup

---

### 5. Notification Service (`microservices/notification-service/`)
| Attribute | Value |
|-----------|-------|
| **Technology** | Python + FastAPI |
| **Port** | 8004 |
| **Storage** | AWS DynamoDB |

**Key Features:**
- Multi-channel notifications (Email, SMS, Push)
- Kafka consumer for event-driven notifications
- AWS SNS integration for sending notifications
- DynamoDB for notification logging
- Background thread for Kafka message consumption

**Kafka Topics Consumed:**
- `appointment-events`
- `user-events`
- `payment-events`

---

### 6. Flink Analytics (`microservices/flink-analytics/`)
| Attribute | Value |
|-----------|-------|
| **Technology** | Apache Flink 1.17.2 + Java 21 |
| **Deployment** | GCP Dataproc |

**Key Features:**
- Real-time stream processing
- Kafka connector for consuming events
- PostgreSQL integration for analytics storage
- Built as uber-jar using Maven Shade Plugin

---

### 7. Lambda Processor (`microservices/lambda-processor/`)
| Attribute | Value |
|-----------|-------|
| **Technology** | Python 3.11 |
| **Runtime** | AWS Lambda |

**Key Features:**
- S3 event-triggered processing
- Medical document metadata extraction
- Stores metadata in DynamoDB
- Processes PDF files uploaded to S3

---

## ☁️ Terraform Infrastructure Explained

Terraform is used to provision cloud infrastructure as code. The project supports both AWS and GCP deployments.

### AWS Infrastructure (`terraform/aws/`)

#### `provider.tf`
Configures the AWS provider with region settings.

#### `variables.tf`
Defines configurable parameters:
```hcl
- aws_region: "ap-south-1" (default)
- project_name: "healthcare"
- environment: "prod"
```

#### `vpc.tf` - Virtual Private Cloud
**Purpose:** Creates the network foundation for all AWS resources.

**What it creates:**
- **VPC:** 10.0.0.0/16 CIDR block
- **Public Subnets:** 10.0.101.0/24, 10.0.102.0/24, 10.0.103.0/24 (3 AZs)
- **Private Subnets:** 10.0.1.0/24, 10.0.2.0/24, 10.0.3.0/24 (3 AZs)
- **NAT Gateway:** Enables private subnet internet access
- **DNS Hostnames:** Enabled for service discovery

**Why needed:** Provides isolated network with public-facing and private components. Kubernetes worker nodes run in private subnets for security.

---

#### `eks.tf` - Elastic Kubernetes Service
**Purpose:** Creates managed Kubernetes cluster.

**What it creates:**
- **EKS Cluster:** Version 1.28
- **Node Group:** 
  - Instance type: t3.medium
  - Scaling: 2 (min) → 3 (desired) → 10 (max)
  - Capacity: ON_DEMAND

**Why needed:** Hosts all microservices in containers with auto-scaling capabilities.

---

#### `rds.tf` - Relational Database Service
**Purpose:** Provides managed PostgreSQL database.

**What it creates:**
- **PostgreSQL Instance:** Version 15.14
- **Instance Type:** db.t3.micro
- **Storage:** 20GB gp3
- **Database Name:** healthcaredb
- **Backup Retention:** 7 days
- **Security Group:** Port 5432 from VPC only
- **Secrets Manager:** Stores database password

**Why needed:** Persistent data storage for user, appointment, and payment data.

---

#### `msk.tf` - Managed Streaming for Apache Kafka
**Purpose:** Provides managed Kafka message broker.

**What it creates:**
- **Kafka Cluster:** Version 3.5.1
- **Brokers:** 3 nodes across AZs
- **Instance Type:** kafka.t3.small
- **Storage:** 100GB per broker
- **Encryption:** In-transit enabled

**Why needed:** Enables event-driven communication between microservices.

---

#### `dynamodb.tf` - NoSQL Database
**Purpose:** Fast, serverless key-value storage.

**What it creates:**
- **Sessions Table:** Stores user sessions with TTL
- **Notifications Table:** Logs notification history

**Billing Mode:** PAY_PER_REQUEST (auto-scaling)

**Why needed:** High-performance session management and notification logging.

---

#### `s3.tf` - Simple Storage Service
**Purpose:** Object storage for medical documents.

**What it creates:**
- **S3 Bucket:** With unique suffix for global uniqueness
- **Versioning:** Enabled for document history
- **Lambda Trigger:** Invokes processor on PDF uploads

**Why needed:** Secure storage for medical documents with processing pipeline.

---

#### `lambda.tf` - Serverless Functions
**Purpose:** Event-driven document processing.

**What it creates:**
- **Lambda Function:** Python 3.11 runtime
- **IAM Role:** With DynamoDB and S3 permissions
- **S3 Trigger:** Invoked on new PDF uploads

**Why needed:** Serverless processing of uploaded documents without managing servers.

---

#### `outputs.tf` - Terraform Outputs
Exports important values:
- EKS cluster endpoint and name
- RDS database endpoint
- MSK bootstrap brokers
- S3 bucket name

---

### GCP Infrastructure (`terraform/gcp/`)

#### `variables.tf`
```hcl
- gcp_project_id: GCP project identifier
- gcp_region: "asia-southeast1"
- project_name: "healthcare-analytics"
```

#### `network.tf` - VPC Network
**What it creates:**
- **VPC:** Custom mode (no auto-subnets)
- **Subnet:** 10.1.0.0/24
- **Firewall Rules:** 
  - Internal traffic: All TCP/UDP/ICMP
  - SSH: Port 22 for debugging

**Why needed:** Network isolation for GCP resources.

---

#### `cloudsql.tf` - Cloud SQL
**Purpose:** Managed PostgreSQL for analytics.

**What it creates:**
- **PostgreSQL Instance:** Version 15
- **Tier:** db-f1-micro
- **Database:** analytics
- **Backup:** Enabled
- **Password:** Randomly generated

**Why needed:** Analytics data storage separate from transactional database.

---

#### `dataproc.tf` - Data Processing Cluster
**Purpose:** Runs Apache Flink for stream processing.

**What it creates:**
- **Dataproc Cluster:** 
  - 1 Master node (e2-standard-2)
  - 2 Worker nodes (e2-standard-2)
  - 50GB boot disks
  - Flink component enabled
- **Image:** Debian 11 based (2.1)

**Why needed:** Runs Flink jobs for real-time analytics on healthcare data.

---

#### `storage.tf` - Cloud Storage
Creates GCS buckets for data lake and analytics output.

---

## 🎯 Kubernetes Files Explained (`k8s/`)

### ArgoCD Applications (`k8s/argocd/`)

ArgoCD is a GitOps continuous delivery tool that automatically syncs Kubernetes manifests from Git to the cluster.

#### `app-of-apps.yaml`
**Purpose:** Parent application that manages all other ArgoCD applications.

**How it works:**
```yaml
source:
  path: k8s/argocd  # Watches this directory for Application manifests
syncPolicy:
  automated:
    prune: true      # Removes resources not in Git
    selfHeal: true   # Reverts manual cluster changes
```
**Why needed:** Single entry point to deploy entire system. Add new services by adding Application YAML files.

---

#### `application.yaml`
**Purpose:** Main application deploying all microservices and monitoring stack.

**Two Applications Defined:**

1. **healthcare-system:**
   - Path: `k8s/manifests`
   - Namespace: `default`
   - Deploys: All microservices

2. **healthcare-monitoring:**
   - Path: `k8s/manifests/observability`
   - Namespace: `monitoring`
   - Deploys: Prometheus, Grafana, ELK stack

**Sync Policy:**
- `prune: true` - Deletes resources removed from Git
- `selfHeal: true` - Auto-reverts manual changes
- `retry.limit: 5` - Retries failed syncs

---

#### `api-gateway-app.yaml`, `user-service-app.yaml`, `appointment-service-app.yaml`
**Purpose:** Individual ArgoCD Applications for each microservice.

**Why separate:** Allows independent deployment and rollback of individual services.

---

### Kubernetes Manifests (`k8s/manifests/`)

#### Config (`config/configmap.yaml`)
**Purpose:** Externalized configuration for services.

**ConfigMaps Created:**

1. **kafka-config:**
   ```yaml
   bootstrap-servers: "YOUR_MSK_BOOTSTRAP_SERVERS"
   ```

2. **aws-config:**
   ```yaml
   dynamodb-notifications-table: "healthcare-notifications"
   dynamodb-sessions-table: "healthcare-sessions"
   s3-bucket: "YOUR_S3_BUCKET_NAME"
   region: "ap-south-1"
   ```

**Why needed:** Separates configuration from container images. Update without rebuilding.

---

#### API Gateway (`api-gateway/deployment.yaml`)

**Resources Created:**

1. **Deployment:**
   - Replicas: 2 (high availability)
   - Image: `aarnavjp/api-gateway:v2`
   - Port: 3000
   - Environment: Service URLs, JWT secret from Secret
   - Resources: 128-256Mi memory, 100-200m CPU
   - Health Probes: `/health` endpoint

2. **Service:**
   - Type: LoadBalancer (external access)
   - Port: 80 → 3000

3. **HorizontalPodAutoscaler (HPA):**
   - Min: 2, Max: 10 replicas
   - CPU trigger: 70% utilization
   - Memory trigger: 80% utilization

**Why HPA:** Automatically scales pods during traffic spikes.

---

#### User Service (`user-service/deployment.yaml`)

**Deployment Configuration:**
- Replicas: 2
- Image: `aarnavjp/user-service:latest`
- Port: 8001

**Environment Variables (from Secrets/ConfigMaps):**
```yaml
- DATABASE_URL: from db-secrets
- KAFKA_BOOTSTRAP_SERVERS: from kafka-config
- JWT_SECRET: from app-secrets
```

**Why use Secrets:** Sensitive data (passwords, keys) stored securely in Kubernetes, not in container images.

---

#### Appointment Service (`appointment-service/deployment.yaml`)

**Deployment Configuration:**
- Replicas: 2
- Image: `aarnavjp/appointment-service:latest`
- Port: 8002

**Spring-specific Environment:**
```yaml
- SPRING_DATASOURCE_URL: JDBC connection string
- SPRING_DATASOURCE_USERNAME: from db-secrets
- SPRING_DATASOURCE_PASSWORD: from db-secrets
- KAFKA_BOOTSTRAP_SERVERS: from kafka-config
```

---

### Observability Stack (`observability/`)

#### `prometheus.yaml`
**Purpose:** Metrics collection and alerting.

**Components:**
- **Namespace:** Creates `monitoring` namespace
- **ConfigMap:** Prometheus scrape configuration
- **Deployment:** Prometheus server
- **Service:** Internal ClusterIP

**Scrape Jobs:**
```yaml
- kubernetes-apiservers  # K8s API metrics
- kubernetes-nodes       # Node metrics
- kubernetes-pods        # Pod metrics (with annotations)
- api-gateway           # Service-specific metrics
- user-service
- appointment-service
- payment-service
- notification-service
```

**Why needed:** Collects metrics from all services. Query with PromQL, visualize in Grafana.

---

#### `grafana.yaml`
**Purpose:** Metrics visualization and dashboards.

**Configuration:**
- Image: grafana/grafana:10.1.0
- Port: 3000
- Service Type: LoadBalancer
- Auto-provisioned Prometheus datasource

**Datasource Config:**
```yaml
datasources:
  - name: Prometheus
    type: prometheus
    url: http://prometheus:9090
    isDefault: true
```

---

#### `elasticsearch.yaml`
**Purpose:** Log aggregation and search.

**Configuration:**
- Image: elasticsearch:8.11.0
- Mode: single-node (development)
- Ports: 9200 (HTTP), 9300 (transport)
- Memory: 1-2Gi
- Security: Disabled (for development)

---

#### `kibana.yaml`
**Purpose:** Log visualization UI for Elasticsearch.

---

#### `fluentd.yaml`
**Purpose:** Log collection agent (DaemonSet) that forwards logs to Elasticsearch.

---

## 📊 Observability Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         METRICS PATH                            │
├─────────────────────────────────────────────────────────────────┤
│  Services → /metrics endpoint → Prometheus → Grafana Dashboards│
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                          LOGS PATH                              │
├─────────────────────────────────────────────────────────────────┤
│  Containers → stdout/stderr → Fluentd → Elasticsearch → Kibana │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🧪 Load Testing (`load-tests/`)

### `load-test.js`
**Tool:** K6 (JavaScript-based load testing)

**Test Stages:**
1. Ramp to 50 users (2 min)
2. Hold 50 users (5 min)
3. Ramp to 100 users (2 min)
4. Hold 100 users (5 min)
5. Ramp to 200 users (2 min) - Triggers HPA scaling
6. Hold 200 users (5 min)
7. Ramp down (2 min)

**Thresholds:**
- 95th percentile response < 500ms
- Error rate < 10%

### `spike-test.js`
Tests sudden traffic spikes to verify system resilience.

### `monitor-hpa.sh`
Watches HPA scaling during load tests.

---

## 🔐 Security Architecture

| Component | Security Measure |
|-----------|-----------------|
| **Authentication** | JWT tokens with HS256 signing |
| **Password Storage** | bcrypt hashing |
| **Secrets** | Kubernetes Secrets + AWS Secrets Manager |
| **Network** | VPC with private subnets |
| **Database** | Security groups, no public access |
| **API Gateway** | Rate limiting, Helmet.js headers |
| **Kubernetes** | RBAC, Network Policies |

---

## 🚀 Deployment Workflow

```
1. Developer pushes code to GitHub
           ↓
2. CI/CD builds Docker images
           ↓
3. Images pushed to Docker Hub (aarnavjp/*)
           ↓
4. Update K8s manifests with new image tags
           ↓
5. ArgoCD detects Git changes
           ↓
6. ArgoCD syncs desired state to cluster
           ↓
7. Kubernetes rolling update (zero downtime)
           ↓
8. Health checks verify deployment
           ↓
9. Prometheus collects metrics
```

---

## 📁 File Structure Summary

```
healthcare-cloud-system/
├── README.md                    # Project documentation
├── PROJECT_SUMMARY.md           # This summary file
│
├── microservices/               # Application code
│   ├── api-gateway/            # Node.js (Express)
│   ├── user-service/           # Python (FastAPI)
│   ├── appointment-service/    # Java (Spring Boot 3.5)
│   ├── payment-service/        # Node.js (Express)
│   ├── notification-service/   # Python (FastAPI)
│   ├── flink-analytics/        # Java (Apache Flink)
│   └── lambda-processor/       # Python (AWS Lambda)
│
├── terraform/                   # Infrastructure as Code
│   ├── aws/                    # AWS: VPC, EKS, RDS, MSK, S3, Lambda, DynamoDB
│   └── gcp/                    # GCP: Network, Cloud SQL, Dataproc, Storage
│
├── k8s/                         # Kubernetes resources
│   ├── argocd/                 # GitOps application definitions
│   └── manifests/              # Deployments, Services, ConfigMaps
│       ├── api-gateway/
│       ├── user-service/
│       ├── appointment-service/
│       ├── payment-service/
│       ├── notification-service/
│       ├── config/             # ConfigMaps
│       └── observability/      # Prometheus, Grafana, ELK
│
├── load-tests/                  # K6 performance tests
│
└── scripts/                     # Automation scripts
    ├── setup-cluster.sh        # Full cluster setup
    ├── build-and-push.sh       # Build/push all images
    ├── test-services.sh        # Health check services
    ├── deploy-flink.sh         # Deploy Flink jobs
    └── cleanup.sh              # Destroy all resources
```

---

## 🔢 Technology Versions

| Technology | Version |
|------------|---------|
| Java | 21 |
| Spring Boot | 3.5.11 |
| Python | 3.11 |
| Node.js | Latest LTS |
| Kubernetes | 1.28 |
| Terraform | 1.5+ |
| Apache Flink | 1.17.2 |
| Apache Kafka | 3.5.1 |
| PostgreSQL | 15 |
| Elasticsearch | 8.11.0 |
| Grafana | 10.1.0 |

---

## 📞 Quick Reference Commands

```bash
# Deploy infrastructure
cd terraform/aws && terraform apply

# Build & push images
./scripts/build-and-push.sh

# Setup Kubernetes cluster
./scripts/setup-cluster.sh

# Deploy via ArgoCD
kubectl apply -f k8s/argocd/application.yaml

# Run load tests
cd load-tests && k6 run load-test.js

# View logs
kubectl logs -f deployment/user-service

# Check HPA scaling
kubectl get hpa -w

# Cleanup
./scripts/cleanup.sh
```

---

*This summary was generated by analyzing all project files including microservices, Terraform configurations, Kubernetes manifests, and supporting scripts.*

