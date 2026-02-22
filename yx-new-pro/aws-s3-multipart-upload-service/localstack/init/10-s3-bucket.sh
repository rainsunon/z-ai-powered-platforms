#!/usr/bin/env bash
set -euo pipefail

BUCKET_NAME=${S3_BUCKET:-s3-demo-uploads}
REGION=${AWS_REGION:-eu-central-1}

awslocal s3api create-bucket   --bucket "$BUCKET_NAME"   --create-bucket-configuration LocationConstraint="$REGION"   >/dev/null 2>&1 || true

# Browser multipart PUTs need ETag exposed. Keep origins tight in real env.
awslocal s3api put-bucket-cors   --bucket "$BUCKET_NAME"   --cors-configuration '{
    "CORSRules": [{
      "AllowedOrigins": ["http://localhost:5173"],
      "AllowedMethods": ["PUT","GET","HEAD"],
      "AllowedHeaders": ["*"],
      "ExposeHeaders": ["ETag"],
      "MaxAgeSeconds": 3000
    }]
  }' >/dev/null

echo "LocalStack S3 bucket ready: ${BUCKET_NAME}"
