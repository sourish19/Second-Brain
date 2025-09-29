class ApiResponse {
  readonly success = true;
  readonly status: number;
  readonly message: string;
  readonly data: unknown[];
  constructor(status: number, message: string, data: unknown[] = []) {
    this.status = status;
    this.message = message;
    this.data = data;
  }
}

export default ApiResponse;
