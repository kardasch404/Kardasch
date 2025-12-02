# CAPTCHA & Bot Detection System

## Overview

Adaptive security system combining reCAPTCHA v3 with behavioral bot detection for comprehensive protection against automated attacks.

## Features

### 1. reCAPTCHA v3 Integration
- **Score-based verification** (0.0 - 1.0)
- **Threshold**: 0.5 (configurable)
- **Action verification** for context-specific validation
- No user interaction required

### 2. Bot Detection

#### User-Agent Analysis
- Detects suspicious bot patterns
- Validates UA length and format
- Score: 0-40 points

#### Header Analysis
- Checks for missing browser headers
- Validates header combinations
- Score: 0-35 points

#### Honeypot Fields
- Hidden form fields that bots fill
- Fields: `website`, `url`, `homepage`, `phone_number`
- Score: 100 points (definite bot)

#### Request Frequency
- Tracks requests per IP
- 60-second sliding window
- Score: 0-30 points

#### Fingerprint Consistency
- Tracks IP + UA + Language
- Detects fingerprint changes
- Score: 0-25 points

### 3. Adaptive CAPTCHA
- **Low risk** (score < 50): No CAPTCHA required
- **Medium risk** (score 50-80): CAPTCHA recommended
- **High risk** (score > 80): CAPTCHA mandatory

## Usage

### Protect Endpoints

```typescript
@Mutation(() => AuthResponseDto)
@CaptchaAction('register')
async register(@Args('input') input: RegisterDto) {
  // Protected by CAPTCHA
}
```

### Skip CAPTCHA

```typescript
@Query(() => HealthType)
@SkipCaptcha()
async health() {
  return { status: 'ok' };
}
```

### Client Implementation

```typescript
// Include CAPTCHA token in headers
headers: {
  'x-captcha-token': captchaToken
}

// Or in request body
body: {
  captchaToken: token,
  // ... other fields
}
```

### Honeypot Fields

Add hidden fields to forms:

```html
<input type="text" name="website" style="display:none" />
<input type="text" name="url" style="display:none" />
```

## Configuration

### Environment Variables

```env
RECAPTCHA_SECRET_KEY=your-secret-key
RECAPTCHA_SITE_KEY=your-site-key
```

### Score Threshold

Default: 0.5 (can be adjusted in `CaptchaService`)

## Bot Detection Scoring

| Check | Max Score | Threshold |
|-------|-----------|-----------|
| User-Agent | 40 | Suspicious patterns |
| Headers | 35 | Missing/invalid |
| Honeypot | 100 | Any field filled |
| Frequency | 30 | >30 req/min |
| Fingerprint | 25 | Inconsistent |

**Total Bot Score >= 50 = Bot Detected**

## Response Codes

- **200**: Request allowed
- **400**: CAPTCHA verification failed
- **403**: Bot detected, CAPTCHA required

## Best Practices

1. **Always use HTTPS** in production
2. **Rotate reCAPTCHA keys** periodically
3. **Monitor bot activity** logs
4. **Adjust thresholds** based on traffic patterns
5. **Combine with rate limiting** for maximum protection

## Testing

Disable CAPTCHA in development:

```typescript
@SkipCaptcha()
```

Or use test keys from Google reCAPTCHA documentation.
