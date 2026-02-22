# AWS EKS Deployment with Terraform & ArgoCD 
## Overview 
This repo contains infrastructure-as-code (IaC) for deploying the Shortlink Platform to AWS EKS using Terraform, integrated with **ArgoCD** to enable a GitOps-based deployment model. 

## Directory Structure 
```
shortlink-aws-terraform/
        ├── terraform/              # Terraform infrastructure code
        │   ├── modules/           # Reusable Terraform modules
        │   │   ├── eks/          # EKS cluster module
        │   │   ├── rds/          # RDS PostgreSQL module
        │   │   ├── kinesis/      # Kinesis Data Streams module
        │   │   ├── vpc/          # VPC networking module
        │   │   └── iam/          # IAM roles and policies
        │   ├── environments/     # Environment-specific configurations
        │   │   └── prod/        # Production environment
        │   ├── main.tf          # Main Terraform configuration
        │   ├── variables.tf     # Variable definitions
        │   └── outputs.tf       # Output values
        ├── argocd/              # ArgoCD Application definitions
        │   └── applications/    # ArgoCD Application manifests
        ├── gitops/              # GitOps repository structure (used by ArgoCD)
        │   ├── base/            # Base Kubernetes manifests
        │   └── overlays/        # Environment-specific overlays
        │       └── aws-prod/    # AWS production overlay
        ├── cicd/                # CI/CD workflows for AWS
        │   └── aws-deploy.yml   # GitHub Actions workflow
        └── README.md            # This file
```

## Prerequisites
### AWS Account Setup 
- AWS account with sufficient permissions 
- AWS CLI configured (`aws configure`)
- Terraform >= 1.5.0
- kubectl >= 1.28 
- ArgoCD CLI (optional, for manual operations)

### Required AWS Services 
- EKS (Elastic Kubernetes Service)
- RDS (PostgreSQL)
- Kinesis Data Streams (or MSK for Kafka)
- ElasticCache (Redis) - optional, managed Redis 
- VPC, Subnets, Security Groups 
- IAM Roles and Policies 

## Quick Start 
### Initialize Terraform 
```bash 
cd shortlink-aws-terraform/terraform/environments/prod
terraform init
```

### Configure Variables 
```bash 
export AWS_REGION=us-west-2
export AWS_PROFILE=your-profile
export TF_VAR_cluster_name=shortlink-eks
export TF_VAR_environment=prod
```

### Plan and Apply Infrastructure 
```bash 
terraform plan 
terraform apply 
```

### Configure ArgoCD Applications 
```
kubectl apply -f argocd/applications/
```

---

## Architecture 
### AWS Components 
- EKS: Managed Kubernetes cluster 
- RDS PostgreSQL: Managed relational database 
- Kinesis Data Streams: Managed streaming service (Alternatively, MSK for Kafka workloads)
- ElasticCache Redis: Managed Redis 
- VPC: Network isolation and routing 
- IAM: Authentication, authorization, and access control 

---

## GitOps Workflow 

```
GitHub Repository
    ↓ (push)
GitHub Actions (CI/CD)
    ↓ (build & push images)
Amazon ECR
    ↓ (update image tags)
GitOps Repository (gitops/)
    ↓ (ArgoCD sync)
EKS Cluster
    ↓ (deploy)
Application Pods
```

## Key Differences from Local Kubernetes
- Database: Managed RDS PostgreSQL instead of self-hosted PostgreSQL 
- Streaming: Kinesis or MSK instead of self-managed Kafka 
- Cache: Managed ElasticCache Redis instead of self-hosted Redis 
- Networking: AWS VPC, Load Balancers, and Security Groups 
- Storage: EBS volumes and EFS for persistent storage 
- Monitoring: CloudWatch and AWS X-Ray integration 