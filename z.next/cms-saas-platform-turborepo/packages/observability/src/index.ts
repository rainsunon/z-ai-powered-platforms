import { getLogger, Logger } from '@cms/logger';

// ─── OpenTelemetry Setup ───────────────────────────────

export interface TracingConfig {
  serviceName: string;
  endpoint?: string;
  enabled?: boolean;
}

export interface MetricsConfig {
  port?: number;
  prefix?: string;
}

// ─── Simple Metrics Collector ───────────────────────────

export class MetricsCollector {
  private counters: Map<string, number> = new Map();
  private histograms: Map<string, number[]> = new Map();
  private gauges: Map<string, number> = new Map();
  private logger: Logger;

  constructor(private prefix: string = 'cms') {
    this.logger = getLogger({ service: 'metrics' });
  }

  incrementCounter(name: string, labels?: Record<string, string>): void {
    const key = this.buildKey(name, labels);
    this.counters.set(key, (this.counters.get(key) ?? 0) + 1);
  }

  recordHistogram(name: string, value: number, labels?: Record<string, string>): void {
    const key = this.buildKey(name, labels);
    const values = this.histograms.get(key) ?? [];
    values.push(value);
    this.histograms.set(key, values);
  }

  setGauge(name: string, value: number, labels?: Record<string, string>): void {
    const key = this.buildKey(name, labels);
    this.gauges.set(key, value);
  }

  getCounter(name: string): number {
    return this.counters.get(this.buildKey(name)) ?? 0;
  }

  getGauge(name: string): number | undefined {
    return this.gauges.get(this.buildKey(name));
  }

  getHistogramStats(name: string): { min: number; max: number; avg: number; p95: number; count: number } | null {
    const values = this.histograms.get(this.buildKey(name));
    if (!values || values.length === 0) return null;

    const sorted = [...values].sort((a, b) => a - b);
    const p95Index = Math.floor(sorted.length * 0.95);

    return {
      min: sorted[0],
      max: sorted[sorted.length - 1],
      avg: values.reduce((a, b) => a + b, 0) / values.length,
      p95: sorted[p95Index],
      count: values.length,
    };
  }

  // Prometheus-compatible output
  toPrometheus(): string {
    const lines: string[] = [];

    for (const [key, value] of this.counters) {
      lines.push(`${key}_total ${value}`);
    }
    for (const [key, value] of this.gauges) {
      lines.push(`${key} ${value}`);
    }
    for (const [key, values] of this.histograms) {
      const stats = this.getHistogramStats(key.replace(`${this.prefix}_`, ''));
      if (stats) {
        lines.push(`${key}_count ${stats.count}`);
        lines.push(`${key}_sum ${values.reduce((a, b) => a + b, 0)}`);
      }
    }

    return lines.join('\n');
  }

  private buildKey(name: string, labels?: Record<string, string>): string {
    let key = `${this.prefix}_${name}`;
    if (labels) {
      const labelStr = Object.entries(labels)
        .map(([k, v]) => `${k}="${v}"`)
        .join(',');
      key += `{${labelStr}}`;
    }
    return key;
  }
}

// ─── Request Timing ───────────────────────────────────

export function createRequestTimer() {
  const start = process.hrtime.bigint();

  return {
    end(): number {
      const end = process.hrtime.bigint();
      return Number(end - start) / 1_000_000; // milliseconds
    },
  };
}

// ─── Health Check Aggregator ───────────────────────────

export interface HealthCheck {
  name: string;
  check: () => Promise<boolean>;
}

export interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  checks: Record<string, { status: 'up' | 'down'; responseTime: number }>;
  uptime: number;
  timestamp: string;
}

export class HealthChecker {
  private checks: HealthCheck[] = [];
  private startTime = Date.now();

  register(check: HealthCheck): void {
    this.checks.push(check);
  }

  async check(): Promise<HealthStatus> {
    const results: Record<string, { status: 'up' | 'down'; responseTime: number }> = {};
    let allHealthy = true;

    for (const hc of this.checks) {
      const start = Date.now();
      try {
        const ok = await hc.check();
        results[hc.name] = { status: ok ? 'up' : 'down', responseTime: Date.now() - start };
        if (!ok) allHealthy = false;
      } catch {
        results[hc.name] = { status: 'down', responseTime: Date.now() - start };
        allHealthy = false;
      }
    }

    const anyDown = Object.values(results).some((r) => r.status === 'down');

    return {
      status: allHealthy ? 'healthy' : anyDown ? 'unhealthy' : 'degraded',
      checks: results,
      uptime: Date.now() - this.startTime,
      timestamp: new Date().toISOString(),
    };
  }
}

// ─── Singleton ───────────────────────────────────

let _metrics: MetricsCollector | null = null;
let _healthChecker: HealthChecker | null = null;

export function getMetrics(prefix?: string): MetricsCollector {
  if (!_metrics) {
    _metrics = new MetricsCollector(prefix);
  }
  return _metrics;
}

export function getHealthChecker(): HealthChecker {
  if (!_healthChecker) {
    _healthChecker = new HealthChecker();
  }
  return _healthChecker;
}
