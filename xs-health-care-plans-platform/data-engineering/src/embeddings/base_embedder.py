"""
Base Embedder Module
Provides abstract base class for embedding generation
"""
from abc import ABC, abstractmethod
from typing import List
import logging

logger = logging.getLogger(__name__)


class BaseEmbedder(ABC):
    """Abstract base class for embedding generation"""
    
    def __init__(self, config: dict):
        """
        Initialize embedder with configuration
        
        Args:
            config: Configuration dictionary
        """
        self.config = config
        self.model_id = config.get('model_id', 'amazon.titan-embed-text-v2:0')
    
    @abstractmethod
    def embed(self, text: str) -> List[float]:
        """
        Generate embedding for a single text
        
        Args:
            text: Text to embed
            
        Returns:
            List of float values representing the embedding vector
        """
        pass
    
    @abstractmethod
    def embed_batch(self, texts: List[str]) -> List[List[float]]:
        """
        Generate embeddings for multiple texts
        
        Args:
            texts: List of texts to embed
            
        Returns:
            List of embedding vectors
        """
        pass
    
    def get_embedding_dimension(self) -> int:
        """
        Get the dimension of the embedding vectors
        
        Returns:
            Dimension of embedding vectors
        """
        return self.config.get('embedding_dimension', 1536)
