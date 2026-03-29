import { Context, Next } from 'hono';
import { ZodSchema } from 'zod';
import { ValidationError } from '@nova-health/types';

export function validateBody<T>(schema: ZodSchema<T>) {
  return async (c: Context, next: Next) => {
    try {
      const body = await c.req.json();
      const validatedData = schema.parse(body);

      // Store validated data in context for use in route handlers
      c.set('validatedBody', validatedData);

      await next();
    } catch (error) {
      if (error instanceof Error && error.name === 'ZodError') {
        const zodError = error as any;
        const formattedErrors = zodError.errors.map((e: any) => ({
          field: e.path.join('.'),
          message: e.message,
        }));

        throw new ValidationError('Validation failed', formattedErrors);
      }
      throw error;
    }
  };
}

export function validateQuery<T>(schema: ZodSchema<T>) {
  return async (c: Context, next: Next) => {
    try {
      const query = c.req.query();
      const validatedData = schema.parse(query);

      // Store validated data in context for use in route handlers
      c.set('validatedQuery', validatedData);

      await next();
    } catch (error) {
      if (error instanceof Error && error.name === 'ZodError') {
        const zodError = error as any;
        const formattedErrors = zodError.errors.map((e: any) => ({
          field: e.path.join('.'),
          message: e.message,
        }));

        throw new ValidationError('Query validation failed', formattedErrors);
      }
      throw error;
    }
  };
}

export function validateParams<T>(schema: ZodSchema<T>) {
  return async (c: Context, next: Next) => {
    try {
      const params = c.req.param();
      const validatedData = schema.parse(params);

      // Store validated data in context for use in route handlers
      c.set('validatedParams', validatedData);

      await next();
    } catch (error) {
      if (error instanceof Error && error.name === 'ZodError') {
        const zodError = error as any;
        const formattedErrors = zodError.errors.map((e: any) => ({
          field: e.path.join('.'),
          message: e.message,
        }));

        throw new ValidationError('Parameter validation failed', formattedErrors);
      }
      throw error;
    }
  };
}

// Helper function to get validated data from context
export function getValidatedBody<T>(c: Context): T {
  return c.get('validatedBody') as T;
}

export function getValidatedQuery<T>(c: Context): T {
  return c.get('validatedQuery') as T;
}

export function getValidatedParams<T>(c: Context): T {
  return c.get('validatedParams') as T;
}
