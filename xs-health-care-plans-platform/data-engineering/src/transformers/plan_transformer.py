"""
Plan Transformer Module
Transforms raw plan data into format suitable for embedding
"""
import logging
from typing import List, Dict, Any
from .base_transformer import BaseTransformer
from ..summarization.template_summarizer import TemplateSummarizer

logger = logging.getLogger(__name__)


class PlanTransformer(BaseTransformer):
    """Transforms raw plan data into format suitable for embedding"""
    
    def __init__(self, config: Dict[str, Any]):
        """
        Initialize plan transformer
        
        Args:
            config: Configuration dictionary
        """
        super().__init__(config)
        
        # Initialize summarizer
        summarizer_config = config.get('summarization', {})
        self.summarizer = TemplateSummarizer(summarizer_config)
    
    def transform(self, records: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Transform raw plan records into processed format
        
        Args:
            records: List of raw plan records
            
        Returns:
            List of transformed records with summaries
        """
        logger.info(f"Transforming {len(records)} plan records")
        
        transformed = []
        for record in records:
            transformed_record = self._transform_record(record)
            transformed.append(transformed_record)
        
        logger.info(f"Transformed {len(transformed)} records")
        return transformed
    
    def _transform_record(self, record: Dict[str, Any]) -> Dict[str, Any]:
        """
        Transform a single plan record
        
        Args:
            record: Raw plan record
            
        Returns:
            Transformed record with summary
        """
        # Extract fields
        plan_id = record.get('plan_id')
        plan_code = record.get('plan_code')
        year = record.get('year')
        state = record.get('state')
        is_national = record.get('is_national', False)
        metal_tier = record.get('metal_tier', 'unknown')
        monthly_premium = record.get('monthly_premium', 0)
        annual_deductible = record.get('annual_deductible', 0)
        out_of_pocket_max = record.get('out_of_pocket_max', 0)
        focus_areas = record.get('focus_areas', [])
        age_groups = record.get('age_groups', [])
        inclusions = record.get('inclusions', [])
        exclusions = record.get('exclusions', [])
        insurer = record.get('insurer', 'Unknown')
        
        # Determine cost tier
        cost_tier = self._determine_cost_tier(monthly_premium)
        
        # Build metadata
        metadata = {
            'plan_id': plan_id,
            'plan_code': plan_code,
            'year': year,
            'state': state,
            'is_national': is_national,
            'metal_tier': metal_tier,
            'cost_tier': cost_tier,
            'monthly_premium': monthly_premium,
            'annual_deductible': annual_deductible,
            'out_of_pocket_max': out_of_pocket_max,
            'focus_areas': focus_areas,
            'age_groups': age_groups,
            'insurer': insurer,
            'status': 'active'
        }
        
        # Build summary for embedding
        summary = self._build_summary(
            plan_code, year, state, metal_tier, monthly_premium,
            annual_deductible, focus_areas, inclusions, exclusions
        )
        
        return {
            'plan_id': plan_id,
            'summary': summary,
            'metadata': metadata
        }
    
    def _determine_cost_tier(self, monthly_premium: float) -> str:
        """
        Determine cost tier based on monthly premium
        
        Args:
            monthly_premium: Monthly premium amount
            
        Returns:
            Cost tier (bronze, silver, gold, platinum)
        """
        if monthly_premium < 200:
            return 'bronze'
        elif monthly_premium < 350:
            return 'silver'
        elif monthly_premium < 500:
            return 'gold'
        else:
            return 'platinum'
    
    def _build_summary(
        self, plan_code: str, year: int, state: str, metal_tier: str,
        monthly_premium: float, annual_deductible: float,
        focus_areas: List[str], inclusions: List[str], exclusions: List[str]
    ) -> str:
        """
        Build natural language summary for embedding using template
        
        Returns:
            Natural language summary
        """
        # Build template context
        context = {
            'plan_code': plan_code,
            'year': year,
            'state': state,
            'is_national': state is None,
            'metal_tier': metal_tier,
            'monthly_premium': monthly_premium,
            'annual_deductible': annual_deductible,
            'out_of_pocket_max': 0,  # Not available in current schema
            'focus_areas': focus_areas,
            'inclusions': inclusions,
            'exclusions': exclusions,
            'age_groups': [],  # Not available in current schema
            'providers': [],  # Not available in current schema
            'provider_states': []  # Not available in current schema
        }
        
        # Use summarizer to generate summary
        return self.summarizer.summarize(context)
