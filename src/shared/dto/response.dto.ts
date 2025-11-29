export class ResponseDto<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: Date;

  constructor(success: boolean, data?: T, error?: string) {
    this.success = success;
    this.data = data;
    this.error = error;
    this.timestamp = new Date();
  }
}
