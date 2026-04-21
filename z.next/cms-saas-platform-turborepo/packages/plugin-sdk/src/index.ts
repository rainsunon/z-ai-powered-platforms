import { EventType, EventHandler } from '@cms/messaging';
import { FastifyInstance } from 'fastify';
import { Knex } from 'knex';

// ─── Plugin Manifest ───────────────────────────────────

export interface PluginManifest {
  name: string;
  version: string;
  description: string;
  author: string;
  license: string;
  homepage?: string;
  repository?: string;
  engines?: { cms: string };
  permissions?: string[];
  settings?: PluginSettingDefinition[];
}

export interface PluginSettingDefinition {
  key: string;
  type: 'string' | 'number' | 'boolean' | 'select';
  label: string;
  description?: string;
  default?: unknown;
  required?: boolean;
  options?: Array<{ label: string; value: string }>;
}

// ─── Plugin Context ───────────────────────────────────

export interface PluginContext {
  tenantId: string;
  settings: Record<string, unknown>;
  logger: {
    info: (msg: string, data?: Record<string, unknown>) => void;
    warn: (msg: string, data?: Record<string, unknown>) => void;
    error: (msg: string, data?: Record<string, unknown>) => void;
  };
  database: {
    query: Knex;
    runMigration: (migration: Knex.Migration) => Promise<void>;
  };
  storage: {
    get: (key: string) => Promise<unknown>;
    set: (key: string, value: unknown) => Promise<void>;
    del: (key: string) => Promise<void>;
  };
}

// ─── Plugin Hooks ───────────────────────────────────

export interface PluginHooks {
  onInstall?: (ctx: PluginContext) => Promise<void>;
  onActivate?: (ctx: PluginContext) => Promise<void>;
  onDeactivate?: (ctx: PluginContext) => Promise<void>;
  onUninstall?: (ctx: PluginContext) => Promise<void>;
  onSettingsUpdate?: (ctx: PluginContext, settings: Record<string, unknown>) => Promise<void>;
}

// ─── Plugin API Extensions ───────────────────────────

export interface PluginApiExtension {
  prefix: string;
  routes: (app: FastifyInstance, ctx: PluginContext) => Promise<void>;
}

// ─── Plugin Event Subscriptions ───────────────────────

export interface PluginEventSubscription {
  event: EventType;
  handler: EventHandler;
}

// ─── Plugin UI Extensions ───────────────────────────

export interface PluginUiExtension {
  slot: 'sidebar' | 'toolbar' | 'settings' | 'dashboard' | 'content-editor' | 'media-library';
  component: string;
  props?: Record<string, unknown>;
}

// ─── Plugin Block Types ───────────────────────────

export interface PluginBlockType {
  type: string;
  label: string;
  icon: string;
  schema: Record<string, unknown>;
  renderer: string;
  editor: string;
}

// ─── Plugin Definition ───────────────────────────────

export interface CmsPlugin {
  manifest: PluginManifest;
  hooks?: PluginHooks;
  api?: PluginApiExtension[];
  events?: PluginEventSubscription[];
  ui?: PluginUiExtension[];
  blocks?: PluginBlockType[];
}

// ─── Plugin Builder ───────────────────────────────────

export function definePlugin(plugin: CmsPlugin): CmsPlugin {
  return plugin;
}

// ─── Plugin Validation ───────────────────────────────

export function validateManifest(manifest: PluginManifest): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!manifest.name || manifest.name.length < 3) {
    errors.push('Plugin name must be at least 3 characters');
  }
  if (!manifest.version || !/^\d+\.\d+\.\d+/.test(manifest.version)) {
    errors.push('Invalid semantic version');
  }
  if (!manifest.description) {
    errors.push('Description is required');
  }
  if (!manifest.author) {
    errors.push('Author is required');
  }

  return { valid: errors.length === 0, errors };
}
