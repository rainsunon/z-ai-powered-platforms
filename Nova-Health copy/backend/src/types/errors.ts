// ============================================
// Error Types
// ============================================

export interface AppError {
  code: string;
  message: string;
  details?: any;
  statusCode: number;
  stack?: string;
}

export class HttpError extends Error {
  statusCode: number;
  details?: any;
  constructor(
    message: string,
    statusCode: number,
    details?: any,
    stack?: string
  ) {
    super(message);
    this.name = 'HttpError';
    this.statusCode = statusCode;
    this.details = details;
    this.stack = stack;
  }
}

export class ValidationError extends Error {
  details?: any;
  constructor(message: string, details?: any) {
    super(message);
    this.name = 'ValidationError';
    this.details = details;
  }
}

export class AuthenticationError extends HttpError {
  constructor(message: string, details?: any) {
    super(message, 401, details);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends HttpError {
  constructor(message: string, details?: any) {
    super(message, 403, details);
    this.name = 'AuthorizationError';
  }
}

export class NotFoundError extends HttpError {
  constructor(message: string, details?: any) {
    super(message, 404, details);
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends HttpError {
  constructor(message: string, details?: any) {
    super(message, 409, details);
    this.name = 'ConflictError';
  }
}

export class BadRequestError extends HttpError {
  constructor(message: string, details?: any) {
    super(message, 400, details);
    this.name = 'BadRequestError';
  }
}

export class UnprocessableEntityError extends HttpError {
  constructor(message: string, details?: any) {
    super(message, 422, details);
    this.name = 'UnprocessableEntityError';
  }
}

export class RateLimitError extends HttpError {
  constructor(message: string, details?: any) {
    super(message, 429, details);
    this.name = 'RateLimitError';
  }
}

export class InternalServerError extends HttpError {
  constructor(message: string, details?: any) {
    super(message, 500, details);
    this.name = 'InternalServerError';
  }
}
