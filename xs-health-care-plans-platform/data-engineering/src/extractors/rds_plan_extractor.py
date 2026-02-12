"""
RDS Plan Extractor Module
Extracts healthcare plan data from PostgreSQL RDS
"""
import logging
from typing import List, Dict, Any
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from .base_extractor import BaseExtractor

logger = logging.getLogger(__name__)


class RDSPlanExtractor(BaseExtractor):
    """Extracts healthcare plan data from PostgreSQL RDS"""
    
    def __init__(self, config: Dict[str, Any]):
        super().__init__(config)
        self.engine = create_engine(
            f"postgresql://{config['db_user']}:{config['db_password']}"
            f"@{config['db_host']}:{config['db_port']}/{config['db_name']}"
        )
        self.Session = sessionmaker(bind=self.engine)
    
    def extract(self) -> List[Dict[str, Any]]:
        """
        Extract plans from RDS
        
        Returns:
            List of plan records
        """
        logger.info("Extracting plans from RDS")
        
        session = self.Session()
        try:
            query = text("""
                SELECT 
                    p.plan_id,
                    p.plan_code,
                    p.year,
                    p.state,
                    p.is_national,
                    p.metal_tier,
                    p.monthly_premium,
                    p.annual_deductible,
                    p.out_of_pocket_max,
                    p.focus_areas,
                    p.age_groups,
                    p.status,
                    jsonb_object_keys(p.inclusions) as inclusions,
                    jsonb_object_keys(p.exclusions) as exclusions,
                    i.name as insurer
                FROM plans p
                LEFT JOIN plan_providers pp ON p.plan_id = pp.plan_id
                LEFT JOIN providers i ON pp.provider_id = i.provider_id
                WHERE p.status = 'active'
            """)
            
            result = session.execute(query)
            records = [dict(row._mapping) for row in result]
            
            logger.info(f"Extracted {len(records)} plans from RDS")
            return records
            
        except Exception as e:
            logger.error(f"Error extracting plans from RDS: {e}")
            raise
        finally:
            session.close()
    
    def _get_required_fields(self) -> List[str]:
        """Get required fields for plan records"""
        return [
            'plan_id', 'plan_code', 'year', 'state', 'metal_tier',
            'monthly_premium', 'annual_deductible', 'out_of_pocket_max',
            'focus_areas', 'age_groups', 'status', 'inclusions', 'exclusions'
        ]
