# Kubernetes Configuration

## Overview
This directory contains the Kubernetes manifests and configuration files necessary to deploy the entire microservices architecture to a K8s cluster.

## Contents
- **Service Deployments**: YAML files for each service (`admin-service.yaml`, `auth-service.yaml`, `order-service.yaml`, etc.).
- **Infrastructure**:
  - `kafka.yaml`: Kafka message broker configuration.
  - `mongodb.yaml`: MongoDB database deployment.
  - `ingress.yaml`: Ingress controller configuration for routing external traffic.
- **Configuration**:
  - `secrets.yaml`: Secrets management (credentials, keys).
  - `namespace.yaml`: Namespace definition.
  - `kustomization.yaml`: Kustomize file for managing overlays and resource bundles.

## Deployment
These files are used to orchestrate the containerized applications defined in the other directories.
