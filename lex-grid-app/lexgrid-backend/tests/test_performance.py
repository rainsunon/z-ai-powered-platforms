"""
Performance tests for the LexGrid Backend API.

These tests measure response times, throughput, and resource usage
to ensure the API meets performance requirements.
"""

import asyncio
import time
import statistics
from typing import List
from httpx import AsyncClient
import pytest


class TestPerformance:
    """Performance tests for API endpoints."""

    @pytest.mark.asyncio
    async def test_health_check_performance(self, client: AsyncClient):
        """Test health check endpoint performance."""
        iterations = 100
        response_times = []
        
        for _ in range(iterations):
            start_time = time.time()
            response = await client.get("/health")
            end_time = time.time()
            
            assert response.status_code == 200
            response_times.append((end_time - start_time) * 1000)  # Convert to ms
        
        avg_time = statistics.mean(response_times)
        p95_time = statistics.quantiles(response_times, n=20)[18]  # 95th percentile
        p99_time = statistics.quantiles(response_times, n=100)[98]  # 99th percentile
        
        print(f"\nHealth Check Performance ({iterations} requests):")
        print(f"  Average: {avg_time:.2f}ms")
        print(f"  P95: {p95_time:.2f}ms")
        print(f"  P99: {p99_time:.2f}ms")
        
        # Performance assertions
        assert avg_time < 50, f"Average response time too high: {avg_time}ms"
        assert p95_time < 100, f"P95 response time too high: {p95_time}ms"

    @pytest.mark.asyncio
    async def test_list_lawyers_performance(self, client: AsyncClient):
        """Test lawyers list endpoint performance."""
        iterations = 50
        response_times = []
        
        for _ in range(iterations):
            start_time = time.time()
            response = await client.get("/api/v1/lawyers")
            end_time = time.time()
            
            assert response.status_code == 200
            response_times.append((end_time - start_time) * 1000)
        
        avg_time = statistics.mean(response_times)
        p95_time = statistics.quantiles(response_times, n=20)[18]
        
        print(f"\nList Lawyers Performance ({iterations} requests):")
        print(f"  Average: {avg_time:.2f}ms")
        print(f"  P95: {p95_time:.2f}ms")
        
        assert avg_time < 200, f"Average response time too high: {avg_time}ms"

    @pytest.mark.asyncio
    async def test_concurrent_requests(self, client: AsyncClient):
        """Test API performance under concurrent load."""
        concurrent_requests = 50
        endpoint = "/health"
        
        async def make_request():
            start_time = time.time()
            response = await client.get(endpoint)
            end_time = time.time()
            return response.status_code, (end_time - start_time) * 1000
        
        start_time = time.time()
        results = await asyncio.gather(*[make_request() for _ in range(concurrent_requests)])
        total_time = time.time() - start_time
        
        status_codes = [r[0] for r in results]
        response_times = [r[1] for r in results]
        
        success_rate = sum(1 for code in status_codes if code == 200) / len(status_codes)
        avg_time = statistics.mean(response_times)
        
        print(f"\nConcurrent Requests ({concurrent_requests} parallel):")
        print(f"  Total time: {total_time:.2f}s")
        print(f"  Success rate: {success_rate * 100:.1f}%")
        print(f"  Average response time: {avg_time:.2f}ms")
        print(f"  Requests per second: {concurrent_requests / total_time:.2f}")
        
        assert success_rate >= 0.95, f"Success rate too low: {success_rate * 100}%"
        assert avg_time < 500, f"Average response time too high: {avg_time}ms"

    @pytest.mark.asyncio
    async def test_search_lawyers_performance(self, client: AsyncClient):
        """Test lawyers search endpoint performance."""
        iterations = 30
        response_times = []
        
        for _ in range(iterations):
            start_time = time.time()
            response = await client.get("/api/v1/lawyers/search?specialty=Family Law")
            end_time = time.time()
            
            assert response.status_code == 200
            response_times.append((end_time - start_time) * 1000)
        
        avg_time = statistics.mean(response_times)
        p95_time = statistics.quantiles(response_times, n=20)[18]
        
        print(f"\nSearch Lawyers Performance ({iterations} requests):")
        print(f"  Average: {avg_time:.2f}ms")
        print(f"  P95: {p95_time:.2f}ms")
        
        assert avg_time < 300, f"Average response time too high: {avg_time}ms"

    @pytest.mark.asyncio
    async def test_pagination_performance(self, client: AsyncClient):
        """Test pagination performance."""
        page_sizes = [10, 20, 50, 100]
        
        print("\nPagination Performance:")
        for page_size in page_sizes:
            start_time = time.time()
            response = await client.get(f"/api/v1/lawyers?page=1&page_size={page_size}")
            end_time = time.time()
            
            assert response.status_code == 200
            response_time = (end_time - start_time) * 1000
            
            print(f"  Page size {page_size}: {response_time:.2f}ms")
            
            # Response time should scale reasonably with page size
            assert response_time < page_size * 5, f"Response time too high for page size {page_size}"

    @pytest.mark.asyncio
    async def test_authentication_performance(self, client: AsyncClient):
        """Test authentication endpoint performance."""
        # Register a test user
        user_data = {
            "email": "perf_test@example.com",
            "password": "TestPassword123!",
            "first_name": "Performance",
            "last_name": "Test",
        }
        await client.post("/api/v1/auth/register", json=user_data)
        
        # Test login performance
        iterations = 20
        response_times = []
        
        for _ in range(iterations):
            start_time = time.time()
            response = await client.post(
                "/api/v1/auth/login",
                json={"email": user_data["email"], "password": user_data["password"]}
            )
            end_time = time.time()
            
            assert response.status_code == 200
            response_times.append((end_time - start_time) * 1000)
        
        avg_time = statistics.mean(response_times)
        p95_time = statistics.quantiles(response_times, n=20)[18]
        
        print(f"\nAuthentication Performance ({iterations} requests):")
        print(f"  Average: {avg_time:.2f}ms")
        print(f"  P95: {p95_time:.2f}ms")
        
        assert avg_time < 500, f"Average response time too high: {avg_time}ms"

    @pytest.mark.asyncio
    async def test_database_query_performance(self, client: AsyncClient):
        """Test database query performance."""
        # Test multiple sequential queries
        iterations = 30
        response_times = []
        
        for _ in range(iterations):
            start_time = time.time()
            response = await client.get("/api/v1/lawyers")
            end_time = time.time()
            
            assert response.status_code == 200
            response_times.append((end_time - start_time) * 1000)
        
        avg_time = statistics.mean(response_times)
        std_dev = statistics.stdev(response_times)
        
        print(f"\nDatabase Query Performance ({iterations} requests):")
        print(f"  Average: {avg_time:.2f}ms")
        print(f"  Std Dev: {std_dev:.2f}ms")
        
        # Check for consistent performance
        assert std_dev < avg_time * 0.5, "Response times too inconsistent"

    @pytest.mark.asyncio
    async def test_memory_efficiency(self, client: AsyncClient):
        """Test memory efficiency with large datasets."""
        import psutil
        import os
        
        process = psutil.Process(os.getpid())
        initial_memory = process.memory_info().rss / 1024 / 1024  # MB
        
        # Make multiple requests
        for _ in range(100):
            await client.get("/api/v1/lawyers?page_size=100")
        
        final_memory = process.memory_info().rss / 1024 / 1024  # MB
        memory_increase = final_memory - initial_memory
        
        print(f"\nMemory Efficiency:")
        print(f"  Initial memory: {initial_memory:.2f}MB")
        print(f"  Final memory: {final_memory:.2f}MB")
        print(f"  Memory increase: {memory_increase:.2f}MB")
        
        # Memory increase should be reasonable (< 50MB for 100 requests)
        assert memory_increase < 50, f"Memory increase too high: {memory_increase}MB"


class TestPerformanceBenchmarks:
    """Performance benchmarks with predefined targets."""

    # Performance targets (in milliseconds)
    TARGETS = {
        "health_check": {"p50": 10, "p95": 20, "p99": 50},
        "list_lawyers": {"p50": 50, "p95": 100, "p99": 200},
        "search_lawyers": {"p50": 100, "p95": 200, "p99": 400},
        "get_lawyer": {"p50": 30, "p95": 60, "p99": 120},
        "login": {"p50": 200, "p95": 400, "p99": 800},
    }

    @pytest.mark.asyncio
    async def benchmark_health_check(self, client: AsyncClient):
        """Benchmark health check endpoint."""
        response_times = await self._collect_metrics(client, "/health", 100)
        self._assert_meets_target("health_check", response_times)

    @pytest.mark.asyncio
    async def benchmark_list_lawyers(self, client: AsyncClient):
        """Benchmark list lawyers endpoint."""
        response_times = await self._collect_metrics(client, "/api/v1/lawyers", 50)
        self._assert_meets_target("list_lawyers", response_times)

    @pytest.mark.asyncio
    async def benchmark_search_lawyers(self, client: AsyncClient):
        """Benchmark search lawyers endpoint."""
        response_times = await self._collect_metrics(
            client,
            "/api/v1/lawyers/search?specialty=Family Law",
            30
        )
        self._assert_meets_target("search_lawyers", response_times)

    async def _collect_metrics(self, client: AsyncClient, endpoint: str, iterations: int) -> List[float]:
        """Collect response time metrics for an endpoint."""
        response_times = []
        
        for _ in range(iterations):
            start_time = time.time()
            response = await client.get(endpoint)
            end_time = time.time()
            
            assert response.status_code == 200
            response_times.append((end_time - start_time) * 1000)
        
        return response_times

    def _assert_meets_target(self, endpoint_name: str, response_times: List[float]):
        """Assert that response times meet performance targets."""
        target = self.TARGETS[endpoint_name]
        
        p50 = statistics.quantiles(response_times, n=2)[0]
        p95 = statistics.quantiles(response_times, n=20)[18]
        p99 = statistics.quantiles(response_times, n=100)[98]
        
        print(f"\n{endpoint_name} Benchmark:")
        print(f"  P50: {p50:.2f}ms (target: {target['p50']}ms)")
        print(f"  P95: {p95:.2f}ms (target: {target['p95']}ms)")
        print(f"  P99: {p99:.2f}ms (target: {target['p99']}ms)")
        
        assert p50 <= target["p50"], f"P50 exceeds target: {p50}ms > {target['p50']}ms"
        assert p95 <= target["p95"], f"P95 exceeds target: {p95}ms > {target['p95']}ms"
        assert p99 <= target["p99"], f"P99 exceeds target: {p99}ms > {target['p99']}ms"
