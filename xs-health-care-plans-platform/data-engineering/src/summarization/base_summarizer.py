"""
Base Summarizer Module
Provides abstract base class for summarizers
"""
from abc import ABC, abstractmethod
from typing import Dict, Any
import logging

logger = logging.getLogger(__name__)


class BaseSummarizer(ABC):
    """Abstract base class for summarizers"""
    
    def __init__(self, config: Dict[str, Any]):
        """
        Initialize summarizer with configuration
        
        Args:
            config: Configuration dictionary
        """
        self.config = config
    
    @abstractmethod
    def summarize(self, record: Dict[str, Any]) -> str:
        """
        Generate a summary from a record
        
        Args:
            record: Record to summarize
            
        Returns:
            Generated summary text
        """
        pass
    
    @abstractmethod
    def summarize_batch(self, records: list) -> list:
        """
        Generate summaries for multiple records
        
        Args:
            records: List of records to summarize
            
        Returns:
            List of generated summaries
        """
        pass
