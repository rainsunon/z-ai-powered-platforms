#!/bin/bash

# Cleanup script - destroy all resources
# WARNING: This will delete everything!

echo "Healthcare Cloud System - Cleanup"
echo "================================="
echo ""
echo "WARNING: This will destroy all resources!"
read -p "Are you sure? (yes/no): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
  echo "Cleanup cancelled"
  exit 0
fi

# Delete Kubernetes resources
echo ""
echo "Deleting Kubernetes resources..."
kubectl delete -f ../k8s/argocd/application.yaml || true
kubectl delete namespace argocd || true
kubectl delete namespace monitoring || true
kubectl delete all --all -n default || true

# Destroy AWS infrastructure
echo ""
echo "Destroying AWS infrastructure..."
cd ../terraform/aws
terraform destroy -auto-approve

# Destroy GCP infrastructure
echo ""
echo "Destroying GCP infrastructure..."
cd ../terraform/gcp
terraform destroy -auto-approve

echo ""
echo "Cleanup complete!"