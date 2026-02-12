"""
Base Pipeline Module
Provides abstract base class for ETL pipelines
"""
from abc import ABC, abstractmethod
from typing import List, Dict, Any
import logging

logger = logging.getLogger(__name__)


class BasePipeline(ABC):
    """Abstract base class for ETL pipelines"""
    
    def __init__(self, config: Dict[str, Any]):
        """
        Initialize pipeline with configuration
        
        Args:
            config: Configuration dictionary
        """
        self.config = config
        self.extractor = None
        self.transformer = None
        self.embedder = None
        self.loader = None
    
    @abstractmethod
    def initialize_components(self):
        """
        Initialize pipeline components (extractor, transformer, embedder, loader)
        """
        pass
    
    def run(self) -> Dict[str, Any]:
        """
        Run the complete ETL pipeline
        
        Returns:
            Dictionary with pipeline execution results
        """
        logger.info("Starting ETL pipeline")
        
        # Initialize components
        self.initialize_components()
        
        # Extract
        logger.info("Step 1: Extracting data")
        raw_records = self.extractor.extract()
        
        if not raw_records:
            logger.warning("No records extracted")
            return {
                'status': 'completed',
                'extracted': 0,
                'transformed': 0,
                'embedded': 0,
                'loaded': 0
            }
        
        # Validate
        if not self.extractor.validate(raw_records):
            logger.error("Validation failed for extracted records")
            raise ValueError("Invalid extracted records")
        
        # Transform
        logger.info("Step 2: Transforming data")
        transformed_records = self.transformer.transform(raw_records)
        
        # Embed
        logger.info("Step 3: Generating embeddings")
        embedded_records = self.embedder.embed_batch(
            [r['summary'] for r in transformed_records]
        )
        
        # Prepare for loading
        for i, record in enumerate(transformed_records):
            record['embedding'] = embedded_records[i]
        
        # Load
        logger.info("Step 4: Loading data")
        loaded_count = self.loader.load(transformed_records)
        
        result = {
            'status': 'completed',
            'extracted': len(raw_records),
            'transformed': len(transformed_records),
            'embedded': len(embedded_records),
            'loaded': loaded_count
        }
        
        logger.info(f"Pipeline completed: {result}")
        return result
