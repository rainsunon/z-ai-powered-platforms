# 🏥 Healthcare Cloud Microservices System

A production-grade, cloud-native healthcare management platform built with microservices architecture, deployed across multi-cloud infrastructure (AWS & GCP) using Kubernetes, featuring event-driven architecture, real-time analytics, and comprehensive observability.

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Kubernetes](https://img.shields.io/badge/kubernetes-1.27+-blue.svg)](https://kubernetes.io/)
[![Spring Boot](https://img.shields.io/badge/spring--boot-3.1.5-green.svg)](https://spring.io/projects/spring-boot)
[![FastAPI](https://img.shields.io/badge/fastapi-0.100+-009688.svg)](https://fastapi.tiangolo.com/)

## 📋 Overview

This Healthcare Cloud System is an enterprise-scale platform designed to manage healthcare operations with high availability, scalability, and security. It implements a microservices architecture with event-driven communication, deployed on Kubernetes clusters across AWS and GCP.

### Key Features

- **🔐 Secure User Management** - JWT-based authentication with role-based access control
- **📅 Appointment Scheduling** - Real-time appointment booking and management
- **💳 Payment Processing** - Integrated payment gateway with transaction tracking
- **📨 Notification Service** - Multi-channel notifications (Email, SMS, Push)
- **📊 Real-time Analytics** - Apache Flink-based stream processing for operational insights
- **🔄 Event-Driven Architecture** - Apache Kafka for asynchronous communication
- **📈 Observability** - Prometheus metrics, Grafana dashboards, distributed tracing
- **🚀 GitOps Deployment** - ArgoCD for continuous delivery
- **☁️ Multi-Cloud** - AWS EKS and GCP GKE deployment options
- **⚡ Auto-Scaling** - Horizontal Pod Autoscaler and Cluster Autoscaler
- **🧪 Load Testing** - K6-based performance testing suite

## 🏗️ Architecture

### Microservices Stack

| Service | Technology | Port | Description |
|---------|-----------|------|-------------|
| **API Gateway** | Node.js + Express | 8000 | Entry point, request routing, rate limiting |
| **User Service** | Python + FastAPI | 8001 | User authentication, profile management |
| **Appointment Service** | Java + Spring Boot | 8002 | Appointment scheduling and management |
| **Payment Service** | Node.js + Express | 8003 | Payment processing and transactions |
| **Notification Service** | Python + FastAPI | 8004 | Email, SMS, push notifications |
| **Flink Analytics** | Apache Flink | - | Real-time data processing |
| **Lambda Processor** | AWS Lambda / GCP Functions | - | Serverless event processing |

### Infrastructure Components

- **Container Orchestration**: Kubernetes (EKS on AWS, GKE on GCP)
- **Service Mesh**: Istio (optional)
- **Message Broker**: Apache Kafka (AWS MSK / Confluent Cloud)
- **Database**: PostgreSQL (AWS RDS / Cloud SQL)
- **Caching**: Redis (Elasticache / Memorystore)
- **Object Storage**: AWS S3 / GCP Cloud Storage
- **Monitoring**: Prometheus + Grafana
- **Logging**: ELK Stack (Elasticsearch, Logstash, Kibana)
- **GitOps**: ArgoCD
- **IaC**: Terraform

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed and configured:

- **Cloud Accounts**
  - AWS Account with appropriate IAM permissions
  - GCP Account with billing enabled
  - Docker Hub account (or other container registry)

- **Required Tools**
  ```bash
  # Verify installations
  terraform --version    # >= 1.5.0
  kubectl version       # >= 1.27
  docker --version      # >= 20.10
  aws --version         # >= 2.0
  gcloud --version      # Latest
  helm version          # >= 3.0
  ```

### Installation

#### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Aarnav-JP/healthcare-cloud-system.git
cd healthcare-cloud-system
```

#### 2️⃣ Configure Cloud Credentials

**AWS Configuration:**
```bash
aws configure
# Enter your AWS Access Key ID, Secret Access Key, and Region (ap-south-1 recommended)
```

**GCP Configuration:**
```bash
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
```

#### 3️⃣ Set Environment Variables

```bash
# Docker Hub credentials (for pushing microservice images)
export DOCKER_USERNAME=your-dockerhub-username
export DOCKER_PASSWORD=your-dockerhub-password

# Cloud-specific variables
export AWS_REGION=ap-south-1
export GCP_PROJECT_ID=your-gcp-project-id
```

#### 4️⃣ Deploy Infrastructure with Terraform

**For AWS Deployment:**
```bash
cd terraform/aws
terraform init
terraform plan
terraform apply

# Save important outputs
terraform output > ../../aws-outputs.txt
```

**For GCP Deployment:**
```bash
cd terraform/gcp
terraform init
terraform plan -var="gcp_project_id=$GCP_PROJECT_ID"
terraform apply -var="gcp_project_id=$GCP_PROJECT_ID"

# Save important outputs
terraform output > ../../gcp-outputs.txt
```

#### 5️⃣ Build and Push Microservices

```bash
cd ../..
./scripts/build-and-push.sh
```

This script will:
- Build Docker images for all microservices
- Tag images with version numbers
- Push to your container registry

#### 6️⃣ Setup Kubernetes Cluster

```bash
./scripts/setup-cluster.sh
```

This automated script will:
- Configure kubectl for your cluster
- Install ArgoCD for GitOps
- Setup Prometheus and Grafana for monitoring
- Create necessary namespaces and secrets
- Configure Kafka and database connections

#### 7️⃣ Deploy Applications via ArgoCD

```bash
# Update the repository URL in ArgoCD configuration
sed -i 's|https://github.com/YOUR_USERNAME/healthcare-cloud-system|https://github.com/Aarnav-JP/healthcare-cloud-system|g' k8s/argocd/application.yaml

# Apply ArgoCD applications
kubectl apply -f k8s/argocd/application.yaml

# Monitor deployment
kubectl get applications -n argocd -w
```

#### 8️⃣ Access the System

```bash
# Get API Gateway URL
export API_GATEWAY_URL=$(kubectl get svc api-gateway -o jsonpath='{.status.loadBalancer.ingress[0].hostname}')
echo "API Gateway: http://$API_GATEWAY_URL"

# Get ArgoCD UI
export ARGOCD_URL=$(kubectl get svc argocd-server -n argocd -o jsonpath='{.status.loadBalancer.ingress[0].hostname}')
echo "ArgoCD: http://$ARGOCD_URL"

# Get ArgoCD admin password
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d

# Get Grafana Dashboard
export GRAFANA_URL=$(kubectl get svc prometheus-grafana -n monitoring -o jsonpath='{.status.loadBalancer.ingress[0].hostname}')
echo "Grafana: http://$GRAFANA_URL"
```

## 📖 API Documentation

### User Service Endpoints

```bash
# Register new user
curl -X POST http://$API_GATEWAY_URL/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "patient@example.com",
    "name": "John Doe",
    "phone": "+1234567890",
    "password": "securepassword",
    "role": "patient"
  }'

# Login
curl -X POST http://$API_GATEWAY_URL/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "patient@example.com",
    "password": "securepassword"
  }'

# Get user profile
curl http://$API_GATEWAY_URL/api/users/profile/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Appointment Service Endpoints

```bash
# Create appointment
curl -X POST http://$API_GATEWAY_URL/api/appointments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "userId": 1,
    "doctorId": 5,
    "dateTime": "2024-12-20T10:00:00",
    "type": "consultation"
  }'

# Get appointments
curl http://$API_GATEWAY_URL/api/appointments/user/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Payment Service Endpoints

```bash
# Process payment
curl -X POST http://$API_GATEWAY_URL/api/payments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "appointmentId": 1,
    "amount": 100.00,
    "currency": "USD",
    "paymentMethod": "card"
  }'
```

## 🧪 Testing

### Health Checks

```bash
# Check all services
./scripts/test-services.sh
```

### Load Testing

```bash
cd load-tests

# Run standard load test
./run-load-test.sh

# Run spike test
k6 run spike-test.js

# Monitor HPA during load test
./monitor-hpa.sh
```

### Monitor Performance

```bash
# Watch pod metrics
kubectl top pods

# Monitor HPA scaling
kubectl get hpa -w

# View logs
kubectl logs -f deployment/user-service
kubectl logs -f deployment/appointment-service
```

## 📊 Monitoring & Observability

### Prometheus Metrics

Access Prometheus at `http://<prometheus-url>:9090`

Key metrics tracked:
- Request rates and latency per service
- Error rates and status codes
- Database connection pool metrics
- Kafka consumer lag
- JVM/Python runtime metrics

### Grafana Dashboards

Access Grafana at `http://<grafana-url>` (default credentials: admin/admin)

Pre-configured dashboards:
- **Microservices Overview** - Health and performance of all services
- **Kubernetes Cluster** - Node and pod resource utilization
- **Kafka Streams** - Message throughput and consumer lag
- **Database Performance** - Query performance and connection metrics
- **API Gateway** - Request routing and rate limiting

### Application Logs

```bash
# View logs from specific service
kubectl logs -f deployment/user-service

# View logs from all pods of a service
kubectl logs -l app=appointment-service --tail=100

# Stream logs to ELK
# (Configured automatically if ELK stack is deployed)
```

## 🔒 Security

- **Authentication**: JWT-based authentication with secure token management
- **Authorization**: Role-based access control (RBAC) for Kubernetes and application
- **Secrets Management**: AWS Secrets Manager / GCP Secret Manager
- **Network Policies**: Kubernetes network policies for pod-to-pod communication
- **TLS/SSL**: Certificate management via cert-manager
- **Database**: Encrypted at rest and in transit
- **API Rate Limiting**: Implemented at API Gateway level
- **Vulnerability Scanning**: Container images scanned with Trivy

## 🔄 CI/CD Pipeline

### GitOps Workflow

1. **Code Changes** → Push to Git repository
2. **Container Build** → GitHub Actions / Jenkins builds Docker images
3. **Image Push** → Images pushed to Docker Hub / ECR / GCR
4. **Manifest Update** → ArgoCD detects changes in k8s manifests
5. **Deployment** → ArgoCD syncs desired state to cluster
6. **Health Checks** → Kubernetes probes verify deployment
7. **Monitoring** → Prometheus/Grafana track performance

### Manual Deployment Update

```bash
# Update image version in manifest
kubectl set image deployment/user-service user-service=yourusername/user-service:v2.0

# Or apply updated manifest
kubectl apply -f k8s/manifests/user-service/deployment.yaml
```

## 📁 Project Structure

```
healthcare-cloud-system/
├── microservices/              # All microservice code
│   ├── api-gateway/           # Node.js API Gateway
│   ├── user-service/          # Python FastAPI service
│   ├── appointment-service/   # Java Spring Boot service
│   ├── payment-service/       # Node.js payment processing
│   ├── notification-service/  # Python notification service
│   ├── flink-analytics/       # Apache Flink jobs
│   └── lambda-processor/      # Serverless functions
├── terraform/                 # Infrastructure as Code
│   ├── aws/                  # AWS EKS, RDS, MSK, etc.
│   └── gcp/                  # GCP GKE, Cloud SQL, etc.
├── k8s/                      # Kubernetes manifests
│   ├── manifests/           # Service deployments, services, HPA
│   └── argocd/              # ArgoCD applications
├── scripts/                  # Automation scripts
│   ├── setup-cluster.sh     # Complete cluster setup
│   ├── build-and-push.sh    # Build and push all images
│   ├── deploy-flink.sh      # Deploy Flink jobs
│   ├── test-services.sh     # Health check all services
│   └── cleanup.sh           # Destroy all resources
├── load-tests/               # Performance testing
│   ├── load-test.js         # K6 load test script
│   ├── spike-test.js        # K6 spike test script
│   └── monitor-hpa.sh       # Monitor auto-scaling
└── docs/                     # Documentation (WIP)
```

## 🔧 Configuration

### Environment Variables

Each microservice can be configured via environment variables or Kubernetes secrets:

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | - |
| `KAFKA_BOOTSTRAP_SERVERS` | Kafka broker addresses | - |
| `JWT_SECRET` | Secret key for JWT signing | - |
| `REDIS_URL` | Redis connection string | - |
| `LOG_LEVEL` | Logging level | `INFO` |
| `PORT` | Service port | Service-specific |

### Kubernetes Secrets

```bash
# Database credentials
kubectl create secret generic db-secrets \
  --from-literal=database-url=postgresql://user:pass@host/db

# Application secrets
kubectl create secret generic app-secrets \
  --from-literal=jwt-secret=your-secret-key

# Kafka configuration
kubectl create configmap kafka-config \
  --from-literal=bootstrap-servers=kafka-broker:9092
```

## 🛠️ Troubleshooting

### Common Issues

**Pods not starting:**
```bash
kubectl describe pod <pod-name>
kubectl logs <pod-name>
```

**Database connection issues:**
```bash
# Verify secrets
kubectl get secret db-secrets -o yaml

# Test connectivity from pod
kubectl run -it --rm debug --image=postgres:14 --restart=Never -- psql -h <db-host> -U dbadmin
```

**Kafka connection issues:**
```bash
# Check Kafka config
kubectl get configmap kafka-config -o yaml

# Verify MSK/Kafka brokers are accessible
kubectl run -it --rm kafka-test --image=confluentinc/cp-kafka:latest --restart=Never -- kafka-topics --list --bootstrap-server <broker>
```

**HPA not scaling:**
```bash
# Check metrics server
kubectl top nodes
kubectl top pods

# Verify HPA configuration
kubectl describe hpa <hpa-name>
```

## 🧹 Cleanup

To completely destroy all resources and avoid cloud charges:

```bash
# Delete Kubernetes resources
kubectl delete -f k8s/argocd/application.yaml
kubectl delete namespace argocd monitoring

# Destroy cloud infrastructure
cd terraform/aws
terraform destroy

cd ../gcp
terraform destroy -var="gcp_project_id=$GCP_PROJECT_ID"

# Or use the cleanup script
./scripts/cleanup.sh
```

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- **Aarnav JP** - [GitHub](https://github.com/Aarnav-JP)

## 🙏 Acknowledgments

- Spring Boot and FastAPI communities
- Kubernetes and CNCF projects
- Apache Kafka and Flink communities
- AWS and GCP documentation

## 📞 Support

For issues and questions:
- Create an issue in the GitHub repository
- Email: [aarnavjp@gmail.com]

## 🗺️ Roadmap

- [ ] Add frontend web application (React/Next.js)
- [ ] Implement mobile apps (iOS/Android)
- [ ] Add video consultation feature
- [ ] Integrate ML-based appointment recommendations
- [ ] Add multi-tenancy support for multiple healthcare providers
- [ ] Implement FHIR (Fast Healthcare Interoperability Resources) standards
- [ ] Add comprehensive API documentation with Swagger/OpenAPI
- [ ] Implement distributed tracing with Jaeger
- [ ] Add chaos engineering tests with Chaos Mesh
- [ ] Create Helm charts for easier deployment

---

**⚠️ Note**: This project is currently in development. Some features may be incomplete or subject to change. Always review and adjust configurations before deploying to production environments.
