export interface IDatabaseConnection {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  isConnected(): boolean;
  getConnection(): any;
}

export interface IHealthCheck {
  check(): Promise<boolean>;
}
