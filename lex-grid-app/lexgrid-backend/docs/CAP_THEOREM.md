# CAP Theorem Implementation for LexGrid Backend

## Overview

The CAP theorem states that a distributed data store can only simultaneously provide two out of the following three guarantees:

1. **Consistency (C)**: Every read receives the most recent write or an error
2. **Availability (A)**: Every request receives a (non-error) response, without the guarantee that it contains the most recent write
3. **Partition Tolerance (P)**: The system continues to operate despite an arbitrary number of messages being dropped or delayed by the network between nodes

## System Architecture and CAP Trade-offs

### Current Architecture Analysis

The LexGrid backend uses:
- **PostgreSQL** as the primary database (CP system)
- **Redis** as a caching layer (AP system)
- **FastAPI** with async operations
- **Docker Compose** for orchestration

### CAP Configuration by Component

#### 1. PostgreSQL Database (CP - Consistency + Partition Tolerance)

**Configuration**: Strong consistency with partition tolerance

```python
# Database configuration for CP behavior
DATABASE_CONFIG = {
    "isolation_level": "SERIALIZABLE",  # Strongest isolation
    "synchronous_commit": "on",        # Ensure data durability
    "max_standby_streaming_delay": -1,  # Wait for all replicas
}
```

**Trade-offs**:
- **Pros**: Strong data consistency, ACID transactions, reliable data
- **Cons**: Potential availability issues during network partitions
- **Use Case**: Critical data (users, cases, subscriptions) where consistency is paramount

**Implementation**:

```python
# src/infrastructure/database/base.py
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker

# CP Configuration: Strong consistency
engine = create_async_engine(
    DATABASE_URL,
    echo=False,
    pool_pre_ping=True,
    # Strong consistency settings
    connect_args={
        "server_settings": {
            "default_transaction_isolation": "serializable",
            "synchronous_commit": "on",
        }
    },
    # Connection pool for availability
    pool_size=20,
    max_overflow=10,
    pool_timeout=30,
    pool_recycle=3600,
)

# Session factory with consistent reads
AsyncSessionLocal = sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)
```

#### 2. Redis Cache (AP - Availability + Partition Tolerance)

**Configuration**: High availability with eventual consistency

```python
# Cache configuration for AP behavior
CACHE_CONFIG = {
    "socket_timeout": 5,           # Fast fail for availability
    "socket_connect_timeout": 5,
    "retry_on_timeout": False,     # Don't retry on timeout
    "max_connections": 50,
    "health_check_interval": 30,
}
```

**Trade-offs**:
- **Pros**: High availability, low latency, partition tolerant
- **Cons**: Eventual consistency, potential stale data
- **Use Case**: Non-critical data (session tokens, search results, lawyer listings)

**Implementation**:

```python
# src/infrastructure/cache.py
import redis.asyncio as redis
from typing import Optional, Any
import json

class CacheService:
    """Redis cache service with AP configuration."""
    
    def __init__(self):
        self.client: Optional[redis.Redis] = None
    
    async def connect(self):
        """Connect to Redis with AP settings."""
        self.client = redis.Redis(
            host=settings.redis_host,
            port=settings.redis_port,
            db=settings.redis_db,
            password=settings.redis_password,
            # AP Configuration: High availability
            socket_timeout=5,
            socket_connect_timeout=5,
            socket_keepalive=True,
            socket_keepalive_options={},
            retry_on_timeout=False,  # Fast fail
            max_connections=50,
            health_check_interval=30,
            decode_responses=True,
        )
    
    async def get(self, key: str) -> Optional[Any]:
        """Get value from cache with fast fail."""
        try:
            value = await self.client.get(key)
            if value:
                return json.loads(value)
            return None
        except Exception:
            # AP: Return None on error (availability over consistency)
            return None
    
    async def set(self, key: str, value: Any, ttl: int = 3600):
        """Set value in cache with TTL."""
        try:
            await self.client.setex(
                key,
                ttl,
                json.dumps(value)
            )
        except Exception:
            # AP: Log error but don't fail (availability)
            pass
    
    async def delete(self, key: str):
        """Delete key from cache."""
        try:
            await self.client.delete(key)
        except Exception:
            pass
```

#### 3. Hybrid Approach (CA for Critical Operations)

For critical operations requiring both consistency and availability, we implement a hybrid approach:

```python
# src/application/use_cases.py
from typing import Optional
from src.infrastructure.cache import get_cache
from src.infrastructure.database.base import get_db

class HybridRepository:
    """Repository with hybrid CP/AP behavior."""
    
    async def get_user(self, user_id: str, use_cache: bool = True) -> Optional[User]:
        """
        Get user with hybrid strategy.
        
        - For critical operations: Read from DB (CP)
        - For non-critical operations: Read from cache (AP)
        """
        cache = await get_cache()
        
        if use_cache:
            # AP: Try cache first for availability
            cached_user = await cache.get(f"user:{user_id}")
            if cached_user:
                return cached_user
        
        # CP: Fall back to database for consistency
        async with get_db() as db:
            user = await db.execute(
                select(UserModel).where(UserModel.id == user_id)
            )
            user_model = user.scalar_one_or_none()
            
            if user_model:
                user_entity = self._model_to_entity(user_model)
                # Update cache asynchronously
                if use_cache:
                    await cache.set(f"user:{user_id}", user_entity.dict(), ttl=300)
                return user_entity
            
            return None
    
    async def save_user(self, user: User) -> User:
        """
        Save user with CP behavior.
        
        Always write to database first for consistency,
        then update cache asynchronously.
        """
        async with get_db() as db:
            user_model = self._entity_to_model(user)
            db.add(user_model)
            await db.commit()
            await db.refresh(user_model)
            
            saved_user = self._model_to_entity(user_model)
        
        # Update cache asynchronously (fire and forget)
        cache = await get_cache()
        await cache.set(f"user:{user.id}", saved_user.dict(), ttl=300)
        
        return saved_user
```

## CAP Strategies by Use Case

### 1. Authentication (CP)

**Requirement**: Strong consistency for security

```python
# src/interface/routers/auth.py
from fastapi import Depends, HTTPException, status
from src.infrastructure.database.base import get_db
from src.infrastructure.security import JWTService

@router.post("/login")
async def login(
    credentials: LoginRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Login with CP behavior.
    
    Always authenticate against the database
    to ensure strong consistency.
    """
    # CP: Read from database (no cache)
    user = await user_repository.find_by_email(credentials.email, db)
    
    if not user or not user.verify_password(credentials.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    
    # Generate tokens
    jwt_service = JWTService()
    access_token = jwt_service.create_access_token(user.id)
    refresh_token = jwt_service.create_refresh_token(user.id)
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user": user
    }
```

### 2. Lawyer Directory (AP)

**Requirement**: High availability and low latency

```python
# src/interface/routers/lawyers.py
from fastapi import Depends, Query
from src.infrastructure.cache import get_cache

@router.get("/lawyers")
async def list_lawyers(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    cache: CacheService = Depends(get_cache)
):
    """
    List lawyers with AP behavior.
    
    Use cache for high availability and low latency.
    Accept eventual consistency.
    """
    cache_key = f"lawyers:page:{page}:size:{page_size}"
    
    # AP: Try cache first
    cached_result = await cache.get(cache_key)
    if cached_result:
        return cached_result
    
    # Fallback to database
    lawyers = await lawyer_repository.find_all(
        page=page,
        page_size=page_size
    )
    
    result = {
        "items": lawyers,
        "total": len(lawyers),
        "page": page,
        "page_size": page_size
    }
    
    # Update cache with short TTL
    await cache.set(cache_key, result, ttl=60)
    
    return result
```

### 3. Case Management (CP)

**Requirement**: Strong consistency for legal documents

```python
# src/interface/routers/cases.py
from fastapi import Depends, HTTPException, status
from src.infrastructure.database.base import get_db

@router.post("/cases")
async def create_case(
    case_data: CaseCreateRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Create case with CP behavior.
    
    Always write to database with strong consistency.
    No caching for critical legal data.
    """
    # CP: Direct database write
    case = Case(
        id=uuid4(),
        user_id=current_user.id,
        title=case_data.title,
        description=case_data.description,
        case_type=case_data.case_type,
        status=case_data.status,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    
    db.add(case)
    await db.commit()
    await db.refresh(case)
    
    return case
```

### 4. AI Chat (AP)

**Requirement**: High availability for real-time interaction

```python
# src/interface/routers/chat.py
from fastapi import Depends
from src.infrastructure.cache import get_cache

@router.post("/conversations/{conversation_id}/messages")
async def send_message(
    conversation_id: str,
    message_data: MessageCreateRequest,
    current_user: User = Depends(get_current_user),
    cache: CacheService = Depends(get_cache)
):
    """
    Send message with AP behavior.
    
    Use cache for conversation history.
    Accept eventual consistency for chat messages.
    """
    # AP: Try to get conversation from cache
    cache_key = f"conversation:{conversation_id}"
    cached_conversation = await cache.get(cache_key)
    
    if cached_conversation:
        conversation = cached_conversation
    else:
        # Fallback to database
        conversation = await conversation_repository.find_by_id(conversation_id)
    
    # Create message
    message = Message(
        id=uuid4(),
        conversation_id=conversation_id,
        role=message_data.role,
        content=message_data.content,
        created_at=datetime.utcnow()
    )
    
    # Save to database asynchronously
    await message_repository.save(message)
    
    # Update cache
    conversation.messages.append(message)
    await cache.set(cache_key, conversation, ttl=300)
    
    return message
```

## Partition Handling Strategies

### 1. Database Partition Handling

```python
# src/infrastructure/database/partition_handler.py
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
import logging

logger = logging.getLogger(__name__)

class DatabasePartitionHandler:
    """Handle database partitions with CP behavior."""
    
    @staticmethod
    async def execute_with_retry(
        operation,
        max_retries: int = 3,
        retry_delay: float = 1.0
    ):
        """
        Execute operation with retry logic.
        
        CP: Retry on partition errors to maintain consistency.
        """
        import asyncio
        
        for attempt in range(max_retries):
            try:
                return await operation()
            except Exception as e:
                if attempt == max_retries - 1:
                    logger.error(f"Operation failed after {max_retries} attempts: {e}")
                    raise
                
                logger.warning(f"Attempt {attempt + 1} failed, retrying: {e}")
                await asyncio.sleep(retry_delay * (attempt + 1))
    
    @staticmethod
    async def execute_read_only(
        operation,
        fallback_to_replica: bool = True
    ):
        """
        Execute read operation with fallback.
        
        CP: Try primary first, fallback to replica if available.
        """
        try:
            return await operation()
        except Exception as e:
            if fallback_to_replica:
                logger.warning(f"Primary read failed, trying replica: {e}")
                # In production, this would connect to a read replica
                return await operation()
            raise
```

### 2. Cache Partition Handling

```python
# src/infrastructure/cache/partition_handler.py
from typing import Optional, Any
import logging

logger = logging.getLogger(__name__)

class CachePartitionHandler:
    """Handle cache partitions with AP behavior."""
    
    @staticmethod
    async def get_with_fallback(
        cache_service,
        key: str,
        fallback_operation,
        ttl: int = 300
    ) -> Optional[Any]:
        """
        Get from cache with fallback to database.
        
        AP: Fast fail on cache error, use fallback.
        """
        try:
            value = await cache_service.get(key)
            if value is not None:
                return value
        except Exception as e:
            logger.warning(f"Cache read failed: {e}")
        
        # Fallback to database
        value = await fallback_operation()
        
        # Try to update cache asynchronously
        try:
            await cache_service.set(key, value, ttl)
        except Exception as e:
            logger.warning(f"Cache update failed: {e}")
        
        return value
    
    @staticmethod
    async def set_with_retry(
        cache_service,
        key: str,
        value: Any,
        ttl: int = 300,
        max_retries: int = 2
    ):
        """
        Set in cache with limited retry.
        
        AP: Limited retry, fail fast for availability.
        """
        import asyncio
        
        for attempt in range(max_retries):
            try:
                await cache_service.set(key, value, ttl)
                return
            except Exception as e:
                if attempt == max_retries - 1:
                    logger.warning(f"Cache set failed after {max_retries} attempts: {e}")
                    return
                
                await asyncio.sleep(0.1 * (attempt + 1))
```

## Monitoring and Observability

### CAP Metrics

```python
# src/infrastructure/monitoring/cap_metrics.py
from prometheus_client import Counter, Histogram, Gauge
import time

# CAP Metrics
consistency_violations = Counter(
    'cap_consistency_violations_total',
    'Total number of consistency violations',
    ['component']
)

availability_errors = Counter(
    'cap_availability_errors_total',
    'Total number of availability errors',
    ['component']
)

partition_events = Counter(
    'cap_partition_events_total',
    'Total number of partition events',
    ['component']
)

response_time = Histogram(
    'cap_response_time_seconds',
    'Response time by component',
    ['component', 'operation']
)

cache_hit_rate = Gauge(
    'cap_cache_hit_rate',
    'Cache hit rate',
    ['component']
)

class CAPMetrics:
    """Monitor CAP properties."""
    
    @staticmethod
    def record_consistency_violation(component: str):
        """Record a consistency violation."""
        consistency_violations.labels(component=component).inc()
    
    @staticmethod
    def record_availability_error(component: str):
        """Record an availability error."""
        availability_errors.labels(component=component).inc()
    
    @staticmethod
    def record_partition_event(component: str):
        """Record a partition event."""
        partition_events.labels(component=component).inc()
    
    @staticmethod
    def record_response_time(component: str, operation: str, duration: float):
        """Record response time."""
        response_time.labels(
            component=component,
            operation=operation
        ).observe(duration)
    
    @staticmethod
    def update_cache_hit_rate(component: str, rate: float):
        """Update cache hit rate."""
        cache_hit_rate.labels(component=component).set(rate)
```

### CAP Health Checks

```python
# src/interface/routers/health.py
from fastapi import APIRouter, Depends
from src.infrastructure.database.base import get_db
from src.infrastructure.cache import get_cache
from src.infrastructure.monitoring.cap_metrics import CAPMetrics

router = APIRouter()

@router.get("/health/cap")
async def cap_health_check(
    db: AsyncSession = Depends(get_db),
    cache: CacheService = Depends(get_cache)
):
    """
    CAP health check endpoint.
    
    Returns the current CAP status of each component.
    """
    start_time = time.time()
    
    # Check database (CP)
    db_status = "healthy"
    try:
        await db.execute("SELECT 1")
        db_duration = time.time() - start_time
        CAPMetrics.record_response_time("database", "health_check", db_duration)
    except Exception as e:
        db_status = "unhealthy"
        CAPMetrics.record_availability_error("database")
        CAPMetrics.record_partition_event("database")
    
    # Check cache (AP)
    cache_status = "healthy"
    try:
        await cache.ping()
        cache_duration = time.time() - start_time - db_duration
        CAPMetrics.record_response_time("cache", "health_check", cache_duration)
    except Exception as e:
        cache_status = "unhealthy"
        CAPMetrics.record_availability_error("cache")
        CAPMetrics.record_partition_event("cache")
    
    return {
        "database": {
            "status": db_status,
            "cap_profile": "CP",
            "consistency": "strong",
            "availability": "degraded_during_partition"
        },
        "cache": {
            "status": cache_status,
            "cap_profile": "AP",
            "consistency": "eventual",
            "availability": "high"
        },
        "overall": {
            "status": "healthy" if db_status == "healthy" else "degraded",
            "strategy": "hybrid_cp_ap"
        }
    }
```

## Recommendations

### For Production Deployment

1. **Database (CP)**:
   - Use PostgreSQL with synchronous replication
   - Configure connection pooling for availability
   - Implement retry logic for transient failures
   - Monitor consistency violations

2. **Cache (AP)**:
   - Use Redis Cluster for high availability
   - Configure fast fail settings
   - Implement cache warming strategies
   - Monitor cache hit rates

3. **Hybrid Strategy**:
   - Use CP for critical operations (auth, cases, billing)
   - Use AP for non-critical operations (search, listings)
   - Implement circuit breakers for partition handling
   - Use read replicas for scaling

4. **Monitoring**:
   - Track CAP metrics for all components
   - Set up alerts for consistency violations
   - Monitor partition events
   - Track response times and availability

### CAP Trade-off Summary

| Component | CAP Profile | Consistency | Availability | Use Case |
|-----------|-------------|--------------|--------------|----------|
| PostgreSQL | CP | Strong | Degraded during partition | Critical data |
| Redis | AP | Eventual | High | Caching |
| Authentication | CP | Strong | Degraded | Security |
| Lawyer Directory | AP | Eventual | High | Search |
| Case Management | CP | Strong | Degraded | Legal documents |
| AI Chat | AP | Eventual | High | Real-time |
| Billing | CP | Strong | Degraded | Financial |
