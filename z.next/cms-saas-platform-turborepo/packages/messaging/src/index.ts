import { getLogger, Logger } from '@cms/logger';

// ─── Event Types ───────────────────────────────────

export enum EventType {
  // Auth
  USER_REGISTERED = 'user.registered',
  USER_LOGIN = 'user.login',
  USER_LOGOUT = 'user.logout',
  PASSWORD_CHANGED = 'user.password_changed',
  PASSWORD_RESET_REQUESTED = 'user.password_reset_requested',

  // Tenant
  TENANT_CREATED = 'tenant.created',
  TENANT_UPDATED = 'tenant.updated',
  TENANT_DELETED = 'tenant.deleted',
  TENANT_MEMBER_ADDED = 'tenant.member_added',
  TENANT_MEMBER_REMOVED = 'tenant.member_removed',

  // Content
  CONTENT_CREATED = 'content.created',
  CONTENT_UPDATED = 'content.updated',
  CONTENT_PUBLISHED = 'content.published',
  CONTENT_UNPUBLISHED = 'content.unpublished',
  CONTENT_DELETED = 'content.deleted',
  CONTENT_VERSION_CREATED = 'content.version_created',

  // Media
  MEDIA_UPLOADED = 'media.uploaded',
  MEDIA_DELETED = 'media.deleted',
  MEDIA_PROCESSED = 'media.processed',

  // Comments
  COMMENT_CREATED = 'comment.created',
  COMMENT_UPDATED = 'comment.updated',
  COMMENT_DELETED = 'comment.deleted',

  // Billing
  SUBSCRIPTION_CREATED = 'billing.subscription_created',
  SUBSCRIPTION_UPDATED = 'billing.subscription_updated',
  SUBSCRIPTION_CANCELLED = 'billing.subscription_cancelled',
  PAYMENT_SUCCEEDED = 'billing.payment_succeeded',
  PAYMENT_FAILED = 'billing.payment_failed',
  INVOICE_GENERATED = 'billing.invoice_generated',

  // Plugins
  PLUGIN_INSTALLED = 'plugin.installed',
  PLUGIN_ACTIVATED = 'plugin.activated',
  PLUGIN_DEACTIVATED = 'plugin.deactivated',
  PLUGIN_REMOVED = 'plugin.removed',

  // Workflow
  WORKFLOW_STARTED = 'workflow.started',
  WORKFLOW_STEP_COMPLETED = 'workflow.step_completed',
  WORKFLOW_COMPLETED = 'workflow.completed',

  // Security
  SECURITY_ALERT = 'security.alert',
  API_KEY_CREATED = 'security.api_key_created',
  API_KEY_REVOKED = 'security.api_key_revoked',
}

export interface EventMessage<T = unknown> {
  id: string;
  type: EventType;
  tenantId: string;
  userId?: string;
  data: T;
  metadata: {
    timestamp: string;
    source: string;
    correlationId?: string;
    version: number;
  };
}

// ─── Event Handler ───────────────────────────────────

export type EventHandler<T = unknown> = (event: EventMessage<T>) => Promise<void>;

// ─── In-Memory Event Bus (for development / single-node) ───

class InMemoryEventBus {
  private handlers: Map<string, EventHandler[]> = new Map();
  private logger: Logger;

  constructor() {
    this.logger = getLogger({ service: 'event-bus' });
  }

  subscribe<T>(eventType: EventType, handler: EventHandler<T>): void {
    const handlers = this.handlers.get(eventType) ?? [];
    handlers.push(handler as EventHandler);
    this.handlers.set(eventType, handlers);
    this.logger.debug({ eventType }, 'Handler subscribed');
  }

  async publish<T>(event: EventMessage<T>): Promise<void> {
    const handlers = this.handlers.get(event.type) ?? [];
    this.logger.info({ eventType: event.type, handlerCount: handlers.length }, 'Publishing event');

    await Promise.allSettled(
      handlers.map((handler) =>
        handler(event as EventMessage).catch((err) => {
          this.logger.error({ err, eventType: event.type }, 'Event handler failed');
        }),
      ),
    );
  }

  unsubscribe(eventType: EventType): void {
    this.handlers.delete(eventType);
  }

  clear(): void {
    this.handlers.clear();
  }
}

// ─── Kafka Event Bus ───────────────────────────────────

export interface KafkaConfig {
  brokers: string;
  clientId: string;
  groupId: string;
}

class KafkaEventBus {
  private config: KafkaConfig;
  private logger: Logger;
  private handlers: Map<string, EventHandler[]> = new Map();
  // In production, this would use @confluentinc/kafka-javascript or kafkajs

  constructor(config: KafkaConfig) {
    this.config = config;
    this.logger = getLogger({ service: 'kafka-event-bus' });
  }

  subscribe<T>(eventType: EventType, handler: EventHandler<T>): void {
    const handlers = this.handlers.get(eventType) ?? [];
    handlers.push(handler as EventHandler);
    this.handlers.set(eventType, handlers);
    this.logger.debug({ eventType, brokers: this.config.brokers }, 'Kafka handler subscribed');
  }

  async publish<T>(event: EventMessage<T>): Promise<void> {
    this.logger.info({ eventType: event.type }, 'Publishing to Kafka');
    // In production: produce to Kafka topic
    // Fallback to in-memory for development
    const handlers = this.handlers.get(event.type) ?? [];
    await Promise.allSettled(handlers.map((h) => h(event as EventMessage)));
  }

  async connect(): Promise<void> {
    this.logger.info({ brokers: this.config.brokers }, 'Connecting to Kafka');
  }

  async disconnect(): Promise<void> {
    this.logger.info('Disconnecting from Kafka');
  }
}

// ─── Factory ───────────────────────────────────

export type EventBus = InMemoryEventBus | KafkaEventBus;

let _eventBus: EventBus | null = null;

export function createEventBus(type: 'memory' | 'kafka' = 'memory', config?: KafkaConfig): EventBus {
  if (type === 'kafka' && config) {
    _eventBus = new KafkaEventBus(config);
  } else {
    _eventBus = new InMemoryEventBus();
  }
  return _eventBus;
}

export function getEventBus(): EventBus {
  if (!_eventBus) {
    _eventBus = new InMemoryEventBus();
  }
  return _eventBus;
}

// ─── Event Builder ───────────────────────────────────

export function createEvent<T>(
  type: EventType,
  tenantId: string,
  data: T,
  options?: { userId?: string; source?: string; correlationId?: string },
): EventMessage<T> {
  return {
    id: crypto.randomUUID(),
    type,
    tenantId,
    userId: options?.userId,
    data,
    metadata: {
      timestamp: new Date().toISOString(),
      source: options?.source ?? 'unknown',
      correlationId: options?.correlationId,
      version: 1,
    },
  };
}

export { InMemoryEventBus, KafkaEventBus };
