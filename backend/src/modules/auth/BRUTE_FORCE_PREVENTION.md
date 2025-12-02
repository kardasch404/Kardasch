# Brute Force Prevention System

## Overview

Multi-layered brute force protection with progressive delays, account lockout, and IP banning to prevent credential stuffing and password guessing attacks.

## Features

### 1. Progressive Delays (Exponential Backoff)
- **Formula**: 2^n seconds
- Applied after each failed attempt
- Prevents rapid-fire login attempts

| Attempt | Delay |
|---------|-------|
| 1 | 2 seconds |
| 2 | 4 seconds |
| 3 | 8 seconds |
| 4 | 16 seconds |

### 2. Account Lockout
- **Threshold**: 5 failed attempts
- **Duration**: 30 minutes
- Prevents targeted account attacks
- Automatic unlock after duration

### 3. IP Banning
- **Threshold**: 10 failed attempts
- **Duration**: 24 hours
- Prevents distributed attacks
- Protects against credential stuffing

### 4. Automatic Reset
- Successful login resets all counters
- Both account and IP attempts cleared

## Implementation

### Service Methods

```typescript
// Check if IP is banned
await bruteForceService.checkIpBan(ip);

// Check if account is locked
await bruteForceService.checkAccountLock(email);

// Record failed attempt
await bruteForceService.recordFailedAttempt(email, ip);

// Record successful login (resets counters)
await bruteForceService.recordSuccessfulLogin(email, ip);
```

### Integration in AuthService

```typescript
async login(dto: LoginDto, deviceFingerprint: string, ip: string) {
  // 1. Check IP ban
  await this.bruteForceService.checkIpBan(ip);
  
  // 2. Validate user
  const user = await this.userService.findByEmail(dto.identifier);
  
  if (!user) {
    await this.bruteForceService.recordFailedAttempt(dto.identifier, ip);
    throw new UnauthorizedException('Invalid credentials');
  }
  
  // 3. Check account lock
  await this.bruteForceService.checkAccountLock(user.email);
  
  // 4. Verify password
  const isValid = await this.passwordService.verify(user.password, dto.password);
  
  if (!isValid) {
    await this.bruteForceService.recordFailedAttempt(user.email, ip);
    throw new UnauthorizedException('Invalid credentials');
  }
  
  // 5. Reset on success
  await this.bruteForceService.recordSuccessfulLogin(user.email, ip);
  
  return { accessToken, user };
}
```

## Error Messages

### Progressive Delay
```
Too many failed attempts. Please wait X seconds before trying again.
```

### Account Locked
```
Account locked due to too many failed attempts. Try again in X seconds.
```

### IP Banned
```
IP address banned due to excessive failed attempts. Try again in X hours.
```

## Storage

All data stored in Redis with automatic expiration:
- **Account attempts**: `brute-force:account:{email}`
- **IP attempts**: `brute-force:ip:{ip}`

### Data Structure
```typescript
{
  count: number;           // Number of failed attempts
  lastAttempt: number;     // Timestamp of last attempt
  lockedUntil?: number;    // Timestamp when lock expires
}
```

## Logging

### Account Lock
```
[WARN] Account locked: user@example.com after 5 failed attempts
```

### IP Ban
```
[ERROR] IP banned: 192.168.1.1 after 10 failed attempts
```

## Email Alerts (TODO)

Planned notifications:
- Account locked notification to user
- IP ban notification to admin
- Suspicious activity alerts

## Configuration

```typescript
private readonly MAX_ATTEMPTS = 5;              // Account lock threshold
private readonly ACCOUNT_LOCK_DURATION = 1800;  // 30 minutes
private readonly IP_MAX_ATTEMPTS = 10;          // IP ban threshold
private readonly IP_BAN_DURATION = 86400;       // 24 hours
```

## Best Practices

1. **Always check IP ban first** - Prevents unnecessary database queries
2. **Check account lock before password verification** - Saves CPU cycles
3. **Record failed attempts for both valid and invalid users** - Prevents user enumeration
4. **Use consistent error messages** - Don't reveal if account exists
5. **Log all lockouts and bans** - Monitor for attack patterns

## Testing

```bash
# Run unit tests
npm test brute-force.service.spec.ts
```

## Monitoring

Track these metrics:
- Failed login attempts per hour
- Number of locked accounts
- Number of banned IPs
- Average time between attempts

## Future Enhancements

- [ ] Email notifications
- [ ] Admin dashboard for viewing locked accounts
- [ ] Whitelist trusted IPs
- [ ] Configurable thresholds per environment
- [ ] Machine learning for anomaly detection
