"""
Plan Ingestion Pipeline Module
Orchestrates the ETL pipeline for healthcare plans
"""
import logging
from typing import Dict, Any
from .base_pipeline import BasePipeline
from ..extractors.rds_plan_extractor import RDSPlanExtractor
from ..transformers.plan_transformer import PlanTransformer
from ..embeddings.bedrock_titan_embedder import BedrockTitanEmbedder
from ..loaders.opensearch_loader import OpenSearchLoader

logger = logging.getLogger(__name__)


class PlanIngestionPipeline(BasePipeline):
    """ETL pipeline for healthcare plans ingestion"""
    
    def initialize_components(self):
        """Initialize pipeline components"""
        from ..common.config_loader import ConfigLoader
        
        config_loader = ConfigLoader()
        
        # Initialize extractor
        db_config = {
            'db_host': config_loader.get('plans.db.host'),
            'db_port': config_loader.get('plans.db.port', '5432'),
            'db_name': config_loader.get('plans.db.name'),
            'db_user': config_loader.get('plans.db.user'),
            'db_password': config_loader.get('plans.db.password'),
        }
        self.extractor = RDSPlanExtractor(db_config)
        
        # Initialize transformer
        self.transformer = PlanTransformer({})
        
        # Initialize embedder
        bedrock_config = config_loader.get_bedrock_config()
        self.embedder = BedrockTitanEmbedder(bedrock_config)
        
        # Initialize loader
        opensearch_config = config_loader.get_opensearch_config()
        self.loader = OpenSearchLoader(opensearch_config)
        
        logger.info("Pipeline components initialized")
