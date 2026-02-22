"""
CAP theorem metrics monitoring.

This module provides Prometheus metrics for monitoring CAP properties
(Consistency, Availability, Partition Tolerance) across system components.
"""

from prometheus_client import Counter, Histogram, Gauge
from typing import Optional
import time

# ==================== CAP Metrics ====================

# Consistency Metrics
consistency_violations = Counter(
    'cap_consistency_violations_total',
    'Total number of consistency violations',
    ['component', 'operation']
)

stale_reads = Counter(
    'cap_stale_reads_total',
    'Total number of stale reads from cache',
    ['component']
)

# Availability Metrics
availability_errors = Counter(
    'cap_availability_errors_total',
    'Total number of availability errors',
    ['component', 'operation']
)

successful_requests = Counter(
    'cap_successful_requests_total',
    'Total number of successful requests',
    ['component', 'operation']
)

# Partition Metrics
partition_events = Counter(
    'cap_partition_events_total',
    'Total number of partition events',
    ['component', 'type']
)

retry_attempts = Counter(
    'cap_retry_attempts_total',
    'Total number of retry attempts',
    ['component', 'operation']
)

# Performance Metrics
response_time = Histogram(
    'cap_response_time_seconds',
    'Response time by component and operation',
    ['component', 'operation'],
    buckets=(0.005, 0.01, 0.025, 0.05, 0.075, 0.1, 0.25, 0.5, 0.75, 1.0, 2.5, 5.0, 7.5, 10.0)
)

database_query_time = Histogram(
    'cap_database_query_time_seconds',
    'Database query time',
    ['operation'],
    buckets=(0.001, 0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1.0, 2.5, 5.0)
)

cache_operation_time = Histogram(
    'cap_cache_operation_time_seconds',
    'Cache operation time',
    ['operation'],
    buckets=(0.0001, 0.0005, 0.001, 0.005, 0.01, 0.025, 0.05, 0.1)
)

# Cache Metrics
cache_hit_rate = Gauge(
    'cap_cache_hit_rate',
    'Cache hit rate by component',
    ['component']
)

cache_misses = Counter(
    'cap_cache_misses_total',
    'Total number of cache misses',
    ['component']
)

cache_hits = Counter(
    'cap_cache_hits_total',
    'Total number of cache hits',
    ['component']
)

# Connection Metrics
active_connections = Gauge(
    'cap_active_connections',
    'Number of active connections',
    ['component']
)

connection_errors = Counter(
    'cap_connection_errors_total',
    'Total number of connection errors',
    ['component']
)

# Transaction Metrics
transaction_commits = Counter(
    'cap_transaction_commits_total',
    'Total number of transaction commits',
    ['component']
)

transaction_rollbacks = Counter(
    'cap_transaction_rollbacks_total',
    'Total number of transaction rollbacks',
    ['component']
)

transaction_time = Histogram(
    'cap_transaction_time_seconds',
    'Transaction time',
    ['component'],
    buckets=(0.01, 0.05, 0.1, 0.25, 0.5, 1.0, 2.5, 5.0, 10.0)
)


class CAPMetrics:
    """Monitor CAP properties across system components."""
    
    # ==================== Consistency Metrics ====================
    
    @staticmethod
    def record_consistency_violation(component: str, operation: str):
        """Record a consistency violation."""
        consistency_violations.labels(
            component=component,
            operation=operation
        ).inc()
    
    @staticmethod
    def record_stale_read(component: str):
        """Record a stale read from cache."""
        stale_reads.labels(component=component).inc()
    
    # ==================== Availability Metrics ====================
    
    @staticmethod
    def record_availability_error(component: str, operation: str):
        """Record an availability error."""
        availability_errors.labels(
            component=component,
            operation=operation
        ).inc()
    
    @staticmethod
    def record_successful_request(component: str, operation: str):
        """Record a successful request."""
        successful_requests.labels(
            component=component,
            operation=operation
        ).inc()
    
    # ==================== Partition Metrics ====================
    
    @staticmethod
    def record_partition_event(component: str, event_type: str):
        """Record a partition event."""
        partition_events.labels(
            component=component,
            type=event_type
        ).inc()
    
    @staticmethod
    def record_retry_attempt(component: str, operation: str):
        """Record a retry attempt."""
        retry_attempts.labels(
            component=component,
            operation=operation
        ).inc()
    
    # ==================== Performance Metrics ====================
    
    @staticmethod
    def record_response_time(component: str, operation: str, duration: float):
        """Record response time."""
        response_time.labels(
            component=component,
            operation=operation
        ).observe(duration)
    
    @staticmethod
    def record_database_query_time(operation: str, duration: float):
        """Record database query time."""
        database_query_time.labels(operation=operation).observe(duration)
    
    @staticmethod
    def record_cache_operation_time(operation: str, duration: float):
        """Record cache operation time."""
        cache_operation_time.labels(operation=operation).observe(duration)
    
    # ==================== Cache Metrics ====================
    
    @staticmethod
    def record_cache_hit(component: str):
        """Record a cache hit."""
        cache_hits.labels(component=component).inc()
    
    @staticmethod
    def record_cache_miss(component: str):
        """Record a cache miss."""
        cache_misses.labels(component=component).inc()
    
    @staticmethod
    def update_cache_hit_rate(component: str, rate: float):
        """Update cache hit rate."""
        cache_hit_rate.labels(component=component).set(rate)
    
    # ==================== Connection Metrics ====================
    
    @staticmethod
    def update_active_connections(component: str, count: int):
        """Update active connections count."""
        active_connections.labels(component=component).set(count)
    
    @staticmethod
    def record_connection_error(component: str):
        """Record a connection error."""
        connection_errors.labels(component=component).inc()
    
    # ==================== Transaction Metrics ====================
    
    @staticmethod
    def record_transaction_commit(component: str):
        """Record a transaction commit."""
        transaction_commits.labels(component=component).inc()
    
    @staticmethod
    def record_transaction_rollback(component: str):
        """Record a transaction rollback."""
        transaction_rollbacks.labels(component=component).inc()
    
    @staticmethod
    def record_transaction_time(component: str, duration: float):
        """Record transaction time."""
        transaction_time.labels(component=component).observe(duration)


class CAPMetricsContext:
    """Context manager for measuring CAP metrics."""
    
    def __init__(self, component: str, operation: str):
        self.component = component
        self.operation = operation
        self.start_time: Optional[float] = None
        self.success = False
    
    def __enter__(self):
        self.start_time = time.time()
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        if self.start_time is None:
            return
        
        duration = time.time() - self.start_time
        
        if exc_type is None:
            self.success = True
            CAPMetrics.record_successful_request(self.component, self.operation)
        else:
            CAPMetrics.record_availability_error(self.component, self.operation)
        
        CAPMetrics.record_response_time(self.component, self.operation, duration)
    
    def mark_success(self):
        """Mark the operation as successful."""
        self.success = True
    
    def mark_failure(self):
        """Mark the operation as failed."""
        self.success = False


def measure_cap_metrics(component: str, operation: str):
    """
    Decorator for measuring CAP metrics.
    
    Args:
        component: The component name
        operation: The operation name
        
    Returns:
        Decorated function with CAP metrics
    """
    def decorator(func):
        async def wrapper(*args, **kwargs):
            with CAPMetricsContext(component, operation):
                return await func(*args, **kwargs)
        return wrapper
    return decorator


class CacheMetricsTracker:
    """Track cache metrics for a component."""
    
    def __init__(self, component: str):
        self.component = component
        self.hits = 0
        self.misses = 0
    
    def record_hit(self):
        """Record a cache hit."""
        self.hits += 1
        CAPMetrics.record_cache_hit(self.component)
        self._update_hit_rate()
    
    def record_miss(self):
        """Record a cache miss."""
        self.misses += 1
        CAPMetrics.record_cache_miss(self.component)
        self._update_hit_rate()
    
    def _update_hit_rate(self):
        """Update the cache hit rate."""
        total = self.hits + self.misses
        if total > 0:
            rate = self.hits / total
            CAPMetrics.update_cache_hit_rate(self.component, rate)
    
    def get_hit_rate(self) -> float:
        """Get the current hit rate."""
        total = self.hits + self.misses
        return self.hits / total if total > 0 else 0.0
    
    def reset(self):
        """Reset the metrics."""
        self.hits = 0
        self.misses = 0
