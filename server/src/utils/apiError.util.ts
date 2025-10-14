class ApiError<E = unknown, D = unknown> extends Error {
  public readonly success = false;
  public readonly status: number;
  public readonly error: E[];
  public readonly data: D[];
  public readonly code: string;
  constructor(
    status: number = 500,
    message: string = 'Something went wrong',
    error: E[] = [],
    data: D[] = [],
    code: string = 'SERVER_ERROR',
    stack?: string
  ) {
    super(message);
    this.status = status;
    this.name = this.constructor.name;
    this.error = error;
    this.data = data;
    this.code = code;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export class BadRequestError<E = unknown, D = unknown> extends ApiError<E, D> {
  constructor(
    message: string = 'Bad request',
    error: E[] = [],
    data: D[] = [],
    stack?: string
  ) {
    super(400, message, error, data, 'BAD_REQUEST', stack);
  }
}

export class UnauthorizedError<E = unknown, D = unknown> extends ApiError<
  E,
  D
> {
  constructor(
    message: string = 'Unauthorized request',
    error: E[] = [],
    data: D[] = [],
    stack?: string
  ) {
    super(401, message, error, data, 'UNAUTHORIZED', stack);
  }
}

export class ForbiddenError<E = unknown, D = unknown> extends ApiError<E, D> {
  constructor(
    message: string = 'Forbidden request',
    error: E[] = [],
    data: D[] = [],
    stack?: string
  ) {
    super(403, message, error, data, 'FORBIDDEN', stack);
  }
}

export class NotFoundError<E = unknown, D = unknown> extends ApiError<E, D> {
  constructor(
    message: string = 'Resource not found',
    error: E[] = [],
    data: D[] = [],
    stack?: string
  ) {
    super(404, message, error, data, 'NOT_FOUND', stack);
  }
}

export class ConflictError<E = unknown, D = unknown> extends ApiError<E, D> {
  constructor(
    message: string = 'Resource already exists',
    error: E[] = [],
    data: D[] = [],
    stack?: string
  ) {
    super(409, message, error, data, 'CONFLICT', stack);
  }
}

export class ValidationError<E = unknown, D = unknown> extends ApiError<E, D> {
  constructor(
    message = 'Validation failed',
    error: E[] = [],
    data: D[] = [],
    stack?: string
  ) {
    super(422, message, error, data, 'VALIDATION_ERROR', stack);
  }
}

export class InternalServerError<E = unknown, D = unknown> extends ApiError<
  E,
  D
> {
  constructor(
    message = 'Internal server error',
    error: E[] = [],
    data: D[] = [],
    stack?: string
  ) {
    super(500, message, error, data, 'SERVER_ERROR', stack);
  }
}

export class TooManyRequests<E = unknown, D = unknown> extends ApiError<E, D> {
  constructor(
    message = 'Too many requests',
    error: E[] = [],
    data: D[] = [],
    stack?: string
  ) {
    super(429, message, error, data, 'TOO_MANY_REQUESTS', stack);
  }
}

export default ApiError;
