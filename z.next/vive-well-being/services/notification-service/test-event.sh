#!/bin/bash
# Test sending an event to the notification publisher API.
# Set API_KEY env var or replace the default below.

API_KEY="${API_KEY:-your-api-key-here}"

curl -X POST http://localhost:3001/api/v1/events \
  -H "Content-Type: application/json" \
  -H "x-api-key: ${API_KEY}" \
  -d '{
    "event_id": "evt_'$(date +%s)'",
    "event_type": "user.welcome",
    "user_id": "user_001",
    "payload": {
      "subject": "Welcome to VIVE Well-Being!",
      "body": "Thank you for joining. We are excited to have you on board.",
      "metadata": {
        "email": "test@example.com"
      }
    }
  }'

echo ""
