# CI/CD Pipeline for AWS Deployment

## Overview

GitHub Actions workflow for building, pushing, and deploying to AWS EKS via ArgoCD.

## Workflow Steps

1. **Terraform Plan**: Validate infrastructure changes
2. **Build & Push Images**: Build Docker images and push to ECR
3. **Update GitOps**: Update image tags in GitOps repository
4. **Deploy to EKS**: Trigger ArgoCD sync (automatic or manual)

## Prerequisites

### GitHub Secrets

Configure the following secrets in GitHub:

- `AWS_ACCESS_KEY_ID`: AWS access key
- `AWS_SECRET_ACCESS_KEY`: AWS secret key
- `DOCKER_USERNAME`: Docker Hub username (if using)
- `DOCKER_PASSWORD`: Docker Hub password (if using)

### AWS Resources

- ECR repository created for each service
- EKS cluster created via Terraform
- IAM roles with appropriate permissions

## Workflow Triggers

- Push to `main` branch (with changes in relevant paths)
- Manual trigger via `workflow_dispatch`

## Customization

Update the following in `aws-deploy.yml`:
- `ECR_REGISTRY`: Your ECR registry URL
- `EKS_CLUSTER_NAME`: Your EKS cluster name
- `AWS_REGION`: Your AWS region
- Repository URLs in ArgoCD applications

## Integration with ArgoCD

The workflow updates GitOps repository, and ArgoCD automatically syncs:
1. Workflow updates image tags in `gitops/overlays/aws-prod/`
2. ArgoCD detects Git changes
3. ArgoCD syncs to EKS cluster
4. New pods are deployed with updated images

## Manual Deployment

If ArgoCD auto-sync is disabled:

```bash
# After workflow completes
argocd app sync shortlink-platform
```
