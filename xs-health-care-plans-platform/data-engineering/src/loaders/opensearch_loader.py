"""
OpenSearch Loader Module
Loads data into OpenSearch vector database
"""
import json
import logging
from typing import List, Dict, Any
from opensearchpy import OpenSearch, helpers
from .base_loader import BaseLoader

logger = logging.getLogger(__name__)


class OpenSearchLoader(BaseLoader):
    """Loads data into OpenSearch vector database"""
    
    def __init__(self, config: Dict[str, Any]):
        super().__init__(config)
        self.endpoint = config.get('endpoint')
        self.username = config.get('username')
        self.password = config.get('password')
        self.index_name = config.get('index', 'plans_collection')
        self.client = None
    
    def _get_client(self):
        """Get or create OpenSearch client"""
        if self.client is None:
            auth = None
            if self.username and self.password:
                auth = (self.username, self.password)
            
            self.client = OpenSearch(
                hosts=[{'host': self.endpoint}],
                http_auth=auth,
                use_ssl=True,
                verify_certs=False,
                ssl_show_warn=False
            )
            logger.info(f"OpenSearch client initialized for endpoint: {self.endpoint}")
        return self.client
    
    def load(self, records: List[Dict[str, Any]]) -> int:
        """
        Load records into OpenSearch
        
        Args:
            records: List of records to load
            
        Returns:
            Number of records loaded
        """
        logger.info(f"Loading {len(records)} records into OpenSearch index: {self.index_name}")
        
        client = self._get_client()
        loaded_count = 0
        
        try:
            # Check if index exists, create if not
            if not client.indices.exists(index=self.index_name):
                self._create_index()
            
            # Bulk load records
            actions = []
            for record in records:
                action = self._build_index_action(record)
                if action:
                    actions.append(action)
            
            if actions:
                success, failed = helpers.bulk(client, actions)
                loaded_count = success
                logger.info(f"Successfully loaded {loaded_count} records, {len(failed)} failed")
            
            return loaded_count
            
        except Exception as e:
            logger.error(f"Error loading records into OpenSearch: {e}")
            raise
    
    def delete(self, record_id: str) -> bool:
        """
        Delete a record by ID
        
        Args:
            record_id: ID of record to delete
            
        Returns:
            True if deleted, False otherwise
        """
        client = self._get_client()
        
        try:
            response = client.delete(
                index=self.index_name,
                id=record_id
            )
            result = response.get('result', 'not_found')
            logger.info(f"Deleted record {record_id}: {result}")
            return result == 'deleted'
        except Exception as e:
            logger.error(f"Error deleting record {record_id}: {e}")
            return False
    
    def bulk_delete(self, record_ids: List[str]) -> int:
        """
        Bulk delete records by IDs
        
        Args:
            record_ids: List of record IDs to delete
            
        Returns:
            Number of records deleted
        """
        client = self._get_client()
        
        try:
            deleted_count = 0
            for record_id in record_ids:
                response = client.delete(
                    index=self.index_name,
                    id=record_id
                )
                if response.get('result') == 'deleted':
                    deleted_count += 1
            
            logger.info(f"Bulk deleted {deleted_count} records")
            return deleted_count
        except Exception as e:
            logger.error(f"Error bulk deleting records: {e}")
            raise
    
    def _create_index(self):
        """Create OpenSearch index with mapping"""
        client = self._get_client()
        
        index_body = {
            'mappings': {
                'properties': {
                    'summary': {
                        'type': 'text'
                    },
                    'embedding': {
                        'type': 'knn_vector',
                        'dimension': 1536,
                        'method': 'cosine'
                    },
                    'metadata': {
                        'type': 'object',
                        'properties': {
                            'plan_id': {'type': 'keyword'},
                            'year': {'type': 'integer'},
                            'state': {'type': 'keyword'},
                            'age_groups': {'type': 'keyword'},
                            'focus_areas': {'type': 'keyword'},
                            'metal_tier': {'type': 'keyword'},
                            'cost_tier': {'type': 'keyword'},
                            'insurer': {'type': 'keyword'},
                            'status': {'type': 'keyword'}
                        }
                    }
                }
            }
        }
        
        client.indices.create(index=self.index_name, body=index_body)
        logger.info(f"Created index: {self.index_name}")
    
    def _build_index_action(self, record: Dict[str, Any]) -> Dict[str, Any]:
        """
        Build OpenSearch bulk index action
        
        Args:
            record: Record to index
            
        Returns:
            Index action dictionary
        """
        return {
            '_index': self.index_name,
            '_id': record.get('plan_id'),
            '_source': {
                'summary': record.get('summary'),
                'embedding': record.get('embedding'),
                'metadata': record.get('metadata', {})
            }
        }
