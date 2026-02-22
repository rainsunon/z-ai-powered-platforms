import * as cdk from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as logs from 'aws-cdk-lib/aws-logs';
import { Construct } from 'constructs';

export interface ApiGatewayStackProps extends cdk.StackProps {
  stage: string;
  throttlingConfig: {
    rateLimit: number;
    burstLimit: number;
  };
  enableXRay: boolean;
  presignedUrlFunction: lambda.IFunction;
}

export class ApiGatewayStack extends cdk.Stack {
  public readonly api: apigateway.RestApi;

  constructor(scope: Construct, id: string, props: ApiGatewayStackProps) {
    super(scope, id, props);

    const { stage, throttlingConfig, enableXRay, presignedUrlFunction } = props;

    // ===========================
    // CloudWatch Log Group
    // ===========================
    const logGroup = new logs.LogGroup(this, 'ApiGatewayAccessLogs', {
      logGroupName: `/aws/apigateway/food-delivery-${stage}`,
      retention: logs.RetentionDays.ONE_WEEK,
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });

    // ===========================
    // API Gateway REST API
    // ===========================
    this.api = new apigateway.RestApi(this, 'FoodDeliveryApi', {
      restApiName: `food-delivery-api-${stage}`,
      description: `Food Delivery System API Gateway - ${stage} environment`,
      deployOptions: {
        stageName: stage,
        throttlingRateLimit: throttlingConfig.rateLimit,
        throttlingBurstLimit: throttlingConfig.burstLimit,
        loggingLevel: apigateway.MethodLoggingLevel.INFO,
        dataTraceEnabled: stage !== 'prod', // Disable in prod for performance
        tracingEnabled: enableXRay,
        accessLogDestination: new apigateway.LogGroupLogDestination(logGroup),
        accessLogFormat: apigateway.AccessLogFormat.jsonWithStandardFields({
          caller: true,
          httpMethod: true,
          ip: true,
          protocol: true,
          requestTime: true,
          resourcePath: true,
          responseLength: true,
          status: true,
          user: true
        }),
        metricsEnabled: true
      },
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS, // In prod, specify actual origins
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: [
          'Content-Type',
          'X-Amz-Date',
          'Authorization',
          'X-Api-Key',
          'X-Amz-Security-Token',
          'X-User-Id'
        ],
        allowCredentials: true,
        maxAge: cdk.Duration.hours(1)
      },
      cloudWatchRole: true
    });

    // ===========================
    // JWT Authorizer (for user authentication)
    // ===========================
    // Note: This would integrate with your auth-service
    // For now, we'll use API Key authentication as a placeholder
    
    const apiKey = this.api.addApiKey('ApiKey', {
      apiKeyName: `food-delivery-api-key-${stage}`,
      description: `API key for Food Delivery System - ${stage}`,
      enabled: true
    });

    const usagePlan = this.api.addUsagePlan('UsagePlan', {
      name: `food-delivery-usage-plan-${stage}`,
      description: `Usage plan for Food Delivery System - ${stage}`,
      throttle: {
        rateLimit: throttlingConfig.rateLimit,
        burstLimit: throttlingConfig.burstLimit
      },
      quota: {
        limit: 1000000, // 1M requests per month
        period: apigateway.Period.MONTH
      }
    });

    usagePlan.addApiKey(apiKey);
    usagePlan.addApiStage({
      stage: this.api.deploymentStage
    });

    // ===========================
    // Lambda Integration for Presigned URLs
    // ===========================
    const presignedUrlIntegration = new apigateway.LambdaIntegration(presignedUrlFunction, {
      proxy: true,
      integrationResponses: [
        {
          statusCode: '200',
          responseParameters: {
            'method.response.header.Access-Control-Allow-Origin': "'*'"
          }
        }
      ]
    });

    // Upload endpoint
    const uploadResource = this.api.root.addResource('upload');
    const presignedUrlResource = uploadResource.addResource('presigned-url');
    
    presignedUrlResource.addMethod('POST', presignedUrlIntegration, {
      apiKeyRequired: false, // In prod, set to true
      methodResponses: [
        {
          statusCode: '200',
          responseParameters: {
            'method.response.header.Access-Control-Allow-Origin': true
          }
        }
      ]
    });

    // ===========================
    // HTTP Proxy Integrations for Microservices
    // ===========================
    // Note: Replace these URLs with your actual Kubernetes service URLs
    // Format: http://<service-name>.food-delivery.svc.cluster.local:<port>
    
    const serviceUrls = {
      auth: process.env.AUTH_SERVICE_URL || 'http://auth-service.food-delivery.svc.cluster.local:5001',
      restaurant: process.env.RESTAURANT_SERVICE_URL || 'http://restaurant-service.food-delivery.svc.cluster.local:5002',
      order: process.env.ORDER_SERVICE_URL || 'http://order-service.food-delivery.svc.cluster.local:5003',
      notification: process.env.NOTIFICATION_SERVICE_URL || 'http://notification-service.food-delivery.svc.cluster.local:5004',
      payment: process.env.PAYMENT_SERVICE_URL || 'http://payment-service.food-delivery.svc.cluster.local:5005',
      admin: process.env.ADMIN_SERVICE_URL || 'http://admin-service.food-delivery.svc.cluster.local:5006',
      rateLimiter: process.env.RATE_LIMITER_SERVICE_URL || 'http://rate-limiter-service.food-delivery.svc.cluster.local:3000'
    };

    // Helper function to create HTTP proxy integration
    const createHttpProxyIntegration = (serviceUrl: string) => {
      return new apigateway.HttpIntegration(serviceUrl, {
        httpMethod: 'ANY',
        proxy: true,
        options: {
          connectionType: apigateway.ConnectionType.INTERNET,
          requestParameters: {
            'integration.request.path.proxy': 'method.request.path.proxy',
            'integration.request.header.X-Forwarded-For': 'context.identity.sourceIp'
          }
        }
      });
    };

    // Auth Service
    const authResource = this.api.root.addResource('auth');
    const authProxyResource = authResource.addResource('{proxy+}');
    authProxyResource.addMethod('ANY', createHttpProxyIntegration(`${serviceUrls.auth}/api/auth/{proxy}`), {
      apiKeyRequired: false,
      requestParameters: {
        'method.request.path.proxy': true
      }
    });

    // Restaurant Service
    const restaurantResource = this.api.root.addResource('restaurants');
    const restaurantProxyResource = restaurantResource.addResource('{proxy+}');
    restaurantProxyResource.addMethod('ANY', createHttpProxyIntegration(`${serviceUrls.restaurant}/api/restaurants/{proxy}`), {
      apiKeyRequired: false,
      requestParameters: {
        'method.request.path.proxy': true
      }
    });

    // Order Service
    const orderResource = this.api.root.addResource('orders');
    const orderProxyResource = orderResource.addResource('{proxy+}');
    orderProxyResource.addMethod('ANY', createHttpProxyIntegration(`${serviceUrls.order}/api/orders/{proxy}`), {
      apiKeyRequired: false,
      requestParameters: {
        'method.request.path.proxy': true
      }
    });

    // Notification Service
    const notificationResource = this.api.root.addResource('notifications');
    const notificationProxyResource = notificationResource.addResource('{proxy+}');
    notificationProxyResource.addMethod('ANY', createHttpProxyIntegration(`${serviceUrls.notification}/api/notifications/{proxy}`), {
      apiKeyRequired: false,
      requestParameters: {
        'method.request.path.proxy': true
      }
    });

    // Payment Service
    const paymentResource = this.api.root.addResource('payments');
    const paymentProxyResource = paymentResource.addResource('{proxy+}');
    paymentProxyResource.addMethod('ANY', createHttpProxyIntegration(`${serviceUrls.payment}/api/payments/{proxy}`), {
      apiKeyRequired: false,
      requestParameters: {
        'method.request.path.proxy': true
      }
    });

    // Admin Service
    const adminResource = this.api.root.addResource('admin');
    const adminProxyResource = adminResource.addResource('{proxy+}');
    adminProxyResource.addMethod('ANY', createHttpProxyIntegration(`${serviceUrls.admin}/api/admin/{proxy}`), {
      apiKeyRequired: false,
      requestParameters: {
        'method.request.path.proxy': true
      }
    });

    // Rate Limiter Service
    const rateLimiterResource = this.api.root.addResource('rate-limiter');
    const rateLimiterProxyResource = rateLimiterResource.addResource('{proxy+}');
    rateLimiterProxyResource.addMethod('ANY', createHttpProxyIntegration(`${serviceUrls.rateLimiter}/api/rate-limiter/{proxy}`), {
      apiKeyRequired: false,
      requestParameters: {
        'method.request.path.proxy': true
      }
    });

    // Health check endpoint
    const healthResource = this.api.root.addResource('health');
    healthResource.addMethod('GET', new apigateway.MockIntegration({
      integrationResponses: [{
        statusCode: '200',
        responseTemplates: {
          'application/json': JSON.stringify({
            status: 'healthy',
            timestamp: '$context.requestTime',
            stage
          })
        }
      }],
      passthroughBehavior: apigateway.PassthroughBehavior.NEVER,
      requestTemplates: {
        'application/json': '{"statusCode": 200}'
      }
    }), {
      methodResponses: [{ statusCode: '200' }]
    });

    // ===========================
    // CloudFormation Outputs
    // ===========================
    new cdk.CfnOutput(this, 'ApiUrl', {
      value: this.api.url,
      description: 'API Gateway URL',
      exportName: `ApiUrl-${stage}`
    });

    new cdk.CfnOutput(this, 'ApiId', {
      value: this.api.restApiId,
      description: 'API Gateway ID'
    });

    new cdk.CfnOutput(this, 'ApiKeyId', {
      value: apiKey.keyId,
      description: 'API Key ID',
      exportName: `ApiKeyId-${stage}`
    });

    new cdk.CfnOutput(this, 'ApiEndpoints', {
      value: JSON.stringify({
        health: `${this.api.url}health`,
        auth: `${this.api.url}auth`,
        restaurants: `${this.api.url}restaurants`,
        orders: `${this.api.url}orders`,
        notifications: `${this.api.url}notifications`,
        payments: `${this.api.url}payments`,
        admin: `${this.api.url}admin`,
        upload: `${this.api.url}upload/presigned-url`
      }),
      description: 'API Gateway endpoints'
    });
  }
}
