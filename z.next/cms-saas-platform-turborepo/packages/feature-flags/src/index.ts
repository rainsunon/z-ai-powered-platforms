import { getLogger, Logger } from '@cms/logger';

// ─── Feature Flag Types ───────────────────────────────

export type FlagScope = 'global' | 'tenant' | 'role' | 'user' | 'environment';

export interface FeatureFlag {
  key: string;
  enabled: boolean;
  scope: FlagScope;
  scopeId?: string;
  description?: string;
  metadata?: Record<string, unknown>;
  percentage?: number; // For gradual rollout (0-100)
}

// ─── Feature Flag Store ───────────────────────────────

class FeatureFlagStore {
  private flags: Map<string, FeatureFlag[]> = new Map();
  private logger: Logger;

  constructor() {
    this.logger = getLogger({ service: 'feature-flags' });
  }

  register(flag: FeatureFlag): void {
    const existing = this.flags.get(flag.key) ?? [];
    existing.push(flag);
    this.flags.set(flag.key, existing);
    this.logger.debug({ key: flag.key, scope: flag.scope }, 'Feature flag registered');
  }

  isEnabled(
    key: string,
    context?: { tenantId?: string; userId?: string; role?: string; environment?: string },
  ): boolean {
    const flagVariants = this.flags.get(key);
    if (!flagVariants || flagVariants.length === 0) return false;

    // Check most specific scope first
    if (context?.userId) {
      const userFlag = flagVariants.find((f) => f.scope === 'user' && f.scopeId === context.userId);
      if (userFlag) return userFlag.enabled;
    }

    if (context?.role) {
      const roleFlag = flagVariants.find((f) => f.scope === 'role' && f.scopeId === context.role);
      if (roleFlag) return roleFlag.enabled;
    }

    if (context?.tenantId) {
      const tenantFlag = flagVariants.find((f) => f.scope === 'tenant' && f.scopeId === context.tenantId);
      if (tenantFlag) return tenantFlag.enabled;
    }

    if (context?.environment) {
      const envFlag = flagVariants.find((f) => f.scope === 'environment' && f.scopeId === context.environment);
      if (envFlag) return envFlag.enabled;
    }

    // Fallback to global
    const globalFlag = flagVariants.find((f) => f.scope === 'global');
    if (globalFlag) {
      if (globalFlag.percentage !== undefined && context?.userId) {
        const hash = simpleHash(key + context.userId);
        return hash % 100 < globalFlag.percentage;
      }
      return globalFlag.enabled;
    }

    return false;
  }

  getAll(): FeatureFlag[] {
    const all: FeatureFlag[] = [];
    for (const flags of this.flags.values()) {
      all.push(...flags);
    }
    return all;
  }

  remove(key: string, scope?: FlagScope, scopeId?: string): void {
    if (!scope) {
      this.flags.delete(key);
    } else {
      const existing = this.flags.get(key) ?? [];
      this.flags.set(
        key,
        existing.filter((f) => !(f.scope === scope && f.scopeId === scopeId)),
      );
    }
  }

  clear(): void {
    this.flags.clear();
  }
}

function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash + char) | 0;
  }
  return Math.abs(hash);
}

// ─── Singleton ───────────────────────────────────

let _store: FeatureFlagStore | null = null;

export function getFeatureFlags(): FeatureFlagStore {
  if (!_store) {
    _store = new FeatureFlagStore();
  }
  return _store;
}

export function resetFeatureFlags(): void {
  _store = null;
}

export function registerDefaultFlags(): void {
  const store = getFeatureFlags();

  store.register({ key: 'analytics', enabled: true, scope: 'global' });
  store.register({ key: 'ai_tools', enabled: false, scope: 'global' });
  store.register({ key: 'experimental_editor', enabled: false, scope: 'global' });
  store.register({ key: 'comments', enabled: true, scope: 'global' });
  store.register({ key: 'plugins', enabled: true, scope: 'global' });
  store.register({ key: 'billing', enabled: true, scope: 'global' });
  store.register({ key: 'webhooks', enabled: true, scope: 'global' });
  store.register({ key: 'multi_language', enabled: false, scope: 'global' });
  store.register({ key: 'advanced_search', enabled: true, scope: 'global' });
}

export { FeatureFlagStore };
