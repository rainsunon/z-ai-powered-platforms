Online Food Ordering (OFO) Platform

A microservices-based food ordering platform with event-driven architecture, React 19 frontend, and Kubernetes/Terraform deployment.

Table of Contents

    Overview
    Services
    Architecture
    Local Development
    Kubernetes Deployment
    Terraform (AWS)
    Frontend
    Documentation

Overview

OFO is a cloud-native, event-driven food ordering platform using Spring Boot 3 (Java 21), Apache Kafka, PostgreSQL JSONB, and a React 19 frontend. It includes DDD-aligned microservices and a Backend-for-Frontend (BFF) for API aggregation.

Services

Core services (existing)

    user-service (PostgreSQL)
    restaurant-service (MongoDB)
    order-service (MongoDB)
    payment-service (MongoDB)
    search-service (MongoDB)
    review-service (MongoDB)
    security-service
    ofo-gateway

New services (added)

    billing-service (PostgreSQL, JSONB, idempotency)
    notification-service (PostgreSQL, email/SMS)
    invoice-service (PostgreSQL, JSONB, PDF)
    bff-service (Redis cache, aggregation)

Architecture

    Event-driven processing with Kafka topics (order-paid, order-created, invoice-generated, notification-events)
    Idempotent consumers using request_id and PostgreSQL unique constraints
    CAP trade-offs: CP for billing/invoice; AP for notifications
    JSONB + GIN indexes for flexible metadata and fast queries

Local Development

1) Start infra (Kafka, Postgres, Redis)

    docker-compose up -d

2) Build backend services

    ./mvnw clean package -DskipTests

3) Run frontend

    cd ofo-frontend
    npm install
    npm run dev

Kubernetes Deployment

    kubectl apply -f deployment-kubernetes/kube-manifests/

Terraform (AWS)

    cd terraform
    terraform init
    terraform plan
    terraform apply

Frontend

    React 19 + Vite + TailwindCSS + ShadCN UI
    Redux Toolkit state management
    Lazy-loaded routes and axios client

Documentation

    IMPLEMENTATION_SUMMARY.md - full architecture & infra details
    DEPENDENCY_UPGRADES.md - version standardization and upgrades
