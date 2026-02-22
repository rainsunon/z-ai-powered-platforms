# DevOps Setup for E-commerce Microservices

This document provides comprehensive DevOps configurations for deploying the e-commerce microservices to Kubernetes using Terraform, Helm, and GitHub Actions CI/CD.

## Table of Contents

- [Kubernetes Manifests](#kubernetes-manifests)
- [Terraform Infrastructure](#terraform-infrastructure)
- [Helm Charts](#helm-charts)
- [CI/CD Pipelines](#cicd-pipelines)
- [Deployment Guide](#deployment-guide)
- [Monitoring and Observability](#monitoring-and-observability)

## Kubernetes Manifests

### Structure
```
k8s/
├── base/
│   ├── namespace.yaml          # E-commerce namespace
│   ├── configmap.yaml         # Common configuration
│   ├── secret.yaml            # Sensitive data
│   ├── hpa.yaml               # Horizontal Pod Autoscalers
│   └── ingress.yaml           # Ingress configuration
├── services/
│   ├── discovery-service/
│   ├── api-gateway/
│   ├── user-service/
│   ├── product-service/
│   └── ... (other services)
└── kustomization.yaml         # Kustomize configuration
```

### Key Features
- **Namespace**: Dedicated `ecommerce` namespace for all services
- **ConfigMaps**: Centralized configuration management
- **Secrets**: Encrypted sensitive data storage
- **Services**: ClusterIP for internal services, LoadBalancer for API Gateway
- **HPA**: Auto-scaling based on CPU/Memory utilization
- **Ingress**: Nginx ingress with TLS support via cert-manager

### Deployment Commands

```bash
# Apply all manifests
kubectl apply -k kustomization.yaml

# Apply specific service
kubectl apply -f k8s/services/user-service/deployment.yaml

# Check deployment status
kubectl rollout status deployment/user-service -n ecommerce

# View logs
kubectl logs -f deployment/user-service -n ecommerce
```

## Terraform Infrastructure

### Structure
```
terraform/
├── main.tf                 # Provider and module configuration
├── variables.tf            # Input variables
├── vpc.tf                  # VPC, subnets, networking
├── eks.tf                  # EKS cluster configuration
└── outputs.tf              # Output values
```

### Key Features
- **AWS EKS**: Managed Kubernetes cluster
- **VPC**: Isolated network with public/private subnets
- **NAT Gateways**: Private subnet internet access
- **IAM Roles**: Least privilege access for EKS
- **Auto-scaling**: Node group auto-scaling (2-10 nodes)
- **VPC Endpoints**: Private ECR access

### Infrastructure Components
- **VPC**: 10.0.0.0/16 CIDR
- **Public Subnets**: 2 subnets for load balancers
- **Private Subnets**: 3 subnets for worker nodes
- **NAT Gateways**: 2 for high availability
- **EKS Cluster**: Version 1.28, managed control plane
- **Node Groups**: t3.medium and t3.large instances
- **IAM Roles**: Separate roles for cluster and nodes

### Terraform Commands

```bash
# Initialize Terraform
cd terraform
terraform init

# Plan changes
terraform plan -out=tfplan

# Apply infrastructure
terraform apply tfplan

# Destroy infrastructure
terraform destroy

# Import existing state
terraform import aws_vpc.main vpc-xxxxxxxx
```

### Required Variables
Create `terraform.tfvars` file:
```hcl
aws_region       = "us-east-1"
project_name     = "ecommerce"
environment      = "dev"
cluster_name    = "ecommerce-cluster"
cluster_version  = "1.28"
node_desired_size = 3
node_max_size    = 10
node_min_size    = 2
domain_name      = "ecommerce.local"
```

## Helm Charts

### Structure
```
helm/
└── ecommerce/
    ├── Chart.yaml              # Parent chart
    ├── values.yaml             # Default values
    └── charts/
        ├── api-gateway/
        │   ├── Chart.yaml
        │   ├── values.yaml
        │   └── templates/
        │       ├── deployment.yaml
        │       ├── service.yaml
        │       └── hpa.yaml
        ├── user-service/
        ├── product-service/
        └── ... (other services)
```

### Key Features
- **Parent Chart**: Orchestrates all microservices
- **Subcharts**: Individual charts for each service
- **Values**: Environment-specific configuration
- **Templates**: DRY (Don't Repeat Yourself) templates
- **Auto-scaling**: HPA configuration
- **Resource Limits**: CPU/Memory constraints

### Helm Commands

```bash
# Install all services
helm install ecommerce ./helm/ecommerce \
  --namespace ecommerce \
  --create-namespace \
  --values helm/ecommerce/values.yaml

# Upgrade deployment
helm upgrade ecommerce ./helm/ecommerce \
  --namespace ecommerce \
  --values helm/ecommerce/values-prod.yaml

# Rollback
helm rollback ecommerce 1 -n ecommerce

# Uninstall
helm uninstall ecommerce -n ecommerce

# List releases
helm list -n ecommerce
```

### Custom Values

Create environment-specific values files:

**dev.yaml**:
```yaml
global:
  environment: dev
  namespace: ecommerce

api-gateway:
  replicaCount: 1
  resources:
    requests:
      memory: 256Mi
      cpu: 100m
```

**prod.yaml**:
```yaml
global:
  environment: prod
  namespace: ecommerce

api-gateway:
  replicaCount: 3
  autoscaling:
    minReplicas: 3
    maxReplicas: 20
```

## CI/CD Pipelines

### GitHub Actions Workflow

Location: `.github/workflows/ci-cd.yml`

### Pipeline Stages

1. **Build and Test**
   - Matrix build for all services
   - Maven compilation
   - Unit tests
   - Test artifact upload

2. **Docker Build and Push**
   - Multi-stage Docker builds
   - ECR authentication
   - Image tagging (SHA + latest)
   - Push to ECR

3. **Deploy to Kubernetes**
   - EKS kubeconfig update
   - Helm upgrade
   - Deployment verification
   - Rollout status check

4. **Security Scan**
   - Trivy vulnerability scanning
   - SARIF format results
   - GitHub Security integration

### Required Secrets

Configure in GitHub repository secrets:
- `AWS_ACCESS_KEY_ID`: AWS access key
- `AWS_SECRET_ACCESS_KEY`: AWS secret key
- `AWS_ACCOUNT_ID`: AWS account ID for ECR

### Workflow Triggers

- **Push to main**: Full CI/CD pipeline
- **Push to develop**: Build and test only
- **Pull Request**: Build and test only

## Deployment Guide

### Prerequisites

1. **AWS CLI**: Installed and configured
2. **kubectl**: Installed and configured
3. **helm**: Installed (v3.12+)
4. **Docker**: Installed and running
5. **Domain**: Route53 hosted zone configured

### Step-by-Step Deployment

#### 1. Provision Infrastructure

```bash
# Clone repository
git clone <repository-url>
cd ecommerce-microservices

# Deploy infrastructure
cd terraform
terraform init
terraform plan -out=tfplan
terraform apply tfplan

# Get cluster endpoint
terraform output -raw cluster_endpoint
```

#### 2. Configure kubectl

```bash
# Update kubeconfig
aws eks update-kubeconfig \
  --name ecommerce-cluster \
  --region us-east-1

# Verify connection
kubectl cluster-info
kubectl get nodes
```

#### 3. Install Add-ons

```bash
# Install nginx ingress
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm install nginx-ingress ingress-nginx/ingress-nginx \
  --namespace ingress-nginx \
  --set controller.service.type=LoadBalancer

# Install cert-manager
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml

# Install metrics server
helm repo add metrics-server
helm install metrics-server metrics-server/metrics-server \
  --namespace kube-system
```

#### 4. Deploy Applications

```bash
# Deploy all services
helm install ecommerce ./helm/ecommerce \
  --namespace ecommerce \
  --create-namespace \
  --set global.environment=prod \
  --set ingress.host=api.ecommerce.com \
  --wait

# Verify deployment
kubectl get pods -n ecommerce
kubectl get services -n ecommerce
kubectl get ingress -n ecommerce
```

#### 5. Verify Deployment

```bash
# Check pod status
kubectl get pods -n ecommerce -w

# Check service endpoints
kubectl get endpoints -n ecommerce

# Test API gateway
curl http://api.ecommerce.com/actuator/health

# Check logs
kubectl logs -f deployment/api-gateway -n ecommerce
```

### Rollback Procedure

```bash
# Helm rollback
helm rollback ecommerce 1 -n ecommerce

# Or use kubectl
kubectl rollout undo deployment/api-gateway -n ecommerce

# Verify rollback
kubectl rollout status deployment/api-gateway -n ecommerce
```

## Monitoring and Observability

### Recommended Add-ons

#### Prometheus + Grafana
```bash
helm install prometheus prometheus-community/kube-prometheus-stack \
  --namespace monitoring \
  --create-namespace \
  --set grafana.adminPassword=admin
```

#### ELK Stack (Elasticsearch, Logstash, Kibana)
```bash
helm install elastic elastic/elasticsearch \
  --namespace logging \
  --set replicas=3

helm install kibana elastic/kibana \
  --namespace logging

helm install logstash elastic/logstash \
  --namespace logging
```

#### Jaeger Tracing
```bash
helm install jaeger jaegertracing/jaeger \
  --namespace tracing \
  --create-namespace \
  --set provisionDataStore.cassandra=false
```

### Health Checks

```bash
# Liveness probes
kubectl describe deployment/user-service -n ecommerce | grep -A 5 Liveness

# Readiness probes
kubectl describe deployment/user-service -n ecommerce | grep -A 5 Readiness

# Events
kubectl get events -n ecommerce --sort-by='.lastTimestamp'
```

### Metrics Collection

```yaml
# Service-level metrics
apiVersion: v1
kind: ServiceMonitor
metadata:
  name: user-service
  namespace: ecommerce
  labels:
    app: user-service
spec:
  selector:
    matchLabels:
      app: user-service
  endpoints:
  - port: http
    path: /actuator/prometheus
```

## Troubleshooting

### Common Issues

#### Pods Not Starting
```bash
# Check pod status
kubectl describe pod <pod-name> -n ecommerce

# Check events
kubectl get events -n ecommerce --sort-by='.lastTimestamp'

# Check logs
kubectl logs <pod-name> -n ecommerce --previous
```

#### Image Pull Errors
```bash
# Check image pull secrets
kubectl get secret regcred -n ecommerce -o yaml

# Create image pull secret
kubectl create secret docker-registry regcred \
  --docker-server=<ecr-endpoint> \
  --docker-username=<aws-account-id> \
  --docker-password=<token> \
  --namespace ecommerce
```

#### HPA Not Scaling
```bash
# Check HPA status
kubectl describe hpa api-gateway-hpa -n ecommerce

# Check metrics server
kubectl get pods -n kube-system | grep metrics-server

# Verify metrics
kubectl get --raw /apis/metrics.k8s.io/v1beta1/namespaces/ecommerce/pods
```

## Security Best Practices

1. **Network Policies**: Restrict pod-to-pod communication
2. **Pod Security Policies**: Enforce security contexts
3. **Secrets Management**: Use Kubernetes secrets, never commit to git
4. **RBAC**: Least privilege access for service accounts
5. **Image Scanning**: Automated vulnerability scanning in CI/CD
6. **TLS Everywhere**: Enable TLS for all external endpoints
7. **Audit Logging**: Enable audit logs for all services

## Cost Optimization

1. **Right-sizing**: Monitor and adjust resource limits
2. **Auto-scaling**: Use HPA to scale based on demand
3. **Spot Instances**: Use spot instances for non-critical workloads
4. **Reserved Capacity**: Reserve instances for baseline workload
5. **Lifecycle Policies**: Automate instance replacement

## Backup and Disaster Recovery

### EBS Snapshots
```bash
# Automated snapshots
aws ec2 create-snapshot --volume-id <vol-id> --description "Daily backup"

# Lifecycle policy
aws ec2 put-volume-attribute \
  --volume-id <vol-id> \
  --attribute autoEnableIo \
  --value true
```

### Database Backups
```bash
# RDS automated backups
aws rds create-db-snapshot \
  --db-instance-identifier <db-id> \
  --snapshot-type automated

# Cross-region replication
aws rds create-db-instance-read-replica \
  --source-db-instance-identifier <db-id> \
  --region us-west-2
```

## Support and Maintenance

### Useful Commands

```bash
# Port forwarding for debugging
kubectl port-forward deployment/user-service 8082:8082 -n ecommerce

# Exec into pod
kubectl exec -it <pod-name> -n ecommerce -- /bin/bash

# Copy files to/from pod
kubectl cp local-file.txt <pod-name>:/tmp/file.txt -n ecommerce

# Resource usage
kubectl top pods -n ecommerce
kubectl top nodes
```

### Documentation Links

- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Helm Documentation](https://helm.sh/docs/)
- [Terraform Documentation](https://www.terraform.io/docs/)
- [AWS EKS Documentation](https://docs.aws.amazon.com/eks/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

## Contact

For DevOps support and questions:
- Email: devops@ecommerce.com
- Slack: #devops-support
- Documentation: [Internal Wiki](https://wiki.ecommerce.com/devops)
