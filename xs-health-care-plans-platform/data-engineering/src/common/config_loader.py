"""
Configuration Loader Module
Loads configuration from YAML files
"""
import os
import yaml
from typing import Dict, Any
from pathlib import Path


class ConfigLoader:
    """Loads and manages configuration from YAML files"""
    
    def __init__(self, config_path: str = None):
        """
        Initialize config loader
        
        Args:
            config_path: Path to config file (defaults to config/config.yaml)
        """
        if config_path is None:
            config_path = os.path.join(
                os.path.dirname(__file__),
                '..', 'config', 'config.yaml'
            )
        
        self.config_path = Path(config_path)
        self.config = self._load_config()
    
    def _load_config(self) -> Dict[str, Any]:
        """Load configuration from YAML file"""
        if not self.config_path.exists():
            raise FileNotFoundError(f"Config file not found: {self.config_path}")
        
        with open(self.config_path, 'r') as f:
            return yaml.safe_load(f)
    
    def get(self, key: str, default: Any = None) -> Any:
        """
        Get configuration value by key (supports dot notation)
        
        Args:
            key: Configuration key (e.g., 'aws.region')
            default: Default value if key not found
            
        Returns:
            Configuration value
        """
        keys = key.split('.')
        value = self.config
        
        for k in keys:
            if isinstance(value, dict):
                value = value.get(k)
            else:
                return default
        
        return value if value is not None else default
    
    def get_aws_config(self) -> Dict[str, str]:
        """Get AWS configuration"""
        return {
            'region': self.get('aws.region', 'us-east-1'),
            'access_key_id': os.getenv('AWS_ACCESS_KEY_ID'),
            'secret_access_key': os.getenv('AWS_SECRET_ACCESS_KEY'),
        }
    
    def get_opensearch_config(self) -> Dict[str, str]:
        """Get OpenSearch configuration"""
        return {
            'endpoint': self.get('opensearch.endpoint'),
            'username': self.get('opensearch.username'),
            'password': self.get('opensearch.password'),
            'index': self.get('opensearch.index', 'plans_collection'),
        }
    
    def get_bedrock_config(self) -> Dict[str, str]:
        """Get Bedrock configuration"""
        return {
            'region': self.get('aws.bedrock.region', 'us-east-1'),
            'embedding_model': self.get('aws.bedrock.embedding_model', 'amazon.titan-embed-text-v2:0'),
        }
