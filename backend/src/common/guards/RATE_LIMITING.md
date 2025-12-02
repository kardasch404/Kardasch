# Multi-Tier Rate Limiting System

## Overview

The rate limiting system provides distributed, Redis-based rate limiting with multiple tiers based on user roles and GraphQL query complexity.

## Rate Limit Tiers

| Role | Requests/Min | GraphQL Cost Limit |
|------|--------------|-------------------|
| Anonymous | 10 | 100 |
| Authenticated User | 100 | 1,000 |
| Admin | 1,000 | 10,000 |

## Features

### 1. Multi-Tier Limiting
- **IP-based** for anonymous users
- **User-based** for authenticated users
- **Role-based** tier assignment

### 2. GraphQL Cost Calculation
- Base cost: 1 per query
- Additional cost for nested selections
- 2x multiplier for search operations
- Argument-based cost (0.5 per argument)

### 3. Redis-Based Distribution
- Distributed rate limiting across multiple instances
- 60-second sliding window
- Automatic key expiration

## Usage

### Skip Rate Limiting

Use the `@SkipRateLimit()` decorator to bypass rate limiting:

```typescript
@Query(() => HealthType)
@SkipRateLimit()
async health(): Promise<HealthType> {
  return { status: 'ok' };
}
```

## Error Response

When rate limit is exceeded:

```json
{
  "statusCode": 429,
  "message": "Rate limit exceeded",
  "retryAfter": 60
}
```

## Configuration

Environment variables:
- `REDIS_HOST` - Redis server host
- `REDIS_PORT` - Redis server port
- `REDIS_PASSWORD` - Redis password (optional)

## Implementation Details

- Uses Redis for distributed state
- Tracks both request count and GraphQL cost
- Separate counters per user/IP and role
- Automatic cleanup via TTL
