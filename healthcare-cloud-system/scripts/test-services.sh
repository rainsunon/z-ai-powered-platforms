#!/bin/bash

# Test all microservices are working
# Usage: ./test-services.sh <api-gateway-url>

API_GATEWAY=${1:-"http://localhost"}

echo "Testing Healthcare Cloud System"
echo "==============================="
echo "API Gateway: $API_GATEWAY"
echo ""

# Test 1: Health checks
echo "Test 1: Health Checks"
echo "---------------------"
curl -s $API_GATEWAY/health | jq '.'

# Test 2: User registration
echo ""
echo "Test 2: User Registration"
echo "-------------------------"
REGISTER_RESPONSE=$(curl -s -X POST $API_GATEWAY/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "name": "Test User",
    "phone": "555-1234",
    "password": "testpass123"
  }')

echo $REGISTER_RESPONSE | jq '.'
TOKEN=$(echo $REGISTER_RESPONSE | jq -r '.access_token')

# Test 3: Create appointment
echo ""
echo "Test 3: Create Appointment"
echo "--------------------------"
curl -s -X POST $API_GATEWAY/api/appointments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "patientId": 1,
    "doctorId": 1,
    "appointmentDatetime": "2025-12-01T10:00:00Z",
    "reason": "Checkup"
  }' | jq '.'

# Test 4: Process payment
echo ""
echo "Test 4: Process Payment"
echo "-----------------------"
curl -s -X POST $API_GATEWAY/api/payments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "appointment_id": 1,
    "user_id": 1,
    "amount": 150.00,
    "payment_method": "card"
  }' | jq '.'

echo ""
echo "All tests completed!"