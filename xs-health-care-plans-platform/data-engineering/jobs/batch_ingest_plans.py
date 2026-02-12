#!/usr/bin/env python3
"""
Batch Ingestion Job for Healthcare Plans
Extracts plans from RDS, transforms them, generates embeddings, and loads into OpenSearch
"""
import sys
import os
import argparse
import logging
from datetime import datetime

# Add src to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'src'))

from common.config_loader import ConfigLoader
from extractors.rds_plan_extractor import RDSPlanExtractor
from transformers.plan_transformer import PlanTransformer
from embeddings.bedrock_titan_embedder import BedrockTitanEmbedder
from loaders.opensearch_loader import OpenSearchLoader
from pipelines.plan_ingestion_pipeline import PlanIngestionPipeline

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


def main():
    """Main entry point for batch ingestion job"""
    parser = argparse.ArgumentParser(description='Batch ingest healthcare plans into OpenSearch')
    parser.add_argument(
        '--config',
        type=str,
        default='config/config.yaml',
        help='Path to configuration file'
    )
    parser.add_argument(
        '--year',
        type=int,
        default=None,
        help='Filter plans by year (optional)'
    )
    parser.add_argument(
        '--state',
        type=str,
        default=None,
        help='Filter plans by state (optional)'
    )
    parser.add_argument(
        '--limit',
        type=int,
        default=None,
        help='Limit number of plans to process (optional)'
    )
    parser.add_argument(
        '--dry-run',
        action='store_true',
        help='Run without actually loading data'
    )
    
    args = parser.parse_args()
    
    # Load configuration
    config_path = os.path.join(os.path.dirname(__file__), '..', args.config)
    config = ConfigLoader(config_path)
    
    logger.info(f"Starting batch ingestion at {datetime.utcnow().isoformat()}")
    logger.info(f"Configuration: {config_path}")
    
    # Create pipeline
    pipeline = PlanIngestionPipeline(config.config)
    
    # Initialize components
    pipeline.initialize_components()
    
    # Extract with filters
    filters = {}
    if args.year:
        filters['year'] = args.year
    if args.state:
        filters['state'] = args.state
    
    logger.info(f"Extracting plans with filters: {filters}")
    raw_records = pipeline.extractor.extract(filters)
    
    if args.limit:
        raw_records = raw_records[:args.limit]
        logger.info(f"Limited to {args.limit} records")
    
    logger.info(f"Extracted {len(raw_records)} raw records")
    
    # Transform
    transformed_records = pipeline.transformer.transform(raw_records)
    logger.info(f"Transformed {len(transformed_records)} records")
    
    # Generate embeddings
    if not args.dry_run:
        embedded_records = pipeline.embedder.embed_batch(transformed_records)
        logger.info(f"Generated embeddings for {len(embedded_records)} records")
        
        # Load into OpenSearch
        pipeline.loader.load(embedded_records)
        logger.info(f"Loaded {len(embedded_records)} records into OpenSearch")
    else:
        logger.info("Dry run - skipping embedding and loading")
    
    logger.info(f"Batch ingestion completed at {datetime.utcnow().isoformat()}")


if __name__ == '__main__':
    main()
