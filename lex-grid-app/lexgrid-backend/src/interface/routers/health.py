"""
Health check endpoints including CAP theorem monitoring.
"""

import time
from typing import Dict, Any
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text

from src.infrastructure.database.base import get_db
from src.infrastructure.cache import get_cache
from src.infrastructure.monitoring.cap_metrics import CAPMetrics

router = APIRouter()


@router.get("/health", tags=["Health"])
async def health_check(
    db: AsyncSession = Depends(get_db),
    cache = Depends(get_cache)
):
    """
    Basic health check endpoint.
    
    Returns the status of the application and its dependencies.
    """
    start_time = time.time()
    
    # Check database
    db_status = "healthy"
    try:
        await db.execute(text("SELECT 1"))
        db_duration = time.time() - start_time
        CAPMetrics.record_response_time("database", "health_check", db_duration)
    except Exception as e:
        db_status = "unhealthy"
        CAPMetrics.record_availability_error("database", "health_check")
    
    # Check cache
    cache_status = "healthy"
    try:
        await cache.ping()
        cache_duration = time.time() - start_time - db_duration
        CAPMetrics.record_response_time("cache", "health_check", cache_duration)
    except Exception as e:
        cache_status = "unhealthy"
        CAPMetrics.record_availability_error("cache", "health_check")
    
    overall_status = "healthy" if db_status == "healthy" else "degraded"
    
    return {
        "status": overall_status,
        "version": "1.0.0",
        "database": db_status,
        "redis": cache_status,
    }


@router.get("/health/cap", tags=["Health"])
async def cap_health_check(
    db: AsyncSession = Depends(get_db),
    cache = Depends(get_cache)
):
    """
    CAP theorem health check endpoint.
    
    Returns the current CAP status of each component.
    """
    start_time = time.time()
    
    # Check database (CP)
    db_status = "healthy"
    db_consistency = "strong"
    try:
        await db.execute(text("SELECT 1"))
        db_duration = time.time() - start_time
        CAPMetrics.record_response_time("database", "cap_health_check", db_duration)
    except Exception as e:
        db_status = "unhealthy"
        db_consistency = "unknown"
        CAPMetrics.record_availability_error("database", "cap_health_check")
        CAPMetrics.record_partition_event("database", "connection_failure")
    
    # Check cache (AP)
    cache_status = "healthy"
    cache_consistency = "eventual"
    try:
        await cache.ping()
        cache_duration = time.time() - start_time - db_duration
        CAPMetrics.record_response_time("cache", "cap_health_check", cache_duration)
    except Exception as e:
        cache_status = "unhealthy"
        cache_consistency = "unknown"
        CAPMetrics.record_availability_error("cache", "cap_health_check")
        CAPMetrics.record_partition_event("cache", "connection_failure")
    
    overall_status = "healthy" if db_status == "healthy" else "degraded"
    
    return {
        "database": {
            "status": db_status,
            "cap_profile": "CP",
            "consistency": db_consistency,
            "availability": "degraded_during_partition",
            "partition_tolerance": "enabled",
            "response_time_ms": db_duration * 1000 if db_status == "healthy" else None,
        },
        "cache": {
            "status": cache_status,
            "cap_profile": "AP",
            "consistency": cache_consistency,
            "availability": "high",
            "partition_tolerance": "enabled",
            "response_time_ms": cache_duration * 1000 if cache_status == "healthy" else None,
        },
        "overall": {
            "status": overall_status,
            "strategy": "hybrid_cp_ap",
            "description": "Hybrid approach using CP for critical operations and AP for non-critical operations"
        }
    }


@router.get("/health/detailed", tags=["Health"])
async def detailed_health_check(
    db: AsyncSession = Depends(get_db),
    cache = Depends(get_cache)
):
    """
    Detailed health check with component-specific information.
    """
    start_time = time.time()
    
    # Database health
    db_info = await _check_database_health(db, start_time)
    
    # Cache health
    cache_info = await _check_cache_health(cache, start_time)
    
    # Overall health
    overall_status = _calculate_overall_status(db_info, cache_info)
    
    return {
        "overall": {
            "status": overall_status,
            "timestamp": time.time(),
        },
        "components": {
            "database": db_info,
            "cache": cache_info,
        },
        "metrics": {
            "total_check_time_ms": (time.time() - start_time) * 1000,
        }
    }


async def _check_database_health(db: AsyncSession, start_time: float) -> Dict[str, Any]:
    """Check database health."""
    db_start = time.time()
    
    try:
        # Test connection
        result = await db.execute(text("SELECT 1"))
        result.fetchone()
        
        # Get connection info
        pool_info = db.bind.pool
        if pool_info:
            pool_status = pool_info.status()
        else:
            pool_status = "unknown"
        
        duration = (time.time() - db_start) * 1000
        
        CAPMetrics.record_response_time("database", "detailed_health_check", duration / 1000)
        
        return {
            "status": "healthy",
            "cap_profile": "CP",
            "connection_time_ms": duration,
            "pool_status": pool_status,
            "consistency": "strong",
            "availability": "degraded_during_partition",
        }
    except Exception as e:
        duration = (time.time() - db_start) * 1000
        CAPMetrics.record_availability_error("database", "detailed_health_check")
        
        return {
            "status": "unhealthy",
            "cap_profile": "CP",
            "error": str(e),
            "connection_time_ms": duration,
            "consistency": "unknown",
            "availability": "unavailable",
        }


async def _check_cache_health(cache, start_time: float) -> Dict[str, Any]:
    """Check cache health."""
    cache_start = time.time()
    
    try:
        # Test connection
        await cache.ping()
        
        # Get cache info
        info = await cache.client.info()
        
        duration = (time.time() - cache_start) * 1000
        
        CAPMetrics.record_response_time("cache", "detailed_health_check", duration / 1000)
        
        return {
            "status": "healthy",
            "cap_profile": "AP",
            "connection_time_ms": duration,
            "consistency": "eventual",
            "availability": "high",
            "connected_clients": info.get("connected_clients", "unknown"),
            "used_memory": info.get("used_memory_human", "unknown"),
        }
    except Exception as e:
        duration = (time.time() - cache_start) * 1000
        CAPMetrics.record_availability_error("cache", "detailed_health_check")
        
        return {
            "status": "unhealthy",
            "cap_profile": "AP",
            "error": str(e),
            "connection_time_ms": duration,
            "consistency": "unknown",
            "availability": "unavailable",
        }


def _calculate_overall_status(db_info: Dict[str, Any], cache_info: Dict[str, Any]) -> str:
    """Calculate overall system status."""
    if db_info["status"] == "healthy" and cache_info["status"] == "healthy":
        return "healthy"
    elif db_info["status"] == "healthy":
        return "degraded"
    else:
        return "unhealthy"
