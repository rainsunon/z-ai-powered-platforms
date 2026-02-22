#!/bin/bash

# Build and push all Docker images
# Usage: ./build-and-push.sh <docker-registry>

REGISTRY=${1:-"aarnavjp"}

echo "Building and pushing Docker images to: $REGISTRY"
echo "================================================"

# Services to build
SERVICES=("api-gateway" "user-service" "appointment-service" "notification-service" "payment-service")

for SERVICE in "${SERVICES[@]}"; do
  echo ""
  echo "Building $SERVICE..."
  cd ../microservices/$SERVICE
  
  # Build Docker image
  docker build -t $REGISTRY/$SERVICE:latest .
  
  if [ $? -eq 0 ]; then
    echo "Successfully built $SERVICE"
    
    # Push to registry
    echo "Pushing $SERVICE to registry..."
    docker push $REGISTRY/$SERVICE:latest
    
    if [ $? -eq 0 ]; then
      echo "Successfully pushed $SERVICE"
    else
      echo "Failed to push $SERVICE"
      exit 1
    fi
  else
    echo "Failed to build $SERVICE"
    exit 1
  fi
  
  cd - > /dev/null
done

echo ""
echo "All images built and pushed successfully!"
echo "Update k8s manifests with image: $REGISTRY/<service>:latest"