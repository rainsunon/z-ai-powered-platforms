#!/bin/bash

# Complete cluster setup script
# Run after Terraform has provisioned infrastructure

set -e

echo "Healthcare Cloud System - Cluster Setup"
echo "========================================"
echo ""

# Step 1: Configure kubectl
echo "Step 1: Configuring kubectl for EKS..."
aws eks update-kubeconfig --region ap-south-1 --name healthcare-eks

# Step 2: Verify cluster connection
echo ""
echo "Step 2: Verifying cluster connection..."
kubectl get nodes

# Step 3: Create namespaces
echo ""
echo "Step 3: Creating namespaces..."
kubectl create namespace monitoring --dry-run=client -o yaml | kubectl apply -f -

# Step 4: Install ArgoCD
echo ""
echo "Step 4: Installing ArgoCD..."
kubectl create namespace argocd --dry-run=client -o yaml | kubectl apply -f -
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

echo "Waiting for ArgoCD to be ready..."
kubectl wait --for=condition=Ready pods --all -n argocd --timeout=300s

# Patch ArgoCD server to LoadBalancer
kubectl patch svc argocd-server -n argocd -p '{"spec": {"type": "LoadBalancer"}}'

# Step 5: Get ArgoCD credentials
echo ""
echo "Step 5: ArgoCD Setup Complete"
ARGOCD_PASSWORD=$(kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d)
ARGOCD_URL=$(kubectl get svc argocd-server -n argocd -o jsonpath='{.status.loadBalancer.ingress[0].hostname}')

echo "ArgoCD URL: http://$ARGOCD_URL"
echo "ArgoCD Username: admin"
echo "ArgoCD Password: $ARGOCD_PASSWORD"

# Step 6: Create secrets
echo ""
echo "Step 6: Creating Kubernetes secrets..."

# Get RDS endpoint from Terraform outputs
RDS_ENDPOINT=$(cd ../terraform/aws && terraform output -raw rds_endpoint)
DB_PASSWORD=$(aws secretsmanager get-secret-value --secret-id healthcare-db-password --query SecretString --output text)
MSK_BROKERS=$(cd ../terraform/aws && terraform output -raw msk_bootstrap_brokers)

# Create database secret
kubectl create secret generic db-secrets \
  --from-literal=database-url="postgresql://dbadmin:$DB_PASSWORD@$RDS_ENDPOINT/healthcaredb" \
  --from-literal=jdbc-url="jdbc:postgresql://$RDS_ENDPOINT/healthcaredb" \
  --from-literal=username="dbadmin" \
  --from-literal=password="$DB_PASSWORD" \
  --dry-run=client -o yaml | kubectl apply -f -

# Create app secrets
kubectl create secret generic app-secrets \
  --from-literal=jwt-secret="$(openssl rand -base64 32)" \
  --dry-run=client -o yaml | kubectl apply -f -

# Create Kafka config
kubectl create configmap kafka-config \
  --from-literal=bootstrap-servers="$MSK_BROKERS" \
  --dry-run=client -o yaml | kubectl apply -f -

# Step 7: Install Prometheus and Grafana using Helm
echo ""
echo "Step 7: Installing observability stack..."
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update

helm upgrade --install prometheus prometheus-community/kube-prometheus-stack \
  --namespace monitoring \
  --set prometheus.service.type=LoadBalancer \
  --set grafana.service.type=LoadBalancer \
  --set grafana.adminPassword=admin

# Step 8: Deploy applications via ArgoCD
echo ""
echo "Step 8: Deploying applications via ArgoCD..."
echo "Please update the repoURL in k8s/argocd/*.yaml files with your GitHub repository"
echo "Then run: kubectl apply -f k8s/argocd/application.yaml"

echo ""
echo "================================================"
echo "Cluster setup complete!"
echo ""
echo "Next steps:"
echo "1. Update k8s/argocd/application.yaml with your GitHub repo URL"
echo "2. Push code to GitHub"
echo "3. Apply ArgoCD applications: kubectl apply -f k8s/argocd/application.yaml"
echo "4. Access ArgoCD: http://$ARGOCD_URL (admin/$ARGOCD_PASSWORD)"
echo "5. Wait for applications to sync"
echo ""
echo "Get API Gateway URL:"
echo "kubectl get svc api-gateway -o jsonpath='{.status.loadBalancer.ingress[0].hostname}'"
echo ""
echo "Get Grafana URL:"
echo "kubectl get svc prometheus-grafana -n monitoring -o jsonpath='{.status.loadBalancer.ingress[0].hostname}'"