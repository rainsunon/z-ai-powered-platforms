#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ApiGatewayStack } from '../lib/api-gateway-stack';
import { S3Stack } from '../lib/s3-stack';
import { LambdaStack } from '../lib/lambda-stack';

const app = new cdk.App();

// Get environment from context or default to 'dev'
const environment = app.node.tryGetContext('environment') || 'dev';
const account = process.env.CDK_DEFAULT_ACCOUNT || process.env.AWS_ACCOUNT_ID;
const region = process.env.CDK_DEFAULT_REGION || 'us-east-1';

// Stack configuration per environment
const envConfig = {
  dev: {
    stage: 'dev',
    retainResources: false,
    enableXRay: false,
    apiGatewayThrottling: {
      rateLimit: 1000,
      burstLimit: 2000
    },
    s3Lifecycle: {
      transitionToIA: 90,  // Move to Infrequent Access after 90 days
      transitionToGlacier: 180  // Move to Glacier after 180 days
    }
  },
  staging: {
    stage: 'staging',
    retainResources: true,
    enableXRay: true,
    apiGatewayThrottling: {
      rateLimit: 5000,
      burstLimit: 10000
    },
    s3Lifecycle: {
      transitionToIA: 60,
      transitionToGlacier: 120
    }
  },
  prod: {
    stage: 'prod',
    retainResources: true,
    enableXRay: true,
    apiGatewayThrottling: {
      rateLimit: 10000,
      burstLimit: 20000
    },
    s3Lifecycle: {
      transitionToIA: 30,
      transitionToGlacier: 90
    }
  }
};

const config = envConfig[environment as keyof typeof envConfig] || envConfig.dev;

const env = {
  account,
  region
};

// Create S3 Stack (dependencies first)
const s3Stack = new S3Stack(app, `FoodDeliveryS3Stack-${config.stage}`, {
  env,
  stage: config.stage,
  retainResources: config.retainResources,
  lifecycleConfig: config.s3Lifecycle,
  description: `S3 buckets for Food Delivery System - ${config.stage} environment`
});

// Create Lambda Stack
const lambdaStack = new LambdaStack(app, `FoodDeliveryLambdaStack-${config.stage}`, {
  env,
  stage: config.stage,
  userPhotosBucket: s3Stack.userPhotosBucket,
  foodPhotosBucket: s3Stack.foodPhotosBucket,
  description: `Lambda functions for Food Delivery System - ${config.stage} environment`
});

// Create API Gateway Stack (depends on Lambda)
const apiGatewayStack = new ApiGatewayStack(app, `FoodDeliveryApiGatewayStack-${config.stage}`, {
  env,
  stage: config.stage,
  throttlingConfig: config.apiGatewayThrottling,
  enableXRay: config.enableXRay,
  presignedUrlFunction: lambdaStack.presignedUrlFunction,
  description: `API Gateway for Food Delivery System - ${config.stage} environment`
});

// Add dependencies
lambdaStack.addDependency(s3Stack);
apiGatewayStack.addDependency(lambdaStack);

// Add tags to all stacks
const tags = {
  Project: 'FoodDeliverySystem',
  Environment: config.stage,
  ManagedBy: 'CDK',
  CostCenter: 'Engineering'
};

Object.entries(tags).forEach(([key, value]) => {
  cdk.Tags.of(s3Stack).add(key, value);
  cdk.Tags.of(lambdaStack).add(key, value);
  cdk.Tags.of(apiGatewayStack).add(key, value);
});
