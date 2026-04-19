import { Context, Next } from 'hono';
import { HTTPException } from 'hono/http-exception';
import {
  HttpError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
  BadRequestError,
  UnprocessableEntityError,
  RateLimitError,
  InternalServerError,
} from '@/types/errors';

export async function errorMiddleware(c: Context, next: Next) {
  try {
    await next();
  } catch (error) {
    console.error('Error caught by middleware:', error);

    // Handle custom errors
    if (error instanceof HttpError) {
      return c.json(
        {
          success: false,
          error: {
            code: error.name,
            message: error.message,
            details: error.details,
          },
        },
        { status: error.statusCode }
      );
    }

    // Handle Hono HTTP exceptions
    if (error instanceof HTTPException) {
      return c.json(
        {
          success: false,
          error: {
            code: 'HTTPException',
            message: error.message,
          },
        },
        error.status
      );
    }

    // Handle Zod validation errors
    if (error instanceof Error && error.name === 'ZodError') {
      return c.json(
        {
          success: false,
          error: {
            code: 'ValidationError',
            message: 'Validation failed',
            details: error.message,
          },
        },
        400
      );
    }

    // Handle unknown errors
    return c.json(
      {
        success: false,
        error: {
          code: 'InternalServerError',
          message: 'An unexpected error occurred',
          details: process.env.NODE_ENV === 'development' ? error : undefined,
        },
      },
      500
    );
  }
}

export function notFoundHandler(c: Context) {
  return c.json(
    {
      success: false,
      error: {
        code: 'NotFound',
        message: 'The requested resource was not found',
      },
    },
    404
  );
}
