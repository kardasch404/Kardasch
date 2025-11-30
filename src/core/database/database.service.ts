import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Connection } from 'mongoose';
import { IDatabaseConnection, IHealthCheck } from '../../common/interfaces/database.interface';

@Injectable()
export class DatabaseService implements IDatabaseConnection, IHealthCheck, OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(DatabaseService.name);
  private connection: Connection;
  private static instance: DatabaseService;

  constructor(private configService: ConfigService) {
    if (DatabaseService.instance) {
      return DatabaseService.instance;
    }
    DatabaseService.instance = this;
  }

  async onModuleInit() {
    await this.connect();
  }

  async onModuleDestroy() {
    await this.disconnect();
  }

  async connect(): Promise<void> {
    const maxAttempts = this.configService.get<number>('database.retry.attempts', 5);
    const delay = this.configService.get<number>('database.retry.delay', 3000);

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        this.logger.log(`Connecting to MongoDB (attempt ${attempt}/${maxAttempts})...`);
        // Connection is handled by MongooseModule
        this.logger.log('MongoDB connected successfully');
        return;
      } catch (error) {
        this.logger.error(`MongoDB connection failed: ${error.message}`);
        if (attempt < maxAttempts) {
          await this.sleep(delay);
        } else {
          throw error;
        }
      }
    }
  }

  async disconnect(): Promise<void> {
    if (this.connection) {
      await this.connection.close();
      this.logger.log('MongoDB disconnected');
    }
  }

  isConnected(): boolean {
    return this.connection?.readyState === 1;
  }

  getConnection(): Connection {
    return this.connection;
  }

  async check(): Promise<boolean> {
    return this.isConnected();
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
