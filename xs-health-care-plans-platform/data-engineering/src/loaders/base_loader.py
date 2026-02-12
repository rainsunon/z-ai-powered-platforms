"""
Base Loader Module
Provides abstract base class for data loaders
"""
from abc import ABC, abstractmethod
from typing import List, Dict, Any
import logging

logger = logging.getLogger(__name__)


class BaseLoader(ABC):
    """Abstract base class for data loaders"""
    
    def __init__(self, config: Dict[str, Any]):
        """
        Initialize loader with configuration
        
        Args:
            config: Configuration dictionary
        """
        self.config = config
    
    @abstractmethod
    def load(self, records: List[Dict[str, Any]]) -> int:
        """
        Load records into destination
        
        Args:
            records: List of records to load
            
        Returns:
            Number of records loaded
        """
        pass
    
    @abstractmethod
    def delete(self, record_id: str) -> bool:
        """
        Delete a record by ID
        
        Args:
            record_id: ID of record to delete
            
        Returns:
            True if deleted, False otherwise
        """
        pass
    
    @abstractmethod
    def bulk_delete(self, record_ids: List[str]) -> int:
        """
        Bulk delete records by IDs
        
        Args:
            record_ids: List of record IDs to delete
            
        Returns:
            Number of records deleted
        """
        pass
