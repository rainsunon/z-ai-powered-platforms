"""
Template-based Summarizer Module
Generates summaries using Jinja2 templates
"""
import os
import logging
from typing import Dict, Any, List
from jinja2 import Environment, FileSystemLoader, Template
from .base_summarizer import BaseSummarizer

logger = logging.getLogger(__name__)


class TemplateSummarizer(BaseSummarizer):
    """Generates summaries using Jinja2 templates"""
    
    def __init__(self, config: Dict[str, Any]):
        """
        Initialize template summarizer
        
        Args:
            config: Configuration dictionary with template_dir
        """
        super().__init__(config)
        
        # Get template directory
        template_dir = config.get('template_dir', 'src/summarization')
        
        # Make template_dir relative to project root if not absolute
        if not os.path.isabs(template_dir):
            project_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
            template_dir = os.path.join(project_root, template_dir)
        
        # Initialize Jinja2 environment
        self.env = Environment(
            loader=FileSystemLoader(template_dir),
            autoescape=False
        )
        
        # Load default template
        self.default_template_name = config.get('default_template', 'plan_summary.jinja2')
        self.default_template = self.env.get_template(self.default_template_name)
        
        logger.info(f"TemplateSummarizer initialized with template_dir={template_dir}")
    
    def summarize(self, record: Dict[str, Any]) -> str:
        """
        Generate a summary from a record using the default template
        
        Args:
            record: Record to summarize
            
        Returns:
            Generated summary text
        """
        return self.default_template.render(**record)
    
    def summarize_batch(self, records: List[Dict[str, Any]]) -> List[str]:
        """
        Generate summaries for multiple records
        
        Args:
            records: List of records to summarize
            
        Returns:
            List of generated summaries
        """
        summaries = []
        for record in records:
            summary = self.summarize(record)
            summaries.append(summary)
        return summaries
    
    def summarize_with_template(self, record: Dict[str, Any], template_name: str) -> str:
        """
        Generate a summary using a specific template
        
        Args:
            record: Record to summarize
            template_name: Name of the template to use
            
        Returns:
            Generated summary text
        """
        template = self.env.get_template(template_name)
        return template.render(**record)
    
    def summarize_batch_with_template(
        self, records: List[Dict[str, Any]], template_name: str
    ) -> List[str]:
        """
        Generate summaries for multiple records using a specific template
        
        Args:
            records: List of records to summarize
            template_name: Name of the template to use
            
        Returns:
            List of generated summaries
        """
        template = self.env.get_template(template_name)
        summaries = []
        for record in records:
            summary = template.render(**record)
            summaries.append(summary)
        return summaries
