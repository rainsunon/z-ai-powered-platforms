# AWS Infrastructure Deployment Guide

This guide covers deploying the AWS infrastructure (API Gateway, S3 buckets, Lambda functions) and migrating from Firebase Storage to AWS S3.

## Table of Contents
- [Prerequisites](#prerequisites)
- [AWS Account Setup](#aws-account-setup)
- [CDK Deployment](#cdk-deployment)
- [Service Configuration](#service-configuration)
- [Migration from Firebase](#migration-from-firebase)
- [Testing & Validation](#testing--validation)
- [Troubleshooting](#troubleshooting)
- [Rollback Procedures](#rollback-procedures)

---

## Prerequisites

### Required Tools
- **AWS CLI** (v2.x or later)
- **AWS CDK** (v2.120.0 or later)
- **Node.js** (v20.x or later)
- **kubectl** (for Kubernetes secret updates)
- **Docker** (for building Lambda layers)

### Install AWS CLI
```bash
# macOS
brew install awscli

# Verify installation
aws --version
```

### Install AWS CDK
```bash
npm install -g aws-cdk@2.120.0

# Verify installation
cdk --version
```

---

## AWS Account Setup

### 1. Configure AWS Credentials

#### Option A: AWS CLI Configuration
```bash
aws configure

# Enter when prompted:
# AWS Access Key ID: YOUR_ACCESS_KEY
# AWS Secret Access Key: YOUR_SECRET_KEY
# Default region name: us-east-1
# Default output format: json
```

#### Option B: Environment Variables
```bash
export AWS_ACCESS_KEY_ID="YOUR_ACCESS_KEY"
export AWS_SECRET_ACCESS_KEY="YOUR_SECRET_KEY"
export AWS_REGION="us-east-1"
```

#### Option C: AWS Profile
```bash
# Create named profile
aws configure --profile food-delivery

# Use profile with CDK
export AWS_PROFILE=food-delivery
```

### 2. Verify AWS Account Access
```bash
# Get current caller identity
aws sts get-caller-identity

# Expected output:
# {
#   "UserId": "AIDAXXXXXXXXXXXXXXXXX",
#   "Account": "123456789012",
#   "Arn": "arn:aws:iam::123456789012:user/your-user"
# }
```

### 3. Set AWS Account ID
```bash
# Get your AWS account ID
export CDK_DEFAULT_ACCOUNT=$(aws sts get-caller-identity --query Account --output text)
export CDK_DEFAULT_REGION="us-east-1"

echo "Account: $CDK_DEFAULT_ACCOUNT"
echo "Region: $CDK_DEFAULT_REGION"
```

---

## CDK Deployment

### 1. Install Dependencies

```bash
cd aws-infrastructure/cdk-api-gateway

# Install CDK dependencies
npm install

# Install S3 utils dependencies (needed by services)
cd ../s3-utils
npm install

cd ../cdk-api-gateway
```

### 2. Bootstrap CDK (First Time Only)

**Important**: This creates a CDK Toolkit stack in your AWS account. Only run once per account/region.

```bash
cdk bootstrap aws://$CDK_DEFAULT_ACCOUNT/$CDK_DEFAULT_REGION

# You should see:
# ✅  Environment aws://123456789012/us-east-1 bootstrapped.
```

### 3. Review Changes (Dry Run)

```bash
# Set environment (dev, staging, or prod)
export DEPLOYMENT_ENV=dev

# Show what will be deployed
cdk diff --all --context environment=$DEPLOYMENT_ENV

# Expected output shows:
# - S3 buckets to be created
# - Lambda functions to be created
# - API Gateway resources to be created
```

### 4. Deploy Infrastructure

#### Option A: Deploy All Stacks
```bash
# Deploy everything (dev environment)
cdk deploy --all --context environment=dev --require-approval never

# Deploy to staging
cdk deploy --all --context environment=staging --require-approval never

# Deploy to production (requires approval for safety)
cdk deploy --all --context environment=prod
```

#### Option B: Deploy Individual Stacks
```bash
# Deploy only S3 buckets
cdk deploy FoodDeliveryS3Stack-dev --context environment=dev

# Deploy Lambda functions (requires S3 stack first)
cdk deploy FoodDeliveryLambdaStack-dev --context environment=dev

# Deploy API Gateway (requires Lambda stack)
cdk deploy FoodDeliveryApiGatewayStack-dev --context environment=dev
```

### 5. Deployment Output

After successful deployment, note these outputs:

```bash
# Save these values - you'll need them for service configuration

Outputs:
FoodDeliveryS3Stack-dev.UserPhotosBucketName = food-delivery-user-photos-dev-123456789012
FoodDeliveryS3Stack-dev.FoodPhotosBucketName = food-delivery-food-photos-dev-123456789012
FoodDeliveryS3Stack-dev.AssetsBucketName = food-delivery-assets-dev-123456789012

FoodDeliveryLambdaStack-dev.PresignedUrlFunctionArn = arn:aws:lambda:us-east-1:123456789012:function:PresignedUrlFunction-dev
FoodDeliveryLambdaStack-dev.ImageProcessorFunctionArn = arn:aws:lambda:us-east-1:123456789012:function:ImageProcessorFunction-dev

FoodDeliveryApiGatewayStack-dev.ApiGatewayUrl = https://abc123def4.execute-api.us-east-1.amazonaws.com/dev
FoodDeliveryApiGatewayStack-dev.ApiGatewayId = abc123def4
```

### 6. Verify Deployment

```bash
# List all stacks
cdk list --context environment=dev

# Check stack status in AWS
aws cloudformation list-stacks --stack-status-filter CREATE_COMPLETE UPDATE_COMPLETE
```

---

## Service Configuration

### 1. Update Kubernetes Secrets

**Create or update secrets with S3 bucket names and API Gateway URL:**

```bash
# Get values from CDK outputs
export USER_PHOTOS_BUCKET="food-delivery-user-photos-dev-123456789012"
export FOOD_PHOTOS_BUCKET="food-delivery-food-photos-dev-123456789012"
export API_GATEWAY_URL="https://abc123def4.execute-api.us-east-1.amazonaws.com/dev"

# Create Kubernetes secret
kubectl create secret generic aws-s3-config \
  --from-literal=S3_USER_PHOTOS_BUCKET=$USER_PHOTOS_BUCKET \
  --from-literal=S3_FOOD_PHOTOS_BUCKET=$FOOD_PHOTOS_BUCKET \
  --from-literal=API_GATEWAY_URL=$API_GATEWAY_URL \
  --from-literal=AWS_REGION=us-east-1 \
  --namespace=food-delivery \
  --dry-run=client -o yaml > kubernetes/aws-s3-secret.yaml

# Apply secret
kubectl apply -f kubernetes/aws-s3-secret.yaml
```

### 2. Update Service Deployments

**Update each service deployment to include AWS environment variables:**

```yaml
# Example: kubernetes/auth-service.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: auth-service
spec:
  template:
    spec:
      containers:
      - name: auth-service
        image: your-registry/auth-service:latest
        env:
        # Existing env vars...
        - name: S3_USER_PHOTOS_BUCKET
          valueFrom:
            secretKeyRef:
              name: aws-s3-config
              key: S3_USER_PHOTOS_BUCKET
        - name: S3_FOOD_PHOTOS_BUCKET
          valueFrom:
            secretKeyRef:
              name: aws-s3-config
              key: S3_FOOD_PHOTOS_BUCKET
        - name: API_GATEWAY_URL
          valueFrom:
            secretKeyRef:
              name: aws-s3-config
              key: API_GATEWAY_URL
        - name: AWS_REGION
          valueFrom:
            secretKeyRef:
              name: aws-s3-config
              key: AWS_REGION
        # AWS credentials (use IAM roles in production)
        - name: AWS_ACCESS_KEY_ID
          valueFrom:
            secretKeyRef:
              name: aws-credentials
              key: access-key-id
        - name: AWS_SECRET_ACCESS_KEY
          valueFrom:
            secretKeyRef:
              name: aws-credentials
              key: secret-access-key
```

**Apply updated deployments:**
```bash
kubectl apply -f kubernetes/auth-service.yaml
kubectl apply -f kubernetes/restaurant-service.yaml
```

### 3. Configure AWS Credentials for Services

#### Option A: AWS IAM Roles for Service Accounts (Recommended for EKS)

```bash
# Create OIDC provider for EKS cluster
eksctl utils associate-iam-oidc-provider --cluster=food-delivery-cluster --approve

# Create IAM role for auth service
eksctl create iamserviceaccount \
  --name auth-service-sa \
  --namespace food-delivery \
  --cluster food-delivery-cluster \
  --attach-policy-arn arn:aws:iam::aws:policy/AmazonS3FullAccess \
  --approve

# Update deployment to use service account
# (Add: serviceAccountName: auth-service-sa)
```

#### Option B: AWS Access Keys (Development/Testing)

```bash
# Create Kubernetes secret with AWS credentials
kubectl create secret generic aws-credentials \
  --from-literal=access-key-id=$AWS_ACCESS_KEY_ID \
  --from-literal=secret-access-key=$AWS_SECRET_ACCESS_KEY \
  --namespace=food-delivery
```

### 4. Update Docker Images

**Rebuild and push service images with S3 utilities:**

```bash
# Auth service
cd auth
docker build -t your-registry/auth-service:v2 .
docker push your-registry/auth-service:v2

# Restaurant service
cd ../restaurant
docker build -t your-registry/restaurant-service:v2 .
docker push your-registry/restaurant-service:v2

# Update Kubernetes deployments with new image tags
kubectl set image deployment/auth-service auth-service=your-registry/auth-service:v2 -n food-delivery
kubectl set image deployment/restaurant-service restaurant-service=your-registry/restaurant-service:v2 -n food-delivery
```

---

## Migration from Firebase

### Strategy 1: Gradual Migration (Recommended)

**Support both Firebase and S3 during transition period:**

```javascript
// Example: Update auth controller
const { uploadProfilePicture } = require('../utils/s3Upload');
const { uploadBytes, getDownloadURL } = require('firebase/storage');

async function updateProfilePicture(req, res) {
  try {
    const useS3 = process.env.USE_S3 === 'true';
    
    if (useS3) {
      // New S3 upload
      const s3Url = await uploadProfilePicture(req.file.buffer, req.file.originalname, req.user.id);
      await User.updateOne({ _id: req.user.id }, { profilePicture: s3Url });
    } else {
      // Old Firebase upload (fallback)
      const storageRef = ref(storage, `users/${req.user.id}/profile.jpg`);
      const snapshot = await uploadBytes(storageRef, req.file.buffer);
      const firebaseUrl = await getDownloadURL(snapshot.ref);
      await User.updateOne({ _id: req.user.id }, { profilePicture: firebaseUrl });
    }
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

**Enable S3 gradually:**
```bash
# Start with auth service
kubectl set env deployment/auth-service USE_S3=true -n food-delivery

# Monitor for 24-48 hours, then enable for restaurant service
kubectl set env deployment/restaurant-service USE_S3=true -n food-delivery
```

### Strategy 2: Bulk Migration Script

**Create migration script to move existing Firebase images to S3:**

```javascript
// scripts/migrate-firebase-to-s3.js
const { migrateFromFirebase } = require('../restaurant/utils/s3Upload');
const Restaurant = require('../restaurant/model/Restaurant');

async function migrateRestaurants() {
  const restaurants = await Restaurant.find({ image: /firebasestorage/ });
  
  console.log(`Found ${restaurants.length} restaurants to migrate`);
  
  for (const restaurant of restaurants) {
    try {
      // Migrate main image
      if (restaurant.image) {
        const newUrl = await migrateFromFirebase(
          restaurant.image,
          restaurant._id.toString(),
          'restaurant'
        );
        restaurant.image = newUrl;
      }
      
      // Migrate dish images
      for (const dish of restaurant.dishes) {
        if (dish.image && dish.image.includes('firebasestorage')) {
          dish.image = await migrateFromFirebase(
            dish.image,
            restaurant._id.toString(),
            'dish'
          );
        }
      }
      
      await restaurant.save();
      console.log(`✅ Migrated: ${restaurant.name}`);
    } catch (error) {
      console.error(`❌ Failed: ${restaurant.name}`, error.message);
    }
  }
}

migrateRestaurants().then(() => console.log('Migration complete'));
```

**Run migration:**
```bash
node scripts/migrate-firebase-to-s3.js
```

---

## Testing & Validation

### 1. Test API Gateway Health

```bash
export API_URL="https://abc123def4.execute-api.us-east-1.amazonaws.com/dev"

# Health check
curl $API_URL/health

# Expected: {"status":"ok","timestamp":1234567890}
```

### 2. Test Service Routes

```bash
# Auth service health
curl $API_URL/auth/health

# Restaurant service health
curl $API_URL/restaurants/health

# Order service health
curl $API_URL/orders/health
```

### 3. Test Presigned URL Generation

```bash
# Get presigned URL for upload
curl -X POST $API_URL/upload/presigned-url \
  -H "Content-Type: application/json" \
  -d '{
    "fileName": "test-image.jpg",
    "fileType": "image/jpeg",
    "folder": "test",
    "bucketType": "user"
  }'

# Response:
# {
#   "uploadUrl": "https://s3.amazonaws.com/...",
#   "fileUrl": "https://food-delivery-user-photos-dev-123456789012.s3.amazonaws.com/test/...",
#   "key": "test/...",
#   "expiresIn": 300
# }
```

### 4. Test File Upload to S3

```bash
# Upload test image using presigned URL
curl -X PUT "PRESIGNED_URL_FROM_ABOVE" \
  -H "Content-Type: image/jpeg" \
  --data-binary @test-image.jpg

# Verify file exists in S3
aws s3 ls s3://food-delivery-user-photos-dev-123456789012/test/ --recursive
```

### 5. Test Service Image Upload

```bash
# Login and get JWT token
TOKEN=$(curl -X POST $API_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' \
  | jq -r '.token')

# Upload profile picture
curl -X POST $API_URL/auth/profile/picture \
  -H "Authorization: Bearer $TOKEN" \
  -F "image=@profile.jpg"

# Verify S3 URL in response
```

### 6. Monitor CloudWatch Logs

```bash
# Presigned URL Lambda logs
aws logs tail /aws/lambda/PresignedUrlFunction-dev --follow

# Watch for any errors
aws logs filter-log-events \
  --log-group-name /aws/lambda/PresignedUrlFunction-dev \
  --filter-pattern "ERROR"
```

---

## Troubleshooting

### Issue: CDK Deployment Fails

```bash
# Check for synthesis errors
cdk synth --context environment=dev

# Validate CloudFormation template
cdk synth FoodDeliveryS3Stack-dev --context environment=dev > template.yaml
aws cloudformation validate-template --template-body file://template.yaml
```

### Issue: Lambda Function Timeout

```bash
# Increase timeout in lib/lambda-stack.ts
timeout: cdk.Duration.seconds(30), // Increase from 10 to 30

# Redeploy
cdk deploy FoodDeliveryLambdaStack-dev --context environment=dev
```

### Issue: S3 Access Denied

```bash
# Check bucket policy
aws s3api get-bucket-policy --bucket food-delivery-user-photos-dev-123456789012

# Verify IAM permissions
aws iam simulate-principal-policy \
  --policy-source-arn arn:aws:iam::123456789012:role/LambdaExecutionRole \
  --action-names s3:PutObject s3:GetObject \
  --resource-arns arn:aws:s3:::food-delivery-user-photos-dev-123456789012/*
```

### Issue: API Gateway 502/504 Errors

```bash
# Check if services are running
kubectl get pods -n food-delivery

# Verify service endpoints
kubectl get svc -n food-delivery

# Test backend service directly (port-forward)
kubectl port-forward svc/auth-service 5001:5001 -n food-delivery
curl http://localhost:5001/health
```

### Issue: CORS Errors

```javascript
// Update API Gateway CORS in lib/api-gateway-stack.ts
defaultCorsPreflightOptions: {
  allowOrigins: ['https://your-frontend-domain.com'], // Don't use '*' in production
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowHeaders: ['Content-Type', 'Authorization', 'X-Api-Key'],
  allowCredentials: true
}
```

---

## Rollback Procedures

### Rollback CDK Stack

```bash
# List all stack versions
aws cloudformation list-stacks --query 'StackSummaries[?contains(StackName, `FoodDelivery`)]'

# Rollback to previous version (if update failed)
aws cloudformation cancel-update-stack --stack-name FoodDeliveryApiGatewayStack-dev

# Delete stack completely
cdk destroy FoodDeliveryApiGatewayStack-dev --context environment=dev
```

### Rollback Service Images

```bash
# Revert to previous image version
kubectl rollout undo deployment/auth-service -n food-delivery

# Or specify revision
kubectl rollout undo deployment/auth-service --to-revision=1 -n food-delivery

# Check rollout status
kubectl rollout status deployment/auth-service -n food-delivery
```

### Rollback to Firebase Storage

```bash
# Disable S3
kubectl set env deployment/auth-service USE_S3=false -n food-delivery
kubectl set env deployment/restaurant-service USE_S3=false -n food-delivery

# Services will fall back to Firebase Storage
```

### Emergency S3 Data Recovery

```bash
# S3 versioning is enabled - recover deleted files
aws s3api list-object-versions \
  --bucket food-delivery-user-photos-dev-123456789012 \
  --prefix profile-pictures/

# Restore specific version
aws s3api copy-object \
  --bucket food-delivery-user-photos-dev-123456789012 \
  --copy-source food-delivery-user-photos-dev-123456789012/profile-pictures/123/image.jpg?versionId=VERSION_ID \
  --key profile-pictures/123/image.jpg
```

---

## Cost Monitoring

### Set Up Billing Alerts

```bash
# Create SNS topic for alerts
aws sns create-topic --name billing-alerts

# Subscribe to topic
aws sns subscribe \
  --topic-arn arn:aws:sns:us-east-1:123456789012:billing-alerts \
  --protocol email \
  --notification-endpoint your-email@example.com

# Create billing alarm (triggers at $50/month)
aws cloudwatch put-metric-alarm \
  --alarm-name billing-alarm-50 \
  --alarm-description "Billing exceeded $50" \
  --metric-name EstimatedCharges \
  --namespace AWS/Billing \
  --statistic Maximum \
  --period 21600 \
  --threshold 50 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 1 \
  --alarm-actions arn:aws:sns:us-east-1:123456789012:billing-alerts
```

### Monitor Costs

```bash
# Check current month costs
aws ce get-cost-and-usage \
  --time-period Start=2024-01-01,End=2024-01-31 \
  --granularity MONTHLY \
  --metrics BlendedCost \
  --group-by Type=SERVICE

# Expected monthly costs (dev environment):
# - S3: ~$5-10 (storage + requests)
# - API Gateway: ~$3.50 (1M requests)
# - Lambda: ~$0.20 (assuming 100K invocations)
# - Data Transfer: ~$5-10
# Total: ~$15-25/month
```

---

## Production Checklist

Before deploying to production:

- [ ] Use IAM roles (not access keys) for Kubernetes pods
- [ ] Enable CloudFront CDN for S3 buckets
- [ ] Configure specific CORS origins (not wildcard)
- [ ] Enable AWS WAF on API Gateway
- [ ] Set up CloudWatch alarms for errors/latency
- [ ] Enable S3 access logging
- [ ] Configure API Gateway custom domain with SSL
- [ ] Test disaster recovery procedures
- [ ] Document incident response procedures
- [ ] Enable AWS CloudTrail for audit logs
- [ ] Review and minimize IAM permissions
- [ ] Set up automated backups for S3 buckets
- [ ] Configure lifecycle policies for log retention
- [ ] Load test API Gateway with expected traffic

---

## Support & Resources

- **AWS CDK Documentation**: https://docs.aws.amazon.com/cdk/
- **API Gateway Documentation**: https://docs.aws.amazon.com/apigateway/
- **S3 Documentation**: https://docs.aws.amazon.com/s3/
- **AWS Support**: Open ticket in AWS Console
- **Project Issues**: File issue in GitHub repository

---

## Next Steps

1. Deploy to **dev environment** and test thoroughly
2. Once validated, deploy to **staging** for integration testing
3. After staging validation, deploy to **production**
4. Monitor CloudWatch metrics for 48 hours
5. Complete Firebase to S3 migration using bulk migration script
6. Decommission Firebase Storage once migration is complete
