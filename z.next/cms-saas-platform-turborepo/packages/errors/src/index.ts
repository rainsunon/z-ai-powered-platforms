// ─── Custom Error Classes ───────────────────────────────────

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly isOperational: boolean;
  public readonly details?: Record<string, unknown>;

  constructor(
    message: string,
    statusCode: number = 500,
    code: string = 'INTERNAL_ERROR',
    isOperational: boolean = true,
    details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = isOperational;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, id?: string) {
    super(
      id ? `${resource} with id '${id}' not found` : `${resource} not found`,
      404,
      'NOT_FOUND',
    );
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 400, 'VALIDATION_ERROR', true, details);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(message, 401, 'UNAUTHORIZED');
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Access denied') {
    super(message, 403, 'FORBIDDEN');
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409, 'CONFLICT');
  }
}

export class RateLimitError extends AppError {
  constructor(retryAfter?: number) {
    super('Rate limit exceeded', 429, 'RATE_LIMIT_EXCEEDED', true, {
      retryAfter,
    });
  }
}

export class ServiceUnavailableError extends AppError {
  constructor(service: string) {
    super(`${service} is temporarily unavailable`, 503, 'SERVICE_UNAVAILABLE');
  }
}

export class TenantNotFoundError extends NotFoundError {
  constructor(tenantId: string) {
    super('Tenant', tenantId);
    this.code = 'TENANT_NOT_FOUND';
  }
}

export class InsufficientPermissionsError extends ForbiddenError {
  constructor(permission: string) {
    super(`Missing required permission: ${permission}`);
    this.code = 'INSUFFICIENT_PERMISSIONS';
  }
}

export class PlanLimitExceededError extends AppError {
  constructor(limit: string) {
    super(`Plan limit exceeded: ${limit}`, 402, 'PLAN_LIMIT_EXCEEDED');
  }
}

// ─── Error Serialization ───────────────────────────────────

export interface SerializedError {
  error: {
    code: string;
    message: string;
    statusCode: number;
    details?: Record<string, unknown>;
    stack?: string;
  };
}

export function serializeError(err: AppError, includeStack = false): SerializedError {
  return {
    error: {
      code: err.code,
      message: err.message,
      statusCode: err.statusCode,
      details: err.details,
      ...(includeStack && { stack: err.stack }),
    },
  };
}

export function isOperationalError(error: Error): boolean {
  if (error instanceof AppError) {
    return error.isOperational;
  }
  return false;
}
