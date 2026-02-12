"""
AWS Lambda Event Handler for Real-time Plan Updates
Handles events from RDS, SNS, or EventBridge to trigger plan updates in OpenSearch
"""
import json
import logging
import os
from typing import Dict, Any

# Add src to path
import sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'src'))

from common.config_loader import ConfigLoader
from extractors.rds_plan_extractor import RDSPlanExtractor
from transformers.plan_transformer import PlanTransformer
from embeddings.bedrock_titan_embedder import BedrockTitanEmbedder
from loaders.opensearch_loader import OpenSearchLoader

# Configure logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

# Global variables for connection reuse
config = None
extractor = None
transformer = None
embedder = None
loader = None


def initialize_components():
    """Initialize pipeline components (called once per Lambda invocation)"""
    global config, extractor, transformer, embedder, loader
    
    if config is None:
        # Load configuration from environment variables
        config_dict = {
            'aws': {
                'region': os.environ.get('AWS_REGION', 'us-east-1')
            },
            'rds': {
                'host': os.environ.get('RDS_HOST'),
                'port': int(os.environ.get('RDS_PORT', 5432)),
                'database': os.environ.get('RDS_DATABASE'),
                'username': os.environ.get('RDS_USERNAME'),
                'password': os.environ.get('RDS_PASSWORD'),
                'schema': os.environ.get('RDS_SCHEMA', 'public')
            },
            'opensearch': {
                'endpoint': os.environ.get('OPENSEARCH_ENDPOINT'),
                'username': os.environ.get('OPENSEARCH_USERNAME'),
                'password': os.environ.get('OPENSEARCH_PASSWORD'),
                'index': os.environ.get('OPENSEARCH_INDEX', 'healthcare_plans')
            },
            'bedrock': {
                'region': os.environ.get('AWS_REGION', 'us-east-1'),
                'embedding': {
                    'model_id': os.environ.get('BEDROCK_EMBEDDING_MODEL', 'amazon.titan-embed-text-v2:0'),
                    'rate_limit': int(os.environ.get('BEDROCK_RATE_LIMIT', 50))
                }
            }
        }
        
        config = ConfigLoader(config_dict)
        
        # Initialize components
        extractor = RDSPlanExtractor(config.get('rds'))
        transformer = PlanTransformer(config.get('pipeline', {}))
        embedder = BedrockTitanEmbedder(config.get('bedrock'))
        loader = OpenSearchLoader(config.get('opensearch'))
        
        logger.info("Components initialized successfully")


def lambda_handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """
    Lambda handler for processing plan update events
    
    Args:
        event: Event data from RDS, SNS, or EventBridge
        context: Lambda context object
        
    Returns:
        Response with status and processed count
    """
    try:
        logger.info(f"Received event: {json.dumps(event)}")
        
        # Initialize components
        initialize_components()
        
        # Extract plan IDs from event
        plan_ids = extract_plan_ids(event)
        
        if not plan_ids:
            logger.warning("No plan IDs found in event")
            return {
                'statusCode': 200,
                'body': json.dumps({
                    'message': 'No plan IDs to process',
                    'processed': 0
                })
            }
        
        logger.info(f"Processing {len(plan_ids)} plan(s): {plan_ids}")
        
        # Extract plans from RDS
        filters = {'plan_ids': plan_ids}
        raw_records = extractor.extract(filters)
        
        if not raw_records:
            logger.warning(f"No records found for plan IDs: {plan_ids}")
            return {
                'statusCode': 200,
                'body': json.dumps({
                    'message': 'No records found',
                    'processed': 0
                })
            }
        
        # Transform
        transformed_records = transformer.transform(raw_records)
        
        # Generate embeddings
        embedded_records = embedder.embed_batch(transformed_records)
        
        # Load into OpenSearch (upsert)
        loader.load(embedded_records)
        
        logger.info(f"Successfully processed {len(embedded_records)} plan(s)")
        
        return {
            'statusCode': 200,
            'body': json.dumps({
                'message': 'Plans processed successfully',
                'processed': len(embedded_records)
            })
        }
        
    except Exception as e:
        logger.error(f"Error processing event: {str(e)}", exc_info=True)
        return {
            'statusCode': 500,
            'body': json.dumps({
                'message': 'Error processing event',
                'error': str(e)
            })
        }


def extract_plan_ids(event: Dict[str, Any]) -> list:
    """
    Extract plan IDs from various event formats
    
    Args:
        event: Event data
        
    Returns:
        List of plan IDs
    """
    plan_ids = []
    
    # Check for SNS event
    if 'Records' in event and len(event['Records']) > 0:
        record = event['Records'][0]
        if 'Sns' in record:
            sns_message = json.loads(record['Sns']['Message'])
            if 'plan_ids' in sns_message:
                plan_ids = sns_message['plan_ids']
            elif 'plan_id' in sns_message:
                plan_ids = [sns_message['plan_id']]
    
    # Check for EventBridge event
    elif 'detail' in event:
        if 'plan_ids' in event['detail']:
            plan_ids = event['detail']['plan_ids']
        elif 'plan_id' in event['detail']:
            plan_ids = [event['detail']['plan_id']]
    
    # Check for direct event
    elif 'plan_ids' in event:
        plan_ids = event['plan_ids']
    elif 'plan_id' in event:
        plan_ids = [event['plan_id']]
    
    return plan_ids
