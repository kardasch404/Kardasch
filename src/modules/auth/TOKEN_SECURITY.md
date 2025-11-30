# JWT Token Security Implementation

## Architecture Overview

### Dual Token Strategy (Best Practice)

1. **Access Token (15 minutes)**
   - Stored in **memory** (React state/variable)
   - Sent in Authorization header: `Bearer <token>`
   - Short-lived to minimize exposure
   - Blacklisted in Redis on logout

2. **Refresh Token (7 days)**
   - Stored in **HttpOnly, Secure, SameSite cookie**
   - Cannot be accessed by JavaScript (XSS protection)
   - Automatically sent with requests
   - Stored in MongoDB with device fingerprint
   - Rotated on each refresh

## Security Features

### 1. HttpOnly Cookies (Refresh Token)
```typescript
// Backend sets cookie
res.cookie('refreshToken', token, {
  httpOnly: true,      // JavaScript cannot access
  secure: true,        // HTTPS only
  sameSite: 'strict',  // CSRF protection
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
});
```

### 2. Token Rotation
- Old refresh token is revoked when new one is issued
- Prevents token reuse attacks
- Automatic rotation on `/auth/refresh` endpoint

### 3. Device Fingerprinting
- Hash of User-Agent + IP address
- Prevents token theft across devices
- Validates device on token refresh

### 4. Token Blacklisting
- Access tokens blacklisted in Redis on logout
- 15-minute TTL (matches token expiration)
- Prevents use of stolen tokens

### 5. MongoDB Storage
- Refresh tokens hashed (SHA-256) before storage
- TTL index for automatic cleanup
- Revocation tracking with timestamps

## Frontend Integration

### Login Flow
```typescript
// 1. Login request
const response = await fetch('/auth/login', {
  method: 'POST',
  credentials: 'include', // Important: send cookies
  body: JSON.stringify({ email, password }),
});

const { accessToken } = await response.json();
// Store access token in memory (React state)
setAccessToken(accessToken);
// Refresh token automatically stored in cookie
```

### API Requests
```typescript
// Use access token from memory
fetch('/api/protected', {
  headers: {
    'Authorization': `Bearer ${accessToken}`,
  },
  credentials: 'include', // Send refresh token cookie
});
```

### Token Refresh
```typescript
// When access token expires (401)
const response = await fetch('/auth/refresh', {
  method: 'POST',
  credentials: 'include', // Send refresh token cookie
});

const { accessToken } = await response.json();
setAccessToken(accessToken);
// New refresh token automatically set in cookie
```

### Logout
```typescript
await fetch('/auth/logout', {
  method: 'POST',
  credentials: 'include',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
  },
});

setAccessToken(null);
// Cookie cleared by backend
```

## Why This Approach?

### ❌ Storing Refresh Token in localStorage
- Vulnerable to XSS attacks
- JavaScript can access and steal it
- No automatic expiration

### ✅ HttpOnly Cookies
- JavaScript cannot access (XSS protection)
- Automatic expiration
- SameSite prevents CSRF
- Secure flag ensures HTTPS only

### ✅ Access Token in Memory
- Lost on page refresh (intentional)
- Use refresh token to get new one
- Minimal exposure window (15 min)

## Attack Mitigation

| Attack | Mitigation |
|--------|-----------|
| XSS | HttpOnly cookies + CSP headers |
| CSRF | SameSite=strict + CORS |
| Token Theft | Device fingerprinting + rotation |
| Token Reuse | Blacklisting + revocation |
| Man-in-the-Middle | HTTPS only (Secure flag) |

## Usage Example

```typescript
// In your resolver/controller
@Post('login')
async login(@Body() dto: LoginDto, @Req() req: Request, @Res() res: Response) {
  const user = await this.authService.validateUser(dto.email, dto.password);
  
  const deviceFingerprint = this.tokenService.generateDeviceFingerprint(
    req.headers['user-agent'],
    req.ip,
  );
  
  const { accessToken, refreshToken } = await this.tokenService.generateTokenPair(
    user.id,
    user.email,
    deviceFingerprint,
  );
  
  // Set HttpOnly cookie
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  
  // Return access token in response body
  return res.json({ accessToken });
}
```
