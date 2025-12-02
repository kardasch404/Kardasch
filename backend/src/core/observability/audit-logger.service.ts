import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuditLog, AuditAction, AuditSeverity } from '../../modules/logging/entities/audit-log.entity';
import { LoggerService } from './logger.service';

export interface AuditLogData {
  action: AuditAction;
  severity?: AuditSeverity;
  userId?: string;
  username?: string;
  ip: string;
  userAgent?: string;
  resource?: string;
  resourceId?: string;
  metadata?: Record<string, any>;
  message?: string;
  success?: boolean;
  errorMessage?: string;
}

@Injectable()
export class AuditLoggerService {
  private readonly PII_FIELDS = ['password', 'token', 'refreshToken', 'accessToken', 'ssn', 'creditCard'];

  constructor(
    @InjectModel(AuditLog.name) private auditLogModel: Model<AuditLog>,
    private logger: LoggerService,
  ) {}

  async log(data: AuditLogData): Promise<void> {
    try {
      const sanitizedMetadata = this.maskPII(data.metadata);

      await this.auditLogModel.create({
        action: data.action,
        severity: data.severity || AuditSeverity.INFO,
        userId: data.userId,
        username: data.username,
        ip: this.maskIp(data.ip),
        userAgent: data.userAgent,
        resource: data.resource,
        resourceId: data.resourceId,
        metadata: sanitizedMetadata,
        message: data.message,
        success: data.success ?? true,
        errorMessage: data.errorMessage,
        timestamp: new Date(),
      });

      this.logger.log(
        `Audit: ${data.action} by ${data.username || data.userId || 'anonymous'} from ${data.ip}`,
        'AuditLogger',
      );
    } catch (error) {
      this.logger.error('Failed to create audit log', error.stack, 'AuditLogger');
    }
  }

  async logAuth(action: AuditAction, data: Partial<AuditLogData>): Promise<void> {
    await this.log({
      action,
      severity: action.includes('FAILED') ? AuditSeverity.WARNING : AuditSeverity.INFO,
      ...data,
      ip: data.ip || 'unknown',
    });
  }

  async logDataAccess(action: AuditAction, resource: string, data: Partial<AuditLogData>): Promise<void> {
    await this.log({
      action,
      resource,
      severity: AuditSeverity.INFO,
      ...data,
      ip: data.ip || 'unknown',
    });
  }

  async logSecurityEvent(action: AuditAction, data: Partial<AuditLogData>): Promise<void> {
    await this.log({
      action,
      severity: AuditSeverity.ERROR,
      success: false,
      ...data,
      ip: data.ip || 'unknown',
    });
  }

  async findByUser(userId: string, limit = 100): Promise<AuditLog[]> {
    return this.auditLogModel
      .find({ userId })
      .sort({ timestamp: -1 })
      .limit(limit)
      .exec();
  }

  async findByAction(action: AuditAction, limit = 100): Promise<AuditLog[]> {
    return this.auditLogModel
      .find({ action })
      .sort({ timestamp: -1 })
      .limit(limit)
      .exec();
  }

  async findByIp(ip: string, limit = 100): Promise<AuditLog[]> {
    const maskedIp = this.maskIp(ip);
    return this.auditLogModel
      .find({ ip: maskedIp })
      .sort({ timestamp: -1 })
      .limit(limit)
      .exec();
  }

  async findSecurityEvents(hours = 24): Promise<AuditLog[]> {
    const since = new Date(Date.now() - hours * 3600000);
    return this.auditLogModel
      .find({
        severity: { $in: [AuditSeverity.ERROR, AuditSeverity.CRITICAL] },
        timestamp: { $gte: since },
      })
      .sort({ timestamp: -1 })
      .exec();
  }

  private maskPII(data?: Record<string, any>): Record<string, any> | undefined {
    if (!data) return undefined;

    const masked = { ...data };

    for (const field of this.PII_FIELDS) {
      if (masked[field]) {
        masked[field] = '***REDACTED***';
      }
    }

    // Mask email partially
    if (masked.email && typeof masked.email === 'string') {
      const [local, domain] = masked.email.split('@');
      if (local && domain) {
        masked.email = `${local.substring(0, 2)}***@${domain}`;
      }
    }

    return masked;
  }

  private maskIp(ip: string): string {
    if (!ip || ip === 'unknown') return 'unknown';

    // IPv4: mask last octet
    if (ip.includes('.')) {
      const parts = ip.split('.');
      if (parts.length === 4) {
        return `${parts[0]}.${parts[1]}.${parts[2]}.***`;
      }
    }

    // IPv6: mask last 4 groups
    if (ip.includes(':')) {
      const parts = ip.split(':');
      if (parts.length >= 4) {
        return parts.slice(0, 4).join(':') + ':****';
      }
    }

    return ip;
  }
}
