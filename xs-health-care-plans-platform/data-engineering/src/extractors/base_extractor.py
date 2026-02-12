"""
Base Extractor Module
Provides abstract base class for data extractors
"""
from abc import ABC, abstractmethod
from typing import List, Dict, Any
import logging

logger = logging.getLogger(__name__)


class BaseExtractor(ABC):
    """Abstract base class for data extractors"""
    
    def __init__(self, config: Dict[str, Any]):
        """
        Initialize extractor with configuration
        
        Args:
            config: Configuration dictionary
        """
        self.config = config
    
    @abstractmethod
    def extract(self) -> List[Dict[str, Any]]:
        """
        Extract data from source
        
        Returns:
            List of extracted records
        """
        pass
    
    def validate(self, records: List[Dict[str, Any]]) -> bool:
        """
        Validate extracted records
        
        Args:
            records: List of records to validate
            
        Returns:
            True if valid, False otherwise
        """
        if not records:
            logger.warning("No records to validate")
            return False
        
        required_fields = self._get_required_fields()
        for record in records:
            for field in required_fields:
                if field not in record:
                    logger.error(f"Missing required field: {field}")
                    return False
        
        return True
    
    @abstractmethod
    def _get_required_fields(self) -> List[str]:
        """
        Get list of required fields for validation
        
        Returns:
            List of required field names
        """
        pass
