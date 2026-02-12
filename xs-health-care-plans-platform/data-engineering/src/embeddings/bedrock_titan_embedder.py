"""
Bedrock Titan Embedder Module
Generates embeddings using AWS Bedrock Titan model
"""
import json
import logging
import time
from typing import List
import boto3
from botocore.exceptions import ClientError
from .base_embedder import BaseEmbedder

logger = logging.getLogger(__name__)


class BedrockTitanEmbedder(BaseEmbedder):
    """Generates embeddings using AWS Bedrock Titan model"""
    
    def __init__(self, config: dict):
        super().__init__(config)
        self.region = config.get('region', 'us-east-1')
        self.rate_limit = config.get('rate_limit', 50)  # requests per second
        self.last_request_time = 0
        self.client = None
    
    def _get_client(self):
        """Get or create Bedrock runtime client"""
        if self.client is None:
            self.client = boto3.client(
                'bedrock-runtime',
                region_name=self.region
            )
            logger.info(f"Bedrock client initialized for region: {self.region}")
        return self.client
    
    def embed(self, text: str) -> List[float]:
        """
        Generate embedding for a single text
        
        Args:
            text: Text to embed
            
        Returns:
            List of float values representing the embedding vector
        """
        self._rate_limit()
        
        try:
            client = self._get_client()
            
            # Build request body for Titan Embeddings
            request_body = json.dumps({
                "inputText": text
            })
            
            response = client.invoke_model(
                modelId=self.model_id,
                body=request_body
            )
            
            # Parse response
            response_body = json.loads(response['body'].read())
            embedding = response_body.get('embedding', [])
            
            logger.debug(f"Generated embedding with {len(embedding)} dimensions")
            return embedding
            
        except ClientError as e:
            logger.error(f"Bedrock API error: {e}")
            raise
        except Exception as e:
            logger.error(f"Error generating embedding: {e}")
            raise
    
    def embed_batch(self, texts: List[str]) -> List[List[float]]:
        """
        Generate embeddings for multiple texts
        
        Args:
            texts: List of texts to embed
            
        Returns:
            List of embedding vectors
        """
        embeddings = []
        
        for i, text in enumerate(texts):
            logger.debug(f"Processing embedding {i+1}/{len(texts)}")
            embedding = self.embed(text)
            embeddings.append(embedding)
        
        logger.info(f"Generated {len(embeddings)} embeddings")
        return embeddings
    
    def _rate_limit(self):
        """Apply rate limiting to API calls"""
        current_time = time.time()
        time_since_last = current_time - self.last_request_time
        min_interval = 1.0 / self.rate_limit
        
        if time_since_last < min_interval:
            sleep_time = min_interval - time_since_last
            time.sleep(sleep_time)
        
        self.last_request_time = time.time()
