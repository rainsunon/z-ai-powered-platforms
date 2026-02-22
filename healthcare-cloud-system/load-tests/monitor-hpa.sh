#!/bin/bash

# Script to monitor HPA scaling during load test
# Run this in a separate terminal while load testing

echo "Monitoring HPA scaling..."
echo "========================="
echo ""

while true; do
  clear
  date
  echo ""
  echo "API Gateway HPA:"
  kubectl get hpa api-gateway-hpa
  echo ""
  echo "Appointment Service HPA:"
  kubectl get hpa appointment-service-hpa
  echo ""
  echo "Current Pods:"
  kubectl get pods | grep -E "api-gateway|appointment-service"
  echo ""
  sleep 5
done