# Shared Kafka

## Overview
This is a shared utility library designed to standardize Kafka interactions across the different microservices in the system.

## Tech Stack
- **Runtime**: Node.js
- **Library**: `kafkajs`

## Features
- **Producer Wrapper**: Provides a reusable Kafka producer configuration (`producer.js`).
- **Consistency**: Ensures all services use the same Kafka settings and patterns.

## Usage
Used as a local file dependency in other services (e.g., `restaurant` service depends on `file:../shared-kafka/shared-kafka-1.0.0.tgz`).
