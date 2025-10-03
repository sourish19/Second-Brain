class ApiError<E = unknown, D = unknown> extends Error {
  public readonly success = false;
  public readonly status: number;
  public readonly error: E[];
  public readonly data: D[];
  constructor(
    status: number,
    message: string = '',
    error: E[] = [],
    data: D[] = [],
    stack?: string
  ) {
    super(message);
    this.status = status;
    this.error = error;
    this.data = data;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;
