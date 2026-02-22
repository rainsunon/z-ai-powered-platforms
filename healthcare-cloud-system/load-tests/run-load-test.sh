#!/bin/bash

# Script to run k6 load tests
# Usage: ./run-load-test.sh <api-gateway-url>

API_GATEWAY_URL=${1:-"http://localhost"}

echo "Starting load test against: $API_GATEWAY_URL"
echo "==========================================="

# Run the load test
k6 run --out json=results.json \
  -e API_GATEWAY_URL=$API_GATEWAY_URL \
  load-test.js

echo ""
echo "Load test completed!"
echo "Results saved to: results.json"
echo ""
echo "To analyze results, check Grafana dashboards or run:"
echo "cat results.json | jq '.metrics'"