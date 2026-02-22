import json
import boto3
import os
from datetime import datetime
import logging

logger = logging.getLogger()
logger.setLevel(logging.INFO)

# DynamoDB client
dynamodb = boto3.resource('dynamodb')
s3_client = boto3.client('s3')

def lambda_handler(event, context):
    """
    Lambda function triggered by S3 upload
    Processes medical documents and stores metadata in DynamoDB
    """
    
    try:
        # Get the S3 bucket and object key from the event
        bucket = event['Records'][0]['s3']['bucket']['name']
        key = event['Records'][0]['s3']['object']['key']
        
        logger.info(f"Processing file: {bucket}/{key}")
        
        # Get file metadata from S3
        response = s3_client.head_object(Bucket=bucket, Key=key)
        file_size = response['ContentLength']
        content_type = response.get('ContentType', 'unknown')
        
        # Extract metadata
        metadata = {
            'file_id': f"file-{int(datetime.utcnow().timestamp() * 1000)}",
            's3_bucket': bucket,
            's3_key': key,
            'file_size': file_size,
            'content_type': content_type,
            'upload_timestamp': datetime.utcnow().isoformat(),
            'status': 'processed',
            'processed_at': datetime.utcnow().isoformat()
        }
        
        # Store metadata in DynamoDB
        table_name = os.environ.get('DYNAMODB_TABLE', 'healthcare-notifications')
        table = dynamodb.Table(table_name)
        
        table.put_item(Item={
            'notification_id': metadata['file_id'],
            'type': 'document_upload',
            'recipient': 'admin@healthcare.com',
            'message': f"Document uploaded: {key}",
            'metadata': json.dumps(metadata),
            'status': 'processed',
            'timestamp': metadata['upload_timestamp']
        })
        
        logger.info(f"Successfully processed file: {key}")
        
        return {
            'statusCode': 200,
            'body': json.dumps({
                'message': 'File processed successfully',
                'file_id': metadata['file_id']
            })
        }
        
    except Exception as e:
        logger.error(f"Error processing file: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps({
                'message': 'Error processing file',
                'error': str(e)
            })
        }