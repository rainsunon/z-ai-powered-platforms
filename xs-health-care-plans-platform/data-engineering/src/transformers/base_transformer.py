"""
Base Transformer Module
Provides abstract base class for data transformers
"""
from abc import ABC, abstractmethod
from typing import List, Dict, Any
import logging

logger = logging.getLogger(__name__)


class BaseTransformer(ABC):
    """Abstract base class for data transformers"""
    
    def __init__(self, config: Dict[str, Any]):
        """
        Initialize transformer with configuration
        
        Args:
            config: Configuration dictionary
        """
        self.config = config
    
    @abstractmethod
    def transform(self, records: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Transform raw records into processed format
        
        Args:
            records: List of raw records to transform
            
        Returns:
            List of transformed records
        """
        pass
    
    def validate(self, records: List[Dict[str, Any]]) -> bool:
        """
        Validate transformed records
        
        Args:
            records: List of records to validate
            
        Returns:
            True if valid, False otherwise
        """
        if not records:
            logger.warning("No records to validate")
            return False
        
        for record in records:
            if 'summary' not in record:
                logger.error(f"Missing 'summary' field in record")
                return False
        
        return True
