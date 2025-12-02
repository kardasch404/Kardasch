import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum AuditAction {
  // Auth events
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  REGISTER = 'REGISTER',
  PASSWORD_CHANGE = 'PASSWORD_CHANGE',
  PASSWORD_RESET = 'PASSWORD_RESET',
  TOKEN_REFRESH = 'TOKEN_REFRESH',
  
  // Data access
  CREATE = 'CREATE',
  READ = 'READ',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  
  // Security events
  FAILED_LOGIN = 'FAILED_LOGIN',
  ACCOUNT_LOCKED = 'ACCOUNT_LOCKED',
  IP_BANNED = 'IP_BANNED',
  CAPTCHA_FAILED = 'CAPTCHA_FAILED',
  BOT_DETECTED = 'BOT_DETECTED',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
}

export enum AuditSeverity {
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  CRITICAL = 'CRITICAL',
}

@Schema({ timestamps: true, collection: 'audit_logs' })
export class AuditLog extends Document {
  @Prop({ required: true, enum: AuditAction })
  action: AuditAction;

  @Prop({ required: true, enum: AuditSeverity, default: AuditSeverity.INFO })
  severity: AuditSeverity;

  @Prop()
  userId?: string;

  @Prop()
  username?: string;

  @Prop({ required: true })
  ip: string;

  @Prop()
  userAgent?: string;

  @Prop()
  resource?: string;

  @Prop()
  resourceId?: string;

  @Prop({ type: Object })
  metadata?: Record<string, any>;

  @Prop()
  message?: string;

  @Prop({ default: true })
  success: boolean;

  @Prop()
  errorMessage?: string;

  @Prop({ required: true })
  timestamp: Date;
}

export const AuditLogSchema = SchemaFactory.createForClass(AuditLog);

// Make audit logs immutable
AuditLogSchema.pre('save', function (next) {
  if (!this.isNew) {
    throw new Error('Audit logs are immutable');
  }
  next();
});

AuditLogSchema.index({ userId: 1, timestamp: -1 });
AuditLogSchema.index({ action: 1, timestamp: -1 });
AuditLogSchema.index({ ip: 1, timestamp: -1 });
AuditLogSchema.index({ timestamp: -1 });
