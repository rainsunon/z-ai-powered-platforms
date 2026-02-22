import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as logs from 'aws-cdk-lib/aws-logs';
import { Construct } from 'constructs';
import * as path from 'path';

export interface LambdaStackProps extends cdk.StackProps {
  stage: string;
  userPhotosBucket: s3.IBucket;
  foodPhotosBucket: s3.IBucket;
}

export class LambdaStack extends cdk.Stack {
  public readonly presignedUrlFunction: lambda.Function;
  public readonly imageProcessorFunction: lambda.Function;

  constructor(scope: Construct, id: string, props: LambdaStackProps) {
    super(scope, id, props);

    const { stage, userPhotosBucket, foodPhotosBucket } = props;

    // ===========================
    // IAM Role for Lambda Functions
    // ===========================
    const lambdaRole = new iam.Role(this, 'LambdaExecutionRole', {
      roleName: `food-delivery-lambda-role-${stage}`,
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole')
      ]
    });

    // Grant S3 permissions
    userPhotosBucket.grantReadWrite(lambdaRole);
    foodPhotosBucket.grantReadWrite(lambdaRole);

    // ===========================
    // Presigned URL Generator Lambda
    // ===========================
    this.presignedUrlFunction = new lambda.Function(this, 'PresignedUrlFunction', {
      functionName: `food-delivery-presigned-url-${stage}`,
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline(`
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const s3Client = new S3Client({ region: process.env.AWS_REGION });

exports.handler = async (event) => {
  console.log('Event:', JSON.stringify(event, null, 2));
  
  try {
    const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
    const { fileName, fileType, folder, bucketType } = body;
    
    if (!fileName || !fileType || !folder) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type,Authorization',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          error: 'Missing required fields: fileName, fileType, folder' 
        })
      };
    }
    
    // Determine bucket
    const bucketName = bucketType === 'user' 
      ? process.env.USER_PHOTOS_BUCKET 
      : process.env.FOOD_PHOTOS_BUCKET;
    
    // Generate unique filename
    const timestamp = Date.now();
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const key = \`\${folder}/\${timestamp}-\${sanitizedFileName}\`;
    
    // Create presigned URL
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      ContentType: fileType
    });
    
    const uploadUrl = await getSignedUrl(s3Client, command, { 
      expiresIn: 300 // 5 minutes
    });
    
    const fileUrl = \`https://\${bucketName}.s3.\${process.env.AWS_REGION}.amazonaws.com/\${key}\`;
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,Authorization',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        uploadUrl,
        fileUrl,
        key,
        bucket: bucketName,
        expiresIn: 300
      })
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        error: 'Failed to generate presigned URL',
        message: error.message
      })
    };
  }
};
      `),
      role: lambdaRole,
      timeout: cdk.Duration.seconds(30),
      memorySize: 256,
      environment: {
        USER_PHOTOS_BUCKET: userPhotosBucket.bucketName,
        FOOD_PHOTOS_BUCKET: foodPhotosBucket.bucketName,
        AWS_REGION: this.region
      },
      logRetention: logs.RetentionDays.ONE_WEEK,
      description: `Generate presigned URLs for S3 uploads - ${stage} environment`
    });

    // ===========================
    // Image Processor Lambda
    // ===========================
    this.imageProcessorFunction = new lambda.Function(this, 'ImageProcessorFunction', {
      functionName: `food-delivery-image-processor-${stage}`,
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline(`
const { S3Client, GetObjectCommand, PutObjectCommand } = require('@aws-sdk/client-s3');
const sharp = require('sharp');

const s3Client = new S3Client({ region: process.env.AWS_REGION });

exports.handler = async (event) => {
  console.log('Processing image:', JSON.stringify(event, null, 2));
  
  try {
    // Get uploaded object details
    const bucket = event.Records[0].s3.bucket.name;
    const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\\+/g, ' '));
    
    console.log(\`Processing \${bucket}/\${key}\`);
    
    // Get the image from S3
    const getCommand = new GetObjectCommand({ Bucket: bucket, Key: key });
    const { Body, ContentType } = await s3Client.send(getCommand);
    
    // Convert stream to buffer
    const imageBuffer = await streamToBuffer(Body);
    
    // Process image with Sharp
    const sizes = [
      { suffix: 'thumbnail', width: 150, height: 150 },
      { suffix: 'small', width: 400, height: 400 },
      { suffix: 'medium', width: 800, height: 800 }
    ];
    
    const uploadPromises = sizes.map(async ({ suffix, width, height }) => {
      const resized = await sharp(imageBuffer)
        .resize(width, height, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 85, progressive: true })
        .toBuffer();
      
      const newKey = key.replace(/(\\.\\w+)$/, \`_\${suffix}$1\`);
      
      const putCommand = new PutObjectCommand({
        Bucket: bucket,
        Key: newKey,
        Body: resized,
        ContentType: ContentType || 'image/jpeg',
        CacheControl: 'max-age=31536000'
      });
      
      await s3Client.send(putCommand);
      console.log(\`Created \${suffix}: \${newKey}\`);
      
      return newKey;
    });
    
    await Promise.all(uploadPromises);
    
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Image processed successfully', key })
    };
  } catch (error) {
    console.error('Error processing image:', error);
    throw error;
  }
};

async function streamToBuffer(stream) {
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}
      `),
      role: lambdaRole,
      timeout: cdk.Duration.seconds(60),
      memorySize: 1024,
      environment: {
        AWS_REGION: this.region
      },
      logRetention: logs.RetentionDays.ONE_WEEK,
      description: `Process and resize uploaded images - ${stage} environment`
    });

    // Note: In production, you would bundle Sharp as a Lambda Layer
    // For now, this is a placeholder. You need to create a proper deployment package.

    // Grant S3 event permissions
    userPhotosBucket.grantRead(this.imageProcessorFunction);
    userPhotosBucket.grantPut(this.imageProcessorFunction);
    foodPhotosBucket.grantRead(this.imageProcessorFunction);
    foodPhotosBucket.grantPut(this.imageProcessorFunction);

    // ===========================
    // CloudFormation Outputs
    // ===========================
    new cdk.CfnOutput(this, 'PresignedUrlFunctionArn', {
      value: this.presignedUrlFunction.functionArn,
      description: 'ARN of presigned URL generator function',
      exportName: `PresignedUrlFunctionArn-${stage}`
    });

    new cdk.CfnOutput(this, 'ImageProcessorFunctionArn', {
      value: this.imageProcessorFunction.functionArn,
      description: 'ARN of image processor function',
      exportName: `ImageProcessorFunctionArn-${stage}`
    });

    new cdk.CfnOutput(this, 'PresignedUrlFunctionName', {
      value: this.presignedUrlFunction.functionName,
      description: 'Name of presigned URL generator function'
    });
  }
}
