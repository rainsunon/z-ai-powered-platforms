#!/bin/bash

# Deploy Flink job to GCP Dataproc
# Usage: ./deploy-flink.sh <gcp-project-id>

set -e

GCP_PROJECT=${1:-"hc-analytics-1762414359"}
CLUSTER_NAME="healthcare-flink-cluster"
REGION="ap-south-1"

echo "Deploying Flink Analytics Job"
echo "=============================="
echo "Project: $GCP_PROJECT"
echo "Cluster: $CLUSTER_NAME"
echo ""

# Step 1: Build Flink job
echo "Step 1: Building Flink job..."
cd ../microservices/flink-analytics
mvn clean package

if [ ! -f "target/flink-analytics-1.0.0.jar" ]; then
  echo "Error: JAR file not found!"
  exit 1
fi

# Step 2: Create GCS bucket if not exists
echo ""
echo "Step 2: Uploading JAR to GCS..."
BUCKET_NAME="${GCP_PROJECT}-flink-jobs"
gsutil mb -p $GCP_PROJECT gs://$BUCKET_NAME/ 2>/dev/null || echo "Bucket already exists"

# Upload JAR
gsutil cp target/flink-analytics-1.0.0.jar gs://$BUCKET_NAME/

# Step 3: Get MSK bootstrap servers
echo ""
echo "Step 3: Getting Kafka configuration..."
MSK_BROKERS=$(cd ../../terraform/aws && terraform output -raw msk_bootstrap_brokers)

# Step 4: Submit Flink job
echo ""
echo "Step 4: Submitting Flink job to Dataproc..."
gcloud dataproc jobs submit flink \
  --cluster=$CLUSTER_NAME \
  --region=$REGION \
  --project=$GCP_PROJECT \
  --jar=gs://$BUCKET_NAME/flink-analytics-1.0.0.jar \
  --properties=env.KAFKA_BOOTSTRAP_SERVERS=$MSK_BROKERS

echo ""
echo "Flink job submitted successfully!"
echo "Monitor job status:"
echo "gcloud dataproc jobs list --cluster=$CLUSTER_NAME --region=$REGION"