import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { UserRole, RateLimitTier } from '../../config/rate-limit.config';
import { SKIP_RATE_LIMIT_KEY } from '../decorators/skip-rate-limit.decorator';

@Injectable()
export class RateLimitGuard implements CanActivate {
  private readonly windowMs: number;
  private readonly keyPrefix: string;

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private configService: ConfigService,
    private reflector: Reflector,
  ) {
    this.windowMs = this.configService.get('rateLimit.windowMs', 60000);
    this.keyPrefix = this.configService.get('rateLimit.redisKeyPrefix', 'rate-limit:');
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check if rate limiting should be skipped
    const skipRateLimit = this.reflector.getAllAndOverride<boolean>(SKIP_RATE_LIMIT_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (skipRateLimit) {
      return true;
    }

    const gqlContext = GqlExecutionContext.create(context);
    const ctx = gqlContext.getContext();
    const request = ctx.req;

    // Get user role
    const user = request.user;
    const role = this.getUserRole(user);

    // Get rate limit tier
    const tier = this.getRateLimitTier(role);

    // Get identifier (user ID or IP)
    const identifier = user?.id || this.getClientIp(request);
    const key = `${this.keyPrefix}${role}:${identifier}`;

    // Check request count
    const current = await this.getCurrentCount(key);
    
    if (current >= tier.requestsPerMinute) {
      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          message: 'Rate limit exceeded',
          retryAfter: Math.ceil(this.windowMs / 1000),
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    // Check GraphQL cost if applicable
    const info = gqlContext.getInfo();
    if (info) {
      const cost = this.calculateGraphQLCost(info);
      const costKey = `${this.keyPrefix}cost:${role}:${identifier}`;
      const currentCost = await this.getCurrentCount(costKey);

      if (currentCost + cost > tier.graphqlCostLimit) {
        throw new HttpException(
          {
            statusCode: HttpStatus.TOO_MANY_REQUESTS,
            message: 'GraphQL cost limit exceeded',
            retryAfter: Math.ceil(this.windowMs / 1000),
          },
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }

      await this.incrementCount(costKey, cost);
    }

    // Increment request count
    await this.incrementCount(key);

    return true;
  }

  private getUserRole(user: any): UserRole {
    if (!user) return UserRole.ANONYMOUS;
    if (user.role === 'admin') return UserRole.ADMIN;
    return UserRole.USER;
  }

  private getRateLimitTier(role: UserRole): RateLimitTier {
    const tiers = this.configService.get('rateLimit.tiers');
    return tiers[role];
  }

  private getClientIp(request: any): string {
    return (
      request.headers['x-forwarded-for']?.split(',')[0] ||
      request.headers['x-real-ip'] ||
      request.connection?.remoteAddress ||
      request.socket?.remoteAddress ||
      'unknown'
    );
  }

  private async getCurrentCount(key: string): Promise<number> {
    const count = await this.cacheManager.get<number>(key);
    return count || 0;
  }

  private async incrementCount(key: string, increment = 1): Promise<void> {
    const current = await this.getCurrentCount(key);
    const ttl = Math.ceil(this.windowMs / 1000);
    await this.cacheManager.set(key, current + increment, ttl);
  }

  private calculateGraphQLCost(info: any): number {
    let cost = 1; // Base cost

    // Calculate based on query complexity
    const fieldNodes = info.fieldNodes || [];
    
    fieldNodes.forEach((node: any) => {
      // Add cost for each selection
      if (node.selectionSet) {
        cost += this.countSelections(node.selectionSet);
      }

      // Add cost for arguments (pagination, filters)
      if (node.arguments?.length) {
        cost += node.arguments.length * 0.5;
      }
    });

    // Check for expensive operations
    const operationName = info.operation?.name?.value || '';
    if (operationName.toLowerCase().includes('search')) {
      cost *= 2; // Search operations are more expensive
    }

    return Math.ceil(cost);
  }

  private countSelections(selectionSet: any): number {
    if (!selectionSet?.selections) return 0;

    let count = selectionSet.selections.length;

    selectionSet.selections.forEach((selection: any) => {
      if (selection.selectionSet) {
        count += this.countSelections(selection.selectionSet);
      }
    });

    return count;
  }
}
