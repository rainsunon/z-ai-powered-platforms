# 📦 Shortlink-Test

## Overview

Shortlink-Test is a dedicated testing repository for the Shortlink system.

The goal of this repository is to validate the system from the outside, treating the Shortlink backend as a fully deployed service, not as source code.

All tests interact with the system only via public APIs or UI, ensuring correctness, stability, and long-term maintainability.

---

## Test Environment Model

The test environment is based on:
- Kubernetes (kind)
- Published Shortlink backend Docker image
- External dependencies (PostgreSQL, Redis, etc.) running inside the same cluster

This repository does not:
- Build backend source code
- Control how the cluster is bootstrapped
- Hard-code startup commands or scripts

The only assumption is:

A reachable Kubernetes cluster exists, and the Shortlink backend image is already published and deployed.

This design keeps the test repo environment-agnostic and avoids coupling to early-stage operational details.

---

## Test Scope

This repository is intended to host multiple categories of tests:

1. **API Integration Tests**
   - Validate public API correctness and contract
   - Test CRUD operations, batch operations, and query flows
   - Ensure proper error handling and response codes

2. **Frontend E2E Tests**
   - Verify end-to-end workflows from a user perspective
   - Shared test philosophy and reporting with API tests via Playwright
   - Prepare for future frontend enhancements

3. **Smoke Tests**
   - Quick sanity checks after deployment
   - Validate critical paths and service availability
   - Fast and deterministic tests that block further testing if failed

4. **Load / Pressure Tests**
   - Measure performance under high concurrency
   - Validate stability and scalability of the deployed system
   - Ensure backend handles expected traffic without failure

Unit tests and persistence-level tests remain in the backend repository.

---

## Framework Choice & Trade-offs

### Why Playwright?

We choose Playwright as the primary testing framework for the following reasons:

- **Unified stack for API and E2E testing**
  - First-class support for HTTP API testing
  - Browser-based E2E testing
  - Shared assertions, reporting, and test lifecycle
- **Future-proof frontend testing**
  - Frontend E2E testing will use Playwright
  - Avoids introducing a second testing framework later
- **Strong ecosystem and CI compatibility**
  - Parallel execution
  - Rich reporting
  - Stable CI/CD integration

### Framework Neutrality

Although Playwright is selected, the testing philosophy is framework-independent:

- Validate observable behavior, not implementation
- Treat the system as a black box
- Assert on contracts, not internal state
- Prefer deterministic, repeatable test cases

---

## Smoke Test Strategy

### Purpose

Smoke tests answer one question only:

**Does the Shortlink system basically work after deployment?**

They are not intended to:
- Validate complex business rules
- Cover edge cases
- Replace integration, E2E, or regression tests

If a smoke test fails, the system is considered **not ready** for further testing.

### When Smoke Tests Run

- After a new backend Docker image is deployed
- After Kubernetes manifests are applied or updated
- Before running API integration, E2E, or load tests
- As the first validation stage in CI/CD pipelines

Smoke tests act as a **gatekeeper** for all subsequent test stages.

### Scope of Smoke Tests

- **Service Availability**: Backend reachable, APIs responsive, dependencies healthy
- **Core API Flow (Happy Path)**: Minimal verification of main business flows, e.g., create/list short links
- **Persistence Sanity**: Data can be written and read back successfully

### What Smoke Tests Must Not Do

- Test edge cases or error paths
- Validate pagination or sorting permutations
- Test concurrency, performance, or rate limits
- Depend on pre-seeded data
- Require manual setup or cleanup

### Design Principles

- **Fast** — seconds, not minutes
- **Deterministic** — same input, same result
- **Isolated** — no dependency on execution order
- **Minimal** — one assertion per critical behavior

### Relationship to Other Test Types

| Test Type       | Responsibility                         |
|-----------------|----------------------------------------|
| Smoke Test      | Deployment sanity check                |
| API Integration | Contract and behavior validation       |
| E2E Test        | End-user workflow verification         |
| Load / Pressure | Performance and stability validation   |

Smoke tests always run **first**.

### Failure Handling

- Any smoke test failure blocks further testing
- Failures indicate deployment or environment issues
- Fix the system first, then re-run tests

---

## Repository Responsibilities

- Verifying API correctness and stability
- Catching breaking changes early
- Validating pagination, filtering, and aggregation behavior
- Supporting future frontend and performance testing

It intentionally avoids:
- Sharing backend DTOs or entities
- Depending on internal Java modules
- Encoding business logic inside tests

---

## Backend Dependency Contract

The backend must provide:
- A published Docker image
- Stable public APIs
- Environment configuration via standard Kubernetes mechanisms

The test repository consumes the backend only as a deployed service.

---

## Long-term Vision

- Backend evolves independently
- Tests validate behavior, not structure
- Kubernetes becomes the single source of truth for runtime
- Test code remains stable even when backend internals change

---

## License
[MIT License — © 2026 Rurutia1027](./LICENSE)