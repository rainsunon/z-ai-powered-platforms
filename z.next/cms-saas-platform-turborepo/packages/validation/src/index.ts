import { z } from 'zod';

// ─── Common Validators ───────────────────────────────────

export const uuid = z.string().uuid();

export const email = z.string().email().max(255).toLowerCase().trim();

export const password = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128)
  .regex(/[A-Z]/, 'Password must contain an uppercase letter')
  .regex(/[a-z]/, 'Password must contain a lowercase letter')
  .regex(/[0-9]/, 'Password must contain a number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain a special character');

export const slug = z
  .string()
  .min(1)
  .max(255)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid slug format');

export const username = z
  .string()
  .min(3)
  .max(50)
  .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores and hyphens');

export const tenantSlug = z
  .string()
  .min(3)
  .max(63)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid tenant slug');

// ─── Pagination ───────────────────────────────────

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// ─── Content Schemas ───────────────────────────────────

export const blockTypeSchema = z.enum([
  'paragraph',
  'heading',
  'image',
  'video',
  'quote',
  'code',
  'table',
  'list',
  'embed',
  'markdown',
  'divider',
  'callout',
  'toggle',
  'columns',
]);

export const contentBlockSchema: z.ZodType<ContentBlock> = z.lazy(() =>
  z.object({
    id: z.string().uuid(),
    type: blockTypeSchema,
    data: z.record(z.unknown()),
    children: z.array(contentBlockSchema).optional(),
    meta: z
      .object({
        order: z.number().int().min(0),
        style: z.record(z.string()).optional(),
      })
      .optional(),
  }),
);

export interface ContentBlock {
  id: string;
  type: z.infer<typeof blockTypeSchema>;
  data: Record<string, unknown>;
  children?: ContentBlock[];
  meta?: {
    order: number;
    style?: Record<string, string>;
  };
}

export const contentStatusSchema = z.enum([
  'draft',
  'review',
  'scheduled',
  'published',
  'archived',
]);

export const createContentSchema = z.object({
  title: z.string().min(1).max(500),
  slug: slug.optional(),
  blocks: z.array(contentBlockSchema),
  status: contentStatusSchema.default('draft'),
  tags: z.array(z.string()).optional(),
  categories: z.array(z.string().uuid()).optional(),
  meta: z.record(z.unknown()).optional(),
  publishAt: z.string().datetime().optional(),
});

export const updateContentSchema = createContentSchema.partial();

// ─── User Schemas ───────────────────────────────────

export const createUserSchema = z.object({
  email,
  password,
  username: username.optional(),
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().min(1).max(100).optional(),
});

export const updateUserSchema = z.object({
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().min(1).max(100).optional(),
  username: username.optional(),
  avatar: z.string().url().optional(),
  bio: z.string().max(500).optional(),
});

// ─── Auth Schemas ───────────────────────────────────

export const loginSchema = z.object({
  email,
  password: z.string().min(1),
  twoFactorCode: z.string().length(6).optional(),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1),
});

// ─── Tenant Schemas ───────────────────────────────────

export const createTenantSchema = z.object({
  name: z.string().min(2).max(100),
  slug: tenantSlug,
  plan: z.enum(['free', 'pro', 'enterprise']).default('free'),
});

export const updateTenantSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  settings: z.record(z.unknown()).optional(),
});

// ─── Media Schemas ───────────────────────────────────

export const uploadMediaSchema = z.object({
  filename: z.string().min(1).max(255),
  mimeType: z.string().min(1),
  size: z.number().int().positive(),
  folderId: z.string().uuid().optional(),
  alt: z.string().max(500).optional(),
  tags: z.array(z.string()).optional(),
});

// ─── Comment Schemas ───────────────────────────────────

export const createCommentSchema = z.object({
  contentId: z.string().uuid(),
  body: z.string().min(1).max(5000),
  parentId: z.string().uuid().optional(),
});

// ─── Webhook Schemas ───────────────────────────────────

export const webhookSchema = z.object({
  url: z.string().url(),
  events: z.array(z.string()).min(1),
  secret: z.string().min(16).optional(),
  active: z.boolean().default(true),
});

// ─── Validation Helper ───────────────────────────────────

export function validate<T>(schema: z.ZodSchema<T>, data: unknown): T {
  return schema.parse(data);
}

export function safeParse<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
): { success: true; data: T } | { success: false; errors: z.ZodError } {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, errors: result.error };
}

export { z };
