# AWS Infrastructure for Food Delivery System

This folder contains AWS infrastructure code for deploying the food delivery system with API Gateway and S3 storage.

## 📁 Directory Structure

```
aws-infrastructure/
├── cdk-api-gateway/          # AWS CDK for API Gateway
│   ├── package.json
│   ├── cdk.json
│   ├── bin/
│   │   └── api-gateway-app.ts
│   └── lib/
│       ├── api-gateway-stack.ts
│       ├── s3-stack.ts
│       └── lambda-stack.ts
├── cloudformation/           # CloudFormation templates (alternative)
│   ├── api-gateway.yaml
│   ├── s3-buckets.yaml
│   └── iam-roles.yaml
├── lambda-functions/         # Lambda functions for image processing
│   ├── image-processor/
│   └── presigned-url-generator/
├── s3-utils/                 # Shared S3 utilities for services
│   ├── package.json
│   └── index.js
└── README.md                 # This file
```

## 🚀 Deployment Options

### Option 1: AWS CDK (Recommended for Production)
- **Pros:** Type-safe, modular, reusable components
- **Use Case:** Production deployments, CI/CD integration
- **Language:** TypeScript

### Option 2: CloudFormation
- **Pros:** Native AWS, version control, rollback support
- **Use Case:** Traditional AWS deployments
- **Language:** YAML

### Option 3: Terraform (Future)
- **Pros:** Multi-cloud support, state management
- **Use Case:** Multi-cloud deployments

## 📦 What's Included

### 1. API Gateway
- REST API with multiple stages (dev, staging, prod)
- Integration with all microservices
- Request validation and transformation
- Rate limiting and throttling
- CORS configuration
- API keys and usage plans
- Custom domain support

### 2. S3 Buckets
- **food-delivery-user-photos**: User profile pictures and NIC images
- **food-delivery-food-photos**: Restaurant and dish images
- **food-delivery-assets**: Static assets (logos, banners)
- Lifecycle policies for cost optimization
- Versioning for disaster recovery
- Public-read access for image URLs
- CloudFront CDN integration (optional)

### 3. Lambda Functions
- **image-processor**: Resize, compress, and optimize uploaded images
- **presigned-url-generator**: Generate secure upload URLs with expiration

### 4. IAM Roles & Policies
- Service-specific roles with least privilege
- S3 bucket policies for secure access
- API Gateway execution roles

## 🛠️ Prerequisites

### For CDK Deployment
```bash
# Install AWS CDK globally
npm install -g aws-cdk

# Install dependencies
cd cdk-api-gateway
npm install

# Configure AWS credentials
aws configure
```

### For CloudFormation Deployment
```bash
# Ensure AWS CLI is installed and configured
aws --version
aws configure
```

## 📋 Quick Start

### 1. Deploy with CDK

```bash
# Navigate to CDK folder
cd cdk-api-gateway

# Install dependencies
npm install

# Bootstrap CDK (first time only)
cdk bootstrap

# Review changes
cdk diff

# Deploy all stacks
cdk deploy --all

# Deploy specific stack
cdk deploy ApiGatewayStack
cdk deploy S3Stack
```

### 2. Deploy with CloudFormation

```bash
# Navigate to cloudformation folder
cd cloudformation

# Create S3 buckets
aws cloudformation create-stack \
  --stack-name food-delivery-s3 \
  --template-body file://s3-buckets.yaml \
  --parameters file://parameters-prod.json

# Create API Gateway
aws cloudformation create-stack \
  --stack-name food-delivery-api-gateway \
  --template-body file://api-gateway.yaml \
  --capabilities CAPABILITY_IAM
```

### 3. Configure Services

After deployment, update service environment variables:

```bash
# Get API Gateway URL
export API_GATEWAY_URL=$(aws cloudformation describe-stacks \
  --stack-name food-delivery-api-gateway \
  --query 'Stacks[0].Outputs[?OutputKey==`ApiUrl`].OutputValue' \
  --output text)

# Get S3 bucket names
export S3_USER_PHOTOS_BUCKET=$(aws cloudformation describe-stacks \
  --stack-name food-delivery-s3 \
  --query 'Stacks[0].Outputs[?OutputKey==`UserPhotosBucket`].OutputValue' \
  --output text)

# Update Kubernetes secrets
kubectl create secret generic aws-config \
  --from-literal=AWS_REGION=us-east-1 \
  --from-literal=S3_USER_PHOTOS_BUCKET=$S3_USER_PHOTOS_BUCKET \
  --from-literal=S3_FOOD_PHOTOS_BUCKET=$S3_FOOD_PHOTOS_BUCKET \
  --namespace=food-delivery
```

## 🔗 API Gateway Endpoints

### Root URL
```
https://{api-id}.execute-api.{region}.amazonaws.com/{stage}
```

### Service Endpoints

| Service | Path | Kubernetes Target |
|---------|------|-------------------|
| Auth Service | `/auth/*` | `http://auth-service.food-delivery.svc.cluster.local:5001` |
| Restaurant Service | `/restaurants/*` | `http://restaurant-service.food-delivery.svc.cluster.local:5002` |
| Order Service | `/orders/*` | `http://order-service.food-delivery.svc.cluster.local:5003` |
| Notification Service | `/notifications/*` | `http://notification-service.food-delivery.svc.cluster.local:5004` |
| Payment Service | `/payments/*` | `http://payment-service.food-delivery.svc.cluster.local:5005` |
| Admin Service | `/admin/*` | `http://admin-service.food-delivery.svc.cluster.local:5006` |
| Rate Limiter Service | `/rate-limiter/*` | `http://rate-limiter-service.food-delivery.svc.cluster.local:3000` |

### Special Endpoints

| Endpoint | Purpose |
|----------|---------|
| `/upload/presigned-url` | Get presigned URL for direct S3 upload |
| `/health` | Health check all services |
| `/docs` | API documentation (Swagger UI) |

## 🖼️ S3 Photo Upload Flow

### Client-Side Upload (Recommended)

```javascript
// 1. Get presigned URL from API Gateway
const response = await axios.post('https://api.example.com/upload/presigned-url', {
  fileName: 'profile.jpg',
  fileType: 'image/jpeg',
  folder: 'profile-pictures'
});

const { uploadUrl, fileUrl } = response.data;

// 2. Upload directly to S3
await axios.put(uploadUrl, file, {
  headers: { 'Content-Type': 'image/jpeg' }
});

// 3. Save fileUrl to user profile
await axios.patch('/api/auth/me', {
  profilePicture: fileUrl
});
```

### Server-Side Upload (Fallback)

```javascript
// Service uploads to S3 using AWS SDK
const { uploadToS3 } = require('aws-infrastructure/s3-utils');

const imageUrl = await uploadToS3({
  file: req.file.buffer,
  fileName: `profile-${userId}.jpg`,
  bucket: process.env.S3_USER_PHOTOS_BUCKET,
  folder: 'profile-pictures'
});
```

## 📊 Cost Estimation

### Monthly Costs (Estimated)

| Resource | Usage | Cost |
|----------|-------|------|
| API Gateway | 10M requests | $35 |
| S3 Storage | 100GB | $2.30 |
| Data Transfer | 100GB out | $9 |
| Lambda | 1M invocations | $0.20 |
| **Total** | | **~$46.50/month** |

### Cost Optimization Tips
1. Enable S3 Intelligent-Tiering
2. Set lifecycle policies to move old images to Glacier
3. Use CloudFront CDN to reduce data transfer costs
4. Enable API Gateway caching
5. Compress images before upload

## 🔐 Security Features

### API Gateway
- ✅ API keys for service-to-service auth
- ✅ AWS IAM authorization
- ✅ JWT authorizer for user requests
- ✅ Request throttling and rate limiting
- ✅ WAF integration for DDoS protection

### S3 Buckets
- ✅ Bucket policies with least privilege
- ✅ Encryption at rest (AES-256)
- ✅ Encryption in transit (HTTPS only)
- ✅ Versioning for disaster recovery
- ✅ Access logging enabled
- ✅ Block public ACLs

### IAM Roles
- ✅ Service-specific roles
- ✅ Temporary credentials via STS
- ✅ MFA for sensitive operations
- ✅ CloudTrail logging all API calls

## 🔍 Monitoring & Logging

### CloudWatch Dashboards
- API Gateway request/error metrics
- Lambda function duration and errors
- S3 bucket size and request metrics

### Alarms
- API Gateway 5xx errors > 1%
- Lambda function errors > 5
- S3 bucket size > 500GB
- API Gateway throttling > 100 requests/min

### X-Ray Tracing
- End-to-end request tracing
- Performance bottleneck identification
- Error root cause analysis

## 🧪 Testing

### Test API Gateway

```bash
# Get API Gateway URL
API_URL=$(aws cloudformation describe-stacks \
  --stack-name food-delivery-api-gateway \
  --query 'Stacks[0].Outputs[?OutputKey==`ApiUrl`].OutputValue' \
  --output text)

# Test auth service
curl "${API_URL}/auth/health"

# Test with authentication
curl -H "Authorization: Bearer ${TOKEN}" \
  "${API_URL}/orders"
```

### Test S3 Upload

```bash
# Upload test file
aws s3 cp test-image.jpg \
  s3://food-delivery-user-photos/test/test-image.jpg

# Verify upload
aws s3 ls s3://food-delivery-user-photos/test/

# Get public URL
echo "https://food-delivery-user-photos.s3.amazonaws.com/test/test-image.jpg"
```

## 📚 Additional Resources

- [AWS CDK Documentation](https://docs.aws.amazon.com/cdk/)
- [API Gateway Developer Guide](https://docs.aws.amazon.com/apigateway/)
- [S3 Best Practices](https://docs.aws.amazon.com/AmazonS3/latest/userguide/best-practices.html)
- [Lambda Best Practices](https://docs.aws.amazon.com/lambda/latest/dg/best-practices.html)

## 🤝 Support

For issues or questions:
1. Check the documentation in each subfolder
2. Review CloudFormation/CDK logs
3. Check CloudWatch Logs for Lambda functions
4. Contact DevOps team

## 📝 License

This infrastructure code is part of the Food Delivery System project.
