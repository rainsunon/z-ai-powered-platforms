import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // ─── Roles ───────────────────────────────────
  const roles = [
    { name: 'Super Admin', slug: 'super-admin', description: 'Full system access', is_system: true },
    { name: 'Admin', slug: 'admin', description: 'Tenant administration', is_system: true },
    { name: 'Editor', slug: 'editor', description: 'Content management', is_system: true },
    { name: 'Author', slug: 'author', description: 'Content creation', is_system: true },
    { name: 'Viewer', slug: 'viewer', description: 'Read-only access', is_system: true },
  ];

  await knex('roles').insert(roles).onConflict('slug').ignore();

  // ─── Permissions ───────────────────────────────
  const permissions = [
    // Content
    { name: 'Create Content', slug: 'content.create', resource: 'content', action: 'create' },
    { name: 'Read Content', slug: 'content.read', resource: 'content', action: 'read' },
    { name: 'Update Content', slug: 'content.update', resource: 'content', action: 'update' },
    { name: 'Delete Content', slug: 'content.delete', resource: 'content', action: 'delete' },
    { name: 'Publish Content', slug: 'content.publish', resource: 'content', action: 'publish' },
    // Media
    { name: 'Upload Media', slug: 'media.upload', resource: 'media', action: 'upload' },
    { name: 'Read Media', slug: 'media.read', resource: 'media', action: 'read' },
    { name: 'Delete Media', slug: 'media.delete', resource: 'media', action: 'delete' },
    // Users
    { name: 'Manage Users', slug: 'users.manage', resource: 'users', action: 'manage' },
    { name: 'Read Users', slug: 'users.read', resource: 'users', action: 'read' },
    // Tenants
    { name: 'Manage Tenant', slug: 'tenant.manage', resource: 'tenant', action: 'manage' },
    { name: 'Manage Billing', slug: 'billing.manage', resource: 'billing', action: 'manage' },
    // Settings
    { name: 'Manage Settings', slug: 'settings.manage', resource: 'settings', action: 'manage' },
    // Plugins
    { name: 'Manage Plugins', slug: 'plugins.manage', resource: 'plugins', action: 'manage' },
    // Analytics
    { name: 'View Analytics', slug: 'analytics.read', resource: 'analytics', action: 'read' },
    // Comments
    { name: 'Moderate Comments', slug: 'comments.moderate', resource: 'comments', action: 'moderate' },
    { name: 'Create Comments', slug: 'comments.create', resource: 'comments', action: 'create' },
    // Workflows
    { name: 'Manage Workflows', slug: 'workflows.manage', resource: 'workflows', action: 'manage' },
    // API Keys
    { name: 'Manage API Keys', slug: 'api_keys.manage', resource: 'api_keys', action: 'manage' },
    // Webhooks
    { name: 'Manage Webhooks', slug: 'webhooks.manage', resource: 'webhooks', action: 'manage' },
  ];

  await knex('permissions').insert(permissions).onConflict('slug').ignore();

  // ─── Role-Permission Mapping ───────────────────
  const allPerms = await knex('permissions').select('id', 'slug');
  const allRoles = await knex('roles').select('id', 'slug');

  const rolePermsMap: Record<string, string[]> = {
    'super-admin': allPerms.map((p) => p.slug),
    admin: allPerms.map((p) => p.slug),
    editor: [
      'content.create', 'content.read', 'content.update', 'content.publish',
      'media.upload', 'media.read', 'comments.moderate', 'comments.create',
      'analytics.read',
    ],
    author: [
      'content.create', 'content.read', 'content.update',
      'media.upload', 'media.read', 'comments.create',
    ],
    viewer: ['content.read', 'media.read', 'analytics.read'],
  };

  const rolePermInserts: Array<{ role_id: string; permission_id: string }> = [];
  for (const [roleSlug, permSlugs] of Object.entries(rolePermsMap)) {
    const role = allRoles.find((r) => r.slug === roleSlug);
    if (!role) continue;
    for (const permSlug of permSlugs) {
      const perm = allPerms.find((p) => p.slug === permSlug);
      if (perm) {
        rolePermInserts.push({ role_id: role.id, permission_id: perm.id });
      }
    }
  }

  await knex('role_permissions').insert(rolePermInserts).onConflict(['role_id', 'permission_id']).ignore();

  // ─── Plans ───────────────────────────────
  const plans = [
    {
      name: 'Free',
      slug: 'free',
      description: 'Get started with basic features',
      price_monthly_cents: 0,
      price_yearly_cents: 0,
      features: JSON.stringify({
        content: true, media: true, api: true,
        comments: false, analytics: false, plugins: false, ai: false,
        custom_domain: false, webhooks: false,
      }),
      limits: JSON.stringify({
        max_users: 2, max_content: 50, max_storage_mb: 500,
        max_api_requests_per_day: 1000, max_media_uploads_per_month: 100.
      }),
      sort_order: 0,
    },
    {
      name: 'Pro',
      slug: 'pro',
      description: 'For growing teams and businesses',
      price_monthly_cents: 2900,
      price_yearly_cents: 29000,
      features: JSON.stringify({
        content: true, media: true, api: true,
        comments: true, analytics: true, plugins: true, ai: true,
        custom_domain: true, webhooks: true,
      }),
      limits: JSON.stringify({
        max_users: 10, max_content: 1000, max_storage_mb: 10240,
        max_api_requests_per_day: 50000, max_media_uploads_per_month: 5000,
      }),
      sort_order: 1,
    },
    {
      name: 'Enterprise',
      slug: 'enterprise',
      description: 'For large organizations',
      price_monthly_cents: 9900,
      price_yearly_cents: 99000,
      features: JSON.stringify({
        content: true, media: true, api: true,
        comments: true, analytics: true, plugins: true, ai: true,
        custom_domain: true, webhooks: true, sso: true, audit_log: true,
        priority_support: true,
      }),
      limits: JSON.stringify({
        max_users: -1, max_content: -1, max_storage_mb: 102400,
        max_api_requests_per_day: -1, max_media_uploads_per_month: -1,
      }),
      sort_order: 2,
    },
  ];

  await knex('plans').insert(plans).onConflict('slug').ignore();

  // ─── Default Feature Flags ───────────────────
  const flags = [
    { key: 'analytics', enabled: true, scope: 'global', description: 'Analytics tracking' },
    { key: 'ai_tools', enabled: false, scope: 'global', description: 'AI content tools' },
    { key: 'experimental_editor', enabled: false, scope: 'global', description: 'New block editor' },
    { key: 'comments', enabled: true, scope: 'global', description: 'Comment system' },
    { key: 'plugins', enabled: true, scope: 'global', description: 'Plugin marketplace' },
    { key: 'billing', enabled: true, scope: 'global', description: 'Billing system' },
    { key: 'webhooks', enabled: true, scope: 'global', description: 'Webhook system' },
    { key: 'multi_language', enabled: false, scope: 'global', description: 'Multi-language content' },
  ];

  for (const flag of flags) {
    await knex('feature_flags')
      .insert({ ...flag, scope_id: null })
      .onConflict(['key', 'scope', 'scope_id'])
      .ignore();
  }

  // ─── System Settings ───────────────────
  const settings = [
    { key: 'site.name', value: JSON.stringify('CMS Platform'), group: 'general', is_public: true },
    { key: 'site.description', value: JSON.stringify('Production-grade CMS SaaS'), group: 'general', is_public: true },
    { key: 'site.locale', value: JSON.stringify('en'), group: 'general', is_public: true },
    { key: 'media.max_upload_size_mb', value: JSON.stringify(50), group: 'media', is_public: false },
    { key: 'media.allowed_types', value: JSON.stringify(['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'application/pdf']), group: 'media', is_public: false },
    { key: 'content.default_status', value: JSON.stringify('draft'), group: 'content', is_public: false },
    { key: 'auth.session_duration_hours', value: JSON.stringify(24), group: 'auth', is_public: false },
    { key: 'auth.max_login_attempts', value: JSON.stringify(5), group: 'auth', is_public: false },
  ];

  await knex('system_settings').insert(settings).onConflict('key').ignore();
}
