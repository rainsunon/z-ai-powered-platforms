#!/bin/bash
# Deploy Flink job to GCP Dataproc

CLUSTER_NAME="healthcare-flink-cluster"
REGION="ap-south-1"
PROJECT_ID="your-gcp-project-id"
JAR_FILE="target/flink-analytics-1.0.0.jar"
GCS_BUCKET="gs://your-bucket-name"

# Upload JAR to GCS
echo "Uploading JAR to GCS..."
gsutil cp $JAR_FILE $GCS_BUCKET/flink-jobs/

# Submit Flink job to Dataproc
echo "Submitting Flink job to Dataproc..."
gcloud dataproc jobs submit flink \
    --cluster=$CLUSTER_NAME \
    --region=$REGION \
    --project=$PROJECT_ID \
    --jar=$GCS_BUCKET/flink-jobs/flink-analytics-1.0.0.jar \
    -- \
    --kafka-bootstrap-servers YOUR_MSK_BOOTSTRAP_SERVERS

echo "Flink job submitted successfully!"