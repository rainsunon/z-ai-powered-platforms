import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // ════════════════════════════════════════════════════════════
  // EXTENSION SETUP
  // ════════════════════════════════════════════════════════════
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');

  // ════════════════════════════════════════════════════════════
  // 1. IDENTITY & AUTHENTICATION (10 tables)
  // ════════════════════════════════════════════════════════════

  // users
  await knex.schema.createTable('users', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    t.string('email', 255).notNullable().unique();
    t.string('username', 50).unique();
    t.string('password_hash', 255).notNullable();
    t.string('first_name', 100);
    t.string('last_name', 100);
    t.string('avatar_url', 500);
    t.text('bio');
    t.enum('status', ['active', 'inactive', 'suspended', 'deleted']).defaultTo('active');
    t.boolean('email_verified').defaultTo(false);
    t.timestamp('email_verified_at');
    t.timestamp('last_login_at');
    t.jsonb('metadata').defaultTo('{}');
    t.timestamps(true, true);
    t.timestamp('deleted_at');

    t.index('email');
    t.index('status');
    t.index('created_at');
  });

  // roles
  await knex.schema.createTable('roles', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    t.string('name', 100).notNullable().unique();
    t.string('slug', 100).notNullable().unique();
    t.text('description');
    t.boolean('is_system').defaultTo(false);
    t.timestamps(true, true);
  });

  // permissions
  await knex.schema.createTable('permissions', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    t.string('name', 100).notNullable().unique();
    t.string('slug', 100).notNullable().unique();
    t.string('resource', 100).notNullable();
    t.string('action', 50).notNullable();
    t.text('description');
    t.timestamps(true, true);

    t.index(['resource', 'action']);
  });

  // role_permissions
  await knex.schema.createTable('role_permissions', (t) => {
    t.uuid('role_id').notNullable().references('id').inTable('roles').onDelete('CASCADE');
    t.uuid('permission_id').notNullable().references('id').inTable('permissions').onDelete('CASCADE');
    t.primary(['role_id', 'permission_id']);
  });

  // sessions
  await knex.schema.createTable('sessions', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    t.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    t.text('refresh_token_hash').notNullable();
    t.string('ip_address', 45);
    t.text('user_agent');
    t.timestamp('expires_at').notNullable();
    t.boolean('revoked').defaultTo(false);
    t.timestamps(true, true);

    t.index('user_id');
    t.index('expires_at');
  });

  // api_keys
  await knex.schema.createTable('api_keys', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    t.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    t.uuid('tenant_id');
    t.string('name', 100).notNullable();
    t.string('key_hash', 255).notNullable().unique();
    t.string('key_prefix', 20).notNullable();
    t.specificType('scopes', 'text[]').defaultTo('{}');
    t.timestamp('last_used_at');
    t.timestamp('expires_at');
    t.boolean('revoked').defaultTo(false);
    t.timestamps(true, true);

    t.index('key_hash');
    t.index('user_id');
  });

  // devices
  await knex.schema.createTable('devices', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    t.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    t.string('device_type', 50);
    t.string('device_name', 200);
    t.text('user_agent');
    t.string('ip_address', 45);
    t.boolean('trusted').defaultTo(false);
    t.timestamp('last_active_at');
    t.timestamps(true, true);

    t.index('user_id');
  });

  // login_attempts
  await knex.schema.createTable('login_attempts', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    t.string('email', 255).notNullable();
    t.string('ip_address', 45).notNullable();
    t.boolean('success').notNullable();
    t.text('user_agent');
    t.text('failure_reason');
    t.timestamp('created_at').defaultTo(knex.fn.now());

    t.index(['email', 'created_at']);
    t.index(['ip_address', 'created_at']);
  });

  // password_resets
  await knex.schema.createTable('password_resets', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    t.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    t.string('token_hash', 255).notNullable();
    t.timestamp('expires_at').notNullable();
    t.boolean('used').defaultTo(false);
    t.timestamp('created_at').defaultTo(knex.fn.now());

    t.index('token_hash');
  });

  // two_factor_secrets
  await knex.schema.createTable('two_factor_secrets', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    t.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE').unique();
    t.text('secret_encrypted').notNullable();
    t.boolean('enabled').defaultTo(false);
    t.specificType('backup_codes_hash', 'text[]').defaultTo('{}');
    t.timestamp('verified_at');
    t.timestamps(true, true);
  });

  // ════════════════════════════════════════════════════════════
  // 2. MULTI-TENANT SAAS (10 tables)
  // ════════════════════════════════════════════════════════════

  // tenants
  await knex.schema.createTable('tenants', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    t.string('name', 100).notNullable();
    t.string('slug', 63).notNullable().unique();
    t.uuid('owner_id').notNullable().references('id').inTable('users');
    t.enum('status', ['active', 'suspended', 'cancelled', 'trial']).defaultTo('trial');
    t.string('plan', 50).defaultTo('free');
    t.jsonb('settings').defaultTo('{}');
    t.string('logo_url', 500);
    t.timestamp('trial_ends_at');
    t.timestamps(true, true);
    t.timestamp('deleted_at');

    t.index('slug');
    t.index('owner_id');
    t.index('status');
  });

  // tenant_domains
  await knex.schema.createTable('tenant_domains', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    t.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE');
    t.string('domain', 255).notNullable().unique();
    t.boolean('verified').defaultTo(false);
    t.string('verification_token', 255);
    t.boolean('is_primary').defaultTo(false);
    t.boolean('ssl_enabled').defaultTo(true);
    t.timestamps(true, true);

    t.index('domain');
    t.index('tenant_id');
  });

  // tenant_members
  await knex.schema.createTable('tenant_members', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    t.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE');
    t.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    t.uuid('role_id').references('id').inTable('roles');
    t.enum('status', ['active', 'invited', 'suspended']).defaultTo('invited');
    t.timestamp('joined_at');
    t.timestamps(true, true);

    t.unique(['tenant_id', 'user_id']);
    t.index('user_id');
  });

  // tenant_roles
  await knex.schema.createTable('tenant_roles', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    t.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE');
    t.string('name', 100).notNullable();
    t.string('slug', 100).notNullable();
    t.text('description');
    t.boolean('is_default').defaultTo(false);
    t.timestamps(true, true);

    t.unique(['tenant_id', 'slug']);
  });

  // tenant_permissions
  await knex.schema.createTable('tenant_permissions', (t) => {
    t.uuid('tenant_role_id').notNullable().references('id').inTable('tenant_roles').onDelete('CASCADE');
    t.uuid('permission_id').notNullable().references('id').inTable('permissions').onDelete('CASCADE');
    t.primary(['tenant_role_id', 'permission_id']);
  });

  // tenant_invitations
  await knex.schema.createTable('tenant_invitations', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    t.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE');
    t.string('email', 255).notNullable();
    t.uuid('role_id').references('id').inTable('tenant_roles');
    t.string('token_hash', 255).notNullable();
    t.uuid('invited_by').references('id').inTable('users');
    t.enum('status', ['pending', 'accepted', 'expired', 'revoked']).defaultTo('pending');
    t.timestamp('expires_at').notNullable();
    t.timestamps(true, true);

    t.index(['tenant_id', 'email']);
    t.index('token_hash');
  });

  // tenant_limits
  await knex.schema.createTable('tenant_limits', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    t.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE').unique();
    t.integer('max_users').defaultTo(5);
    t.integer('max_content').defaultTo(100);
    t.bigInteger('max_storage_bytes').defaultTo(1073741824); // 1GB
    t.integer('max_api_requests_per_day').defaultTo(10000);
    t.integer('max_media_uploads_per_month').defaultTo(500);
    t.integer('max_plugins').defaultTo(3);
    t.timestamps(true, true);
  });

  // tenant_plans (definition of plans)
  // NOTE: not to be confused with billing plans
  await knex.schema.createTable('tenant_usage', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    t.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE');
    t.date('period_start').notNullable();
    t.date('period_end').notNullable();
    t.integer('users_count').defaultTo(0);
    t.integer('content_count').defaultTo(0);
    t.bigInteger('storage_bytes_used').defaultTo(0);
    t.integer('api_requests_count').defaultTo(0);
    t.integer('media_uploads_count').defaultTo(0);
    t.timestamps(true, true);

    t.unique(['tenant_id', 'period_start']);
    t.index('period_start');
  });

  // ════════════════════════════════════════════════════════════
  // 3. CONTENT MANAGEMENT (8 tables)
  // ════════════════════════════════════════════════════════════

  // content
  await knex.schema.createTable('content', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    t.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE');
    t.uuid('author_id').notNullable().references('id').inTable('users');
    t.string('title', 500).notNullable();
    t.string('slug', 500).notNullable();
    t.text('excerpt');
    t.string('featured_image_url', 500);
    t.enum('status', ['draft', 'review', 'scheduled', 'published', 'archived']).defaultTo('draft');
    t.string('content_type', 50).defaultTo('article');
    t.integer('current_version').defaultTo(1);
    t.integer('word_count').defaultTo(0);
    t.integer('reading_time_minutes').defaultTo(0);
    t.timestamp('published_at');
    t.timestamp('scheduled_at');
    t.jsonb('seo_metadata').defaultTo('{}');
    t.jsonb('custom_fields').defaultTo('{}');
    t.boolean('allow_comments').defaultTo(true);
    t.string('locale', 10).defaultTo('en');
    t.uuid('translated_from');
    t.timestamps(true, true);
    t.timestamp('deleted_at');

    t.unique(['tenant_id', 'slug']);
    t.index('tenant_id');
    t.index('author_id');
    t.index('status');
    t.index('content_type');
    t.index('published_at');
    t.index('locale');
  });

  // content_versions
  await knex.schema.createTable('content_versions', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    t.uuid('content_id').notNullable().references('id').inTable('content').onDelete('CASCADE');
    t.integer('version_number').notNullable();
    t.string('title', 500).notNullable();
    t.jsonb('blocks').notNullable().defaultTo('[]');
    t.text('raw_text');
    t.jsonb('seo_metadata').defaultTo('{}');
    t.uuid('created_by').references('id').inTable('users');
    t.text('change_summary');
    t.timestamps(true, true);

    t.unique(['content_id', 'version_number']);
    t.index('content_id');
  });

  // content_blocks (separate block storage for queries)
  await knex.schema.createTable('content_blocks', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    t.uuid('content_id').notNullable().references('id').inTable('content').onDelete('CASCADE');
    t.uuid('parent_block_id').references('id').inTable('content_blocks');
    t.string('type', 50).notNullable();
    t.jsonb('data').notNullable().defaultTo('{}');
    t.integer('sort_order').defaultTo(0);
    t.jsonb('style').defaultTo('{}');
    t.timestamps(true, true);

    t.index('content_id');
    t.index('parent_block_id');
    t.index('type');
  });

  // tags
  await knex.schema.createTable('tags', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    t.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE');
    t.string('name', 100).notNullable();
    t.string('slug', 100).notNullable();
    t.text('description');
    t.string('color', 7);
    t.timestamps(true, true);

    t.unique(['tenant_id', 'slug']);
  });

  // content_tags
  await knex.schema.createTable('content_tags', (t) => {
    t.uuid('content_id').notNullable().references('id').inTable('content').onDelete('CASCADE');
    t.uuid('tag_id').notNullable().references('id').inTable('tags').onDelete('CASCADE');
    t.primary(['content_id', 'tag_id']);
  });

  // categories
  await knex.schema.createTable('categories', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    t.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE');
    t.uuid('parent_id').references('id').inTable('categories');
    t.string('name', 100).notNullable();
    t.string('slug', 100).notNullable();
    t.text('description');
    t.integer('sort_order').defaultTo(0);
    t.timestamps(true, true);

    t.unique(['tenant_id', 'slug']);
    t.index('parent_id');
  });

  // content_categories
  await knex.schema.createTable('content_categories', (t) => {
    t.uuid('content_id').notNullable().references('id').inTable('content').onDelete('CASCADE');
    t.uuid('category_id').notNullable().references('id').inTable('categories').onDelete('CASCADE');
    t.primary(['content_id', 'category_id']);
  });

  // content_locks (for real-time editing)
  await knex.schema.createTable('content_locks', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    t.uuid('content_id').notNullable().references('id').inTable('content').onDelete('CASCADE').unique();
    t.uuid('locked_by').notNullable().references('id').inTable('users');
    t.timestamp('locked_at').defaultTo(knex.fn.now());
    t.timestamp('expires_at').notNullable();
  });

  // ════════════════════════════════════════════════════════════
  // 4. MEDIA MANAGEMENT (6 tables)
  // ════════════════════════════════════════════════════════════

  // media_folders
  await knex.schema.createTable('media_folders', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    t.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE');
    t.uuid('parent_id').references('id').inTable('media_folders');
    t.string('name', 255).notNullable();
    t.string('path', 1000).notNullable();
    t.timestamps(true, true);

    t.index('tenant_id');
    t.index('parent_id');
  });

  // media
  await knex.schema.createTable('media', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    t.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE');
    t.uuid('uploaded_by').notNullable().references('id').inTable('users');
    t.uuid('folder_id').references('id').inTable('media_folders');
    t.string('filename', 255).notNullable();
    t.string('original_filename', 255).notNullable();
    t.string('mime_type', 100).notNullable();
    t.bigInteger('size_bytes').notNullable();
    t.string('storage_key', 500).notNullable();
    t.string('public_url', 1000);
    t.string('alt_text', 500);
    t.text('caption');
    t.integer('width');
    t.integer('height');
    t.integer('duration_seconds');
    t.enum('status', ['processing', 'ready', 'failed']).defaultTo('processing');
    t.jsonb('metadata').defaultTo('{}');
    t.timestamps(true, true);
    t.timestamp('deleted_at');

    t.index('tenant_id');
    t.index('uploaded_by');
    t.index('folder_id');
    t.index('mime_type');
    t.index('status');
  });

  // media_variants
  await knex.schema.createTable('media_variants', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    t.uuid('media_id').notNullable().references('id').inTable('media').onDelete('CASCADE');
    t.string('variant_name', 50).notNullable(); // thumbnail, small, medium, large, webp
    t.string('storage_key', 500).notNullable();
    t.string('public_url', 1000);
    t.string('mime_type', 100).notNullable();
    t.bigInteger('size_bytes').notNullable();
    t.integer('width');
    t.integer('height');
    t.timestamps(true, true);

    t.unique(['media_id', 'variant_name']);
  });

  // media_tags
  await knex.schema.createTable('media_tags', (t) => {
    t.uuid('media_id').notNullable().references('id').inTable('media').onDelete('CASCADE');
    t.uuid('tag_id').notNullable().references('id').inTable('tags').onDelete('CASCADE');
    t.primary(['media_id', 'tag_id']);
  });

  // media_metadata (EXIF data, AI tags, etc.)
  await knex.schema.createTable('media_metadata', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    t.uuid('media_id').notNullable().references('id').inTable('media').onDelete('CASCADE').unique();
    t.jsonb('exif_data').defaultTo('{}');
    t.specificType('ai_tags', 'text[]').defaultTo('{}');
    t.text('ai_description');
    t.string('dominant_color', 7);
    t.float('aspect_ratio');
    t.timestamps(true, true);
  });

  // media_usage (tracks where media is used)
  await knex.schema.createTable('media_usage', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    t.uuid('media_id').notNullable().references('id').inTable('media').onDelete('CASCADE');
    t.uuid('content_id').references('id').inTable('content').onDelete('SET NULL');
    t.string('usage_type', 50).notNullable(); // featured_image, inline, avatar, logo
    t.timestamps(true, true);

    t.index('media_id');
    t.index('content_id');
  });

  // ════════════════════════════════════════════════════════════
  // 5. ENGAGEMENT (6 tables)
  // ════════════════════════════════════════════════════════════

  // comments
  await knex.schema.createTable('comments', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    t.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE');
    t.uuid('content_id').notNullable().references('id').inTable('content').onDelete('CASCADE');
    t.uuid('author_id').notNullable().references('id').inTable('users');
    t.uuid('parent_id').references('id').inTable('comments');
    t.text('body').notNullable();
    t.enum('status', ['pending', 'approved', 'spam', 'deleted']).defaultTo('pending');
    t.string('author_ip', 45);
    t.integer('depth').defaultTo(0);
    t.timestamps(true, true);
    t.timestamp('deleted_at');

    t.index('content_id');
    t.index('author_id');
    t.index('parent_id');
    t.index('status');
  });

  // comment_reactions
  await knex.schema.createTable('comment_reactions', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    t.uuid('comment_id').notNullable().references('id').inTable('comments').onDelete('CASCADE');
    t.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    t.string('reaction_type', 20).notNullable(); // like, love, laugh, etc.
    t.timestamp('created_at').defaultTo(knex.fn.now());

    t.unique(['comment_id', 'user_id', 'reaction_type']);
  });

  // likes
  await knex.schema.createTable('likes', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    t.uuid('content_id').notNullable().references('id').inTable('content').onDelete('CASCADE');
    t.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    t.timestamp('created_at').defaultTo(knex.fn.now());

    t.unique(['content_id', 'user_id']);
  });

  // shares
  await knex.schema.createTable('shares', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    t.uuid('content_id').notNullable().references('id').inTable('content').onDelete('CASCADE');
    t.uuid('user_id').references('id').inTable('users').onDelete('SET NULL');
    t.string('platform', 50); // twitter, facebook, email, copy_link
    t.timestamp('created_at').defaultTo(knex.fn.now());

    t.index('content_id');
  });

  // bookmarks
  await knex.schema.createTable('bookmarks', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    t.uuid('content_id').notNullable().references('id').inTable('content').onDelete('CASCADE');
    t.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    t.string('collection', 100);
    t.timestamp('created_at').defaultTo(knex.fn.now());

    t.unique(['content_id', 'user_id']);
  });

  // reactions (generic for content)
  await knex.schema.createTable('content_reactions', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    t.uuid('content_id').notNullable().references('id').inTable('content').onDelete('CASCADE');
    t.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    t.string('reaction_type', 20).notNullable();
    t.timestamp('created_at').defaultTo(knex.fn.now());

    t.unique(['content_id', 'user_id', 'reaction_type']);
  });

  // ════════════════════════════════════════════════════════════
  // 6. ANALYTICS (6 tables)
  // ════════════════════════════════════════════════════════════

  // analytics_events
  await knex.schema.createTable('analytics_events', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    t.uuid('tenant_id').notNullable();
    t.string('event_name', 100).notNullable();
    t.uuid('user_id');
    t.uuid('session_id');
    t.uuid('content_id');
    t.jsonb('properties').defaultTo('{}');
    t.string('ip_address', 45);
    t.text('user_agent');
    t.string('referrer', 1000);
    t.timestamp('created_at').defaultTo(knex.fn.now());

    t.index('tenant_id');
    t.index('event_name');
    t.index('created_at');
    t.index('session_id');
  });

  // analytics_sessions
  await knex.schema.createTable('analytics_sessions', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    t.uuid('tenant_id').notNullable();
    t.uuid('user_id');
    t.string('ip_address', 45);
    t.text('user_agent');
    t.string('country', 2);
    t.string('city', 100);
    t.string('device_type', 20);
    t.string('browser', 50);
    t.string('os', 50);
    t.string('referrer', 1000);
    t.string('utm_source', 200);
    t.string('utm_medium', 200);
    t.string('utm_campaign', 200);
    t.integer('page_views').defaultTo(0);
    t.integer('duration_seconds').defaultTo(0);
    t.timestamp('started_at').defaultTo(knex.fn.now());
    t.timestamp('ended_at');

    t.index('tenant_id');
    t.index('started_at');
  });

  // analytics_pageviews
  await knex.schema.createTable('analytics_pageviews', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    t.uuid('tenant_id').notNullable();
    t.uuid('session_id');
    t.uuid('content_id');
    t.string('path', 1000).notNullable();
    t.string('title', 500);
    t.integer('time_on_page_seconds').defaultTo(0);
    t.integer('scroll_depth_percent').defaultTo(0);
    t.timestamp('created_at').defaultTo(knex.fn.now());

    t.index('tenant_id');
    t.index('content_id');
    t.index('created_at');
  });

  // analytics_referrers
  await knex.schema.createTable('analytics_referrers', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    t.uuid('tenant_id').notNullable();
    t.string('referrer_url', 1000).notNullable();
    t.string('referrer_domain', 255);
    t.integer('visit_count').defaultTo(0);
    t.date('date').notNullable();

    t.index(['tenant_id', 'date']);
  });

  // ════════════════════════════════════════════════════════════
  // 7. NOTIFICATIONS (3 tables)
  // ════════════════════════════════════════════════════════════

  // notifications
  await knex.schema.createTable('notifications', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    t.uuid('tenant_id').notNullable();
    t.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    t.string('type', 100).notNullable();
    t.string('title', 255).notNullable();
    t.text('body');
    t.jsonb('data').defaultTo('{}');
    t.string('action_url', 1000);
    t.boolean('read').defaultTo(false);
    t.timestamp('read_at');
    t.timestamps(true, true);

    t.index(['user_id', 'read']);
    t.index('tenant_id');
    t.index('created_at');
  });

  // notification_preferences
  await knex.schema.createTable('notification_preferences', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    t.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    t.string('notification_type', 100).notNullable();
    t.boolean('email_enabled').defaultTo(true);
    t.boolean('push_enabled').defaultTo(true);
    t.boolean('in_app_enabled').defaultTo(true);
    t.timestamps(true, true);

    t.unique(['user_id', 'notification_type']);
  });

  // notification_deliveries
  await knex.schema.createTable('notification_deliveries', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    t.uuid('notification_id').notNullable().references('id').inTable('notifications').onDelete('CASCADE');
    t.enum('channel', ['email', 'push', 'in_app', 'webhook']).notNullable();
    t.enum('status', ['pending', 'sent', 'delivered', 'failed']).defaultTo('pending');
    t.text('error_message');
    t.timestamp('sent_at');
    t.timestamp('delivered_at');
    t.timestamps(true, true);

    t.index('notification_id');
    t.index('status');
  });

  // ════════════════════════════════════════════════════════════
  // 8. PLUGINS (4 tables)
  // ════════════════════════════════════════════════════════════

  // plugins
  await knex.schema.createTable('plugins', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    t.string('name', 100).notNullable().unique();
    t.string('slug', 100).notNullable().unique();
    t.text('description');
    t.string('version', 20).notNullable();
    t.string('author', 100);
    t.string('homepage', 500);
    t.string('repository', 500);
    t.string('icon_url', 500);
    t.jsonb('manifest').notNullable().defaultTo('{}');
    t.boolean('verified').defaultTo(false);
    t.timestamps(true, true);
  });

  // tenant_plugins
  await knex.schema.createTable('tenant_plugins', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    t.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE');
    t.uuid('plugin_id').notNullable().references('id').inTable('plugins').onDelete('CASCADE');
    t.enum('status', ['installing', 'active', 'inactive', 'error']).defaultTo('installing');
    t.jsonb('settings').defaultTo('{}');
    t.string('installed_version', 20);
    t.timestamp('activated_at');
    t.timestamps(true, true);

    t.unique(['tenant_id', 'plugin_id']);
  });

  // plugin_storage (key-value for plugins)
  await knex.schema.createTable('plugin_storage', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    t.uuid('tenant_id').notNullable();
    t.string('plugin_slug', 100).notNullable();
    t.string('key', 255).notNullable();
    t.jsonb('value').notNullable();
    t.timestamps(true, true);

    t.unique(['tenant_id', 'plugin_slug', 'key']);
  });

  // plugin_hooks_log
  await knex.schema.createTable('plugin_hooks_log', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    t.uuid('tenant_id').notNullable();
    t.string('plugin_slug', 100).notNullable();
    t.string('hook_name', 100).notNullable();
    t.enum('status', ['success', 'error']).notNullable();
    t.text('error_message');
    t.integer('duration_ms');
    t.timestamp('created_at').defaultTo(knex.fn.now());

    t.index(['tenant_id', 'plugin_slug']);
    t.index('created_at');
  });

  // ════════════════════════════════════════════════════════════
  // 9. FEATURE FLAGS (2 tables)
  // ════════════════════════════════════════════════════════════

  // feature_flags
  await knex.schema.createTable('feature_flags', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    t.string('key', 100).notNullable();
    t.boolean('enabled').defaultTo(false);
    t.enum('scope', ['global', 'tenant', 'role', 'user', 'environment']).defaultTo('global');
    t.string('scope_id', 255);
    t.text('description');
    t.integer('percentage');
    t.jsonb('metadata').defaultTo('{}');
    t.timestamps(true, true);

    t.unique(['key', 'scope', 'scope_id']);
    t.index('key');
  });

  // feature_flag_audit
  await knex.schema.createTable('feature_flag_audit', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    t.uuid('flag_id').notNullable().references('id').inTable('feature_flags').onDelete('CASCADE');
    t.uuid('changed_by').references('id').inTable('users');
    t.boolean('old_value');
    t.boolean('new_value');
    t.text('reason');
    t.timestamp('created_at').defaultTo(knex.fn.now());
  });

  // ════════════════════════════════════════════════════════════
  // 10. BILLING & SUBSCRIPTIONS (5 tables)
  // ════════════════════════════════════════════════════════════

  // plans
  await knex.schema.createTable('plans', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    t.string('name', 100).notNullable();
    t.string('slug', 100).notNullable().unique();
    t.text('description');
    t.integer('price_monthly_cents').notNullable().defaultTo(0);
    t.integer('price_yearly_cents').notNullable().defaultTo(0);
    t.string('stripe_price_id_monthly', 255);
    t.string('stripe_price_id_yearly', 255);
    t.jsonb('features').defaultTo('{}');
    t.jsonb('limits').defaultTo('{}');
    t.boolean('is_active').defaultTo(true);
    t.integer('sort_order').defaultTo(0);
    t.timestamps(true, true);
  });

  // subscriptions
  await knex.schema.createTable('subscriptions', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    t.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE');
    t.uuid('plan_id').notNullable().references('id').inTable('plans');
    t.string('stripe_subscription_id', 255).unique();
    t.string('stripe_customer_id', 255);
    t.enum('status', ['active', 'past_due', 'cancelled', 'trialing', 'unpaid']).defaultTo('trialing');
    t.enum('billing_cycle', ['monthly', 'yearly']).defaultTo('monthly');
    t.timestamp('current_period_start');
    t.timestamp('current_period_end');
    t.timestamp('trial_start');
    t.timestamp('trial_end');
    t.timestamp('cancelled_at');
    t.timestamps(true, true);

    t.index('tenant_id');
    t.index('stripe_subscription_id');
    t.index('status');
  });

  // invoices
  await knex.schema.createTable('invoices', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    t.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE');
    t.uuid('subscription_id').references('id').inTable('subscriptions');
    t.string('stripe_invoice_id', 255).unique();
    t.string('invoice_number', 50).notNullable();
    t.integer('amount_cents').notNullable();
    t.integer('tax_cents').defaultTo(0);
    t.integer('total_cents').notNullable();
    t.string('currency', 3).defaultTo('usd');
    t.enum('status', ['draft', 'open', 'paid', 'void', 'uncollectible']).defaultTo('draft');
    t.timestamp('due_date');
    t.timestamp('paid_at');
    t.string('pdf_url', 1000);
    t.timestamps(true, true);

    t.index('tenant_id');
    t.index('status');
  });

  // payments
  await knex.schema.createTable('payments', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    t.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE');
    t.uuid('invoice_id').references('id').inTable('invoices');
    t.string('stripe_payment_intent_id', 255);
    t.integer('amount_cents').notNullable();
    t.string('currency', 3).defaultTo('usd');
    t.enum('status', ['pending', 'succeeded', 'failed', 'refunded']).defaultTo('pending');
    t.string('payment_method_type', 50);
    t.string('last_four', 4);
    t.text('failure_reason');
    t.timestamps(true, true);

    t.index('tenant_id');
    t.index('status');
  });

  // usage_records
  await knex.schema.createTable('usage_records', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    t.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE');
    t.uuid('subscription_id').references('id').inTable('subscriptions');
    t.string('metric', 100).notNullable(); // api_requests, storage, media_uploads, active_users
    t.bigInteger('quantity').notNullable().defaultTo(0);
    t.date('period_start').notNullable();
    t.date('period_end').notNullable();
    t.timestamps(true, true);

    t.index(['tenant_id', 'metric', 'period_start']);
  });

  // ════════════════════════════════════════════════════════════
  // 11. WORKFLOWS (3 tables)
  // ════════════════════════════════════════════════════════════

  // workflows
  await knex.schema.createTable('workflows', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    t.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE');
    t.string('name', 100).notNullable();
    t.text('description');
    t.jsonb('steps').notNullable().defaultTo('[]');
    t.boolean('is_active').defaultTo(true);
    t.string('trigger_event', 100);
    t.timestamps(true, true);

    t.index('tenant_id');
  });

  // workflow_instances
  await knex.schema.createTable('workflow_instances', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    t.uuid('workflow_id').notNullable().references('id').inTable('workflows').onDelete('CASCADE');
    t.uuid('content_id').references('id').inTable('content');
    t.uuid('triggered_by').references('id').inTable('users');
    t.enum('status', ['running', 'completed', 'failed', 'cancelled']).defaultTo('running');
    t.integer('current_step').defaultTo(0);
    t.jsonb('context').defaultTo('{}');
    t.timestamp('started_at').defaultTo(knex.fn.now());
    t.timestamp('completed_at');
    t.timestamps(true, true);

    t.index('workflow_id');
    t.index('status');
  });

  // workflow_step_logs
  await knex.schema.createTable('workflow_step_logs', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    t.uuid('instance_id').notNullable().references('id').inTable('workflow_instances').onDelete('CASCADE');
    t.integer('step_number').notNullable();
    t.string('step_name', 100);
    t.enum('status', ['pending', 'running', 'completed', 'failed', 'skipped']).defaultTo('pending');
    t.uuid('assigned_to').references('id').inTable('users');
    t.jsonb('input').defaultTo('{}');
    t.jsonb('output').defaultTo('{}');
    t.text('error_message');
    t.timestamp('started_at');
    t.timestamp('completed_at');
    t.timestamps(true, true);

    t.index('instance_id');
  });

  // ════════════════════════════════════════════════════════════
  // 12. AUDIT LOG (1 table)
  // ════════════════════════════════════════════════════════════

  await knex.schema.createTable('audit_logs', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    t.uuid('tenant_id').notNullable();
    t.uuid('user_id');
    t.string('action', 100).notNullable();
    t.string('resource_type', 100).notNullable();
    t.uuid('resource_id');
    t.jsonb('old_values');
    t.jsonb('new_values');
    t.string('ip_address', 45);
    t.text('user_agent');
    t.timestamp('created_at').defaultTo(knex.fn.now());

    t.index(['tenant_id', 'created_at']);
    t.index(['resource_type', 'resource_id']);
    t.index('action');
    t.index('user_id');
  });

  // ════════════════════════════════════════════════════════════
  // 13. SETTINGS (2 tables)
  // ════════════════════════════════════════════════════════════

  // system_settings
  await knex.schema.createTable('system_settings', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    t.string('key', 255).notNullable().unique();
    t.jsonb('value').notNullable();
    t.string('group', 100);
    t.text('description');
    t.boolean('is_public').defaultTo(false);
    t.timestamps(true, true);
  });

  // tenant_settings
  await knex.schema.createTable('tenant_settings', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    t.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE');
    t.string('key', 255).notNullable();
    t.jsonb('value').notNullable();
    t.string('group', 100);
    t.timestamps(true, true);

    t.unique(['tenant_id', 'key']);
  });

  // ════════════════════════════════════════════════════════════
  // 14. WEBHOOKS (2 tables)
  // ════════════════════════════════════════════════════════════

  // webhooks
  await knex.schema.createTable('webhooks', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    t.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE');
    t.string('url', 1000).notNullable();
    t.specificType('events', 'text[]').notNullable();
    t.string('secret_hash', 255);
    t.boolean('active').defaultTo(true);
    t.integer('failure_count').defaultTo(0);
    t.timestamp('last_triggered_at');
    t.timestamps(true, true);

    t.index('tenant_id');
  });

  // webhook_deliveries
  await knex.schema.createTable('webhook_deliveries', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    t.uuid('webhook_id').notNullable().references('id').inTable('webhooks').onDelete('CASCADE');
    t.string('event', 100).notNullable();
    t.jsonb('payload').notNullable();
    t.integer('response_status');
    t.text('response_body');
    t.integer('duration_ms');
    t.enum('status', ['pending', 'success', 'failed']).defaultTo('pending');
    t.integer('attempt').defaultTo(1);
    t.timestamps(true, true);

    t.index('webhook_id');
    t.index('status');
  });

  // ════════════════════════════════════════════════════════════
  // 15. AI (2 tables)
  // ════════════════════════════════════════════════════════════

  await knex.schema.createTable('ai_generations', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    t.uuid('tenant_id').notNullable();
    t.uuid('user_id').references('id').inTable('users');
    t.string('model', 100).notNullable();
    t.string('task_type', 50).notNullable(); // text_generation, summarization, translation, seo
    t.text('input_prompt');
    t.text('output_text');
    t.integer('input_tokens').defaultTo(0);
    t.integer('output_tokens').defaultTo(0);
    t.integer('duration_ms');
    t.enum('status', ['pending', 'completed', 'failed']).defaultTo('pending');
    t.timestamps(true, true);

    t.index('tenant_id');
    t.index('user_id');
    t.index('task_type');
  });

  await knex.schema.createTable('ai_usage_quota', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    t.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE');
    t.integer('monthly_token_limit').defaultTo(100000);
    t.integer('tokens_used').defaultTo(0);
    t.date('period_start').notNullable();
    t.date('period_end').notNullable();
    t.timestamps(true, true);

    t.unique(['tenant_id', 'period_start']);
  });
}

export async function down(knex: Knex): Promise<void> {
  const tables = [
    'ai_usage_quota', 'ai_generations',
    'webhook_deliveries', 'webhooks',
    'tenant_settings', 'system_settings',
    'audit_logs',
    'workflow_step_logs', 'workflow_instances', 'workflows',
    'usage_records', 'payments', 'invoices', 'subscriptions', 'plans',
    'feature_flag_audit', 'feature_flags',
    'plugin_hooks_log', 'plugin_storage', 'tenant_plugins', 'plugins',
    'notification_deliveries', 'notification_preferences', 'notifications',
    'analytics_referrers', 'analytics_pageviews', 'analytics_sessions', 'analytics_events',
    'content_reactions', 'bookmarks', 'shares', 'likes', 'comment_reactions', 'comments',
    'media_usage', 'media_metadata', 'media_tags', 'media_variants', 'media', 'media_folders',
    'content_locks', 'content_categories', 'categories', 'content_tags', 'tags',
    'content_blocks', 'content_versions', 'content',
    'tenant_usage', 'tenant_limits', 'tenant_invitations',
    'tenant_permissions', 'tenant_roles', 'tenant_members', 'tenant_domains', 'tenants',
    'two_factor_secrets', 'password_resets', 'login_attempts', 'devices', 'api_keys',
    'sessions', 'role_permissions', 'permissions', 'roles', 'users',
  ];

  for (const table of tables) {
    await knex.schema.dropTableIfExists(table);
  }
}
