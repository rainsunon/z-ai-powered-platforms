import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export interface S3StackProps extends cdk.StackProps {
  stage: string;
  retainResources: boolean;
  lifecycleConfig: {
    transitionToIA: number;
    transitionToGlacier: number;
  };
}

export class S3Stack extends cdk.Stack {
  public readonly userPhotosBucket: s3.Bucket;
  public readonly foodPhotosBucket: s3.Bucket;
  public readonly assetsBucket: s3.Bucket;

  constructor(scope: Construct, id: string, props: S3StackProps) {
    super(scope, id, props);

    const { stage, retainResources, lifecycleConfig } = props;

    // Removal policy based on environment
    const removalPolicy = retainResources
      ? cdk.RemovalPolicy.RETAIN
      : cdk.RemovalPolicy.DESTROY;

    // ===========================
    // User Photos Bucket
    // ===========================
    this.userPhotosBucket = new s3.Bucket(this, 'UserPhotosBucket', {
      bucketName: `food-delivery-user-photos-${stage}-${this.account}`,
      versioned: true,
      encryption: s3.BucketEncryption.S3_MANAGED,
      blockPublicAccess: new s3.BlockPublicAccess({
        blockPublicAcls: true,
        blockPublicPolicy: false,  // Allow public read for images
        ignorePublicAcls: true,
        restrictPublicBuckets: false
      }),
      cors: [
        {
          allowedHeaders: ['*'],
          allowedMethods: [
            s3.HttpMethods.GET,
            s3.HttpMethods.PUT,
            s3.HttpMethods.POST,
            s3.HttpMethods.DELETE,
            s3.HttpMethods.HEAD
          ],
          allowedOrigins: ['*'], // In production, specify actual origins
          exposedHeaders: ['ETag'],
          maxAge: 3000
        }
      ],
      lifecycleRules: [
        {
          id: 'TransitionToIA',
          enabled: true,
          transitions: [
            {
              storageClass: s3.StorageClass.INFREQUENT_ACCESS,
              transitionAfter: cdk.Duration.days(lifecycleConfig.transitionToIA)
            }
          ]
        },
        {
          id: 'TransitionToGlacier',
          enabled: true,
          transitions: [
            {
              storageClass: s3.StorageClass.GLACIER,
              transitionAfter: cdk.Duration.days(lifecycleConfig.transitionToGlacier)
            }
          ]
        },
        {
          id: 'DeleteOldVersions',
          enabled: true,
          noncurrentVersionExpiration: cdk.Duration.days(90)
        }
      ],
      removalPolicy,
      autoDeleteObjects: !retainResources
    });

    // Add bucket policy for public read access
    this.userPhotosBucket.addToResourcePolicy(
      new iam.PolicyStatement({
        sid: 'PublicReadGetObject',
        effect: iam.Effect.ALLOW,
        principals: [new iam.AnyPrincipal()],
        actions: ['s3:GetObject'],
        resources: [`${this.userPhotosBucket.bucketArn}/*`]
      })
    );

    // ===========================
    // Food Photos Bucket
    // ===========================
    this.foodPhotosBucket = new s3.Bucket(this, 'FoodPhotosBucket', {
      bucketName: `food-delivery-food-photos-${stage}-${this.account}`,
      versioned: true,
      encryption: s3.BucketEncryption.S3_MANAGED,
      blockPublicAccess: new s3.BlockPublicAccess({
        blockPublicAcls: true,
        blockPublicPolicy: false,
        ignorePublicAcls: true,
        restrictPublicBuckets: false
      }),
      cors: [
        {
          allowedHeaders: ['*'],
          allowedMethods: [
            s3.HttpMethods.GET,
            s3.HttpMethods.PUT,
            s3.HttpMethods.POST,
            s3.HttpMethods.DELETE,
            s3.HttpMethods.HEAD
          ],
          allowedOrigins: ['*'],
          exposedHeaders: ['ETag'],
          maxAge: 3000
        }
      ],
      lifecycleRules: [
        {
          id: 'TransitionToIA',
          enabled: true,
          transitions: [
            {
              storageClass: s3.StorageClass.INFREQUENT_ACCESS,
              transitionAfter: cdk.Duration.days(lifecycleConfig.transitionToIA)
            }
          ]
        },
        {
          id: 'TransitionToGlacier',
          enabled: stage === 'prod', // Only in prod
          transitions: [
            {
              storageClass: s3.StorageClass.GLACIER,
              transitionAfter: cdk.Duration.days(lifecycleConfig.transitionToGlacier)
            }
          ]
        }
      ],
      removalPolicy,
      autoDeleteObjects: !retainResources
    });

    // Add bucket policy for public read access
    this.foodPhotosBucket.addToResourcePolicy(
      new iam.PolicyStatement({
        sid: 'PublicReadGetObject',
        effect: iam.Effect.ALLOW,
        principals: [new iam.AnyPrincipal()],
        actions: ['s3:GetObject'],
        resources: [`${this.foodPhotosBucket.bucketArn}/*`]
      })
    );

    // ===========================
    // Assets Bucket (Static Assets)
    // ===========================
    this.assetsBucket = new s3.Bucket(this, 'AssetsBucket', {
      bucketName: `food-delivery-assets-${stage}-${this.account}`,
      versioned: false,
      encryption: s3.BucketEncryption.S3_MANAGED,
      blockPublicAccess: new s3.BlockPublicAccess({
        blockPublicAcls: true,
        blockPublicPolicy: false,
        ignorePublicAcls: true,
        restrictPublicBuckets: false
      }),
      cors: [
        {
          allowedHeaders: ['*'],
          allowedMethods: [s3.HttpMethods.GET, s3.HttpMethods.HEAD],
          allowedOrigins: ['*'],
          maxAge: 3000
        }
      ],
      removalPolicy,
      autoDeleteObjects: !retainResources
    });

    // Add bucket policy for public read access
    this.assetsBucket.addToResourcePolicy(
      new iam.PolicyStatement({
        sid: 'PublicReadGetObject',
        effect: iam.Effect.ALLOW,
        principals: [new iam.AnyPrincipal()],
        actions: ['s3:GetObject'],
        resources: [`${this.assetsBucket.bucketArn}/*`]
      })
    );

    // ===========================
    // CloudFormation Outputs
    // ===========================
    new cdk.CfnOutput(this, 'UserPhotosBucketName', {
      value: this.userPhotosBucket.bucketName,
      description: 'S3 bucket for user profile pictures',
      exportName: `UserPhotosBucket-${stage}`
    });

    new cdk.CfnOutput(this, 'UserPhotosBucketArn', {
      value: this.userPhotosBucket.bucketArn,
      description: 'ARN of user photos bucket'
    });

    new cdk.CfnOutput(this, 'UserPhotosBucketUrl', {
      value: `https://${this.userPhotosBucket.bucketName}.s3.${this.region}.amazonaws.com`,
      description: 'URL of user photos bucket'
    });

    new cdk.CfnOutput(this, 'FoodPhotosBucketName', {
      value: this.foodPhotosBucket.bucketName,
      description: 'S3 bucket for food and restaurant pictures',
      exportName: `FoodPhotosBucket-${stage}`
    });

    new cdk.CfnOutput(this, 'FoodPhotosBucketArn', {
      value: this.foodPhotosBucket.bucketArn,
      description: 'ARN of food photos bucket'
    });

    new cdk.CfnOutput(this, 'FoodPhotosBucketUrl', {
      value: `https://${this.foodPhotosBucket.bucketName}.s3.${this.region}.amazonaws.com`,
      description: 'URL of food photos bucket'
    });

    new cdk.CfnOutput(this, 'AssetsBucketName', {
      value: this.assetsBucket.bucketName,
      description: 'S3 bucket for static assets',
      exportName: `AssetsBucket-${stage}`
    });

    // Add tags
    cdk.Tags.of(this.userPhotosBucket).add('BucketType', 'UserPhotos');
    cdk.Tags.of(this.foodPhotosBucket).add('BucketType', 'FoodPhotos');
    cdk.Tags.of(this.assetsBucket).add('BucketType', 'Assets');
  }
}
