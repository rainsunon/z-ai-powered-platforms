import { getDatabase } from '@cms/database';
import { generateId } from '@cms/utils';

export async function recordAuditEvent(event: {
  type: string;
  tenantId?: string;
  data?: Record<string, unknown>;
  metadata?: { userId?: string; source?: string; requestId?: string };
}): Promise<void> {
  const db = getDatabase();

  await db('audit_logs').insert({
    id: generateId(),
    tenant_id: event.tenantId || null,
    user_id: event.metadata?.userId || null,
    action: event.type,
    resource_type: extractResourceType(event.type),
    resource_id: extractResourceId(event.data),
    details: JSON.stringify(event.data ?? {}),
    ip_address: null,
    user_agent: null,
    source: event.metadata?.source || 'system',
    request_id: event.metadata?.requestId || null,
  });
}

function extractResourceType(eventType: string): string {
  const parts = eventType.toLowerCase().split('_');
  if (parts.length >= 2) return parts[0]; // e.g., CONTENT_CREATED -> content
  return 'system';
}

function extractResourceId(data?: Record<string, unknown>): string | null {
  if (!data) return null;
  // Look for common ID fields
  for (const key of ['contentId', 'userId', 'tenantId', 'mediaId', 'pluginId', 'commentId']) {
    if (data[key] && typeof data[key] === 'string') return data[key] as string;
  }
  return null;
}
