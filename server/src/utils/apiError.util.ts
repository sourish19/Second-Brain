class ApiError extends Error {
  readonly success = false;
  readonly status: number;
  readonly error: unknown[];
  constructor(
    status: number,
    message: string = '',
    error: unknown[] = [],
    stack?: string
  ) {
    super(message);
    this.status = status;
    this.error = error;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;
