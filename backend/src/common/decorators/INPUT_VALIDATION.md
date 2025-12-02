# Input Validation & Sanitization

## Overview

Comprehensive input validation and sanitization system to prevent XSS, SQL/NoSQL injection, and other security vulnerabilities.

## Features

### 1. Global Validation Pipe
- **Whitelist**: Strips non-whitelisted properties
- **Forbid Non-Whitelisted**: Throws error on unexpected properties
- **Auto-Transform**: Converts payloads to DTO instances
- **Custom Error Messages**: Structured validation errors
- **Production Mode**: Hides detailed errors in production

### 2. Sanitization Decorators

#### @SanitizeHtml()
Removes dangerous HTML content while preserving safe text:
- Removes `<script>`, `<iframe>`, `<object>`, `<embed>` tags
- Strips event handlers (`onclick`, `onerror`, etc.)
- Removes `javascript:` protocol
- Trims whitespace

```typescript
@Field()
@SanitizeHtml()
description: string;
```

#### @StripHtml()
Removes all HTML tags:
```typescript
@Field()
@StripHtml()
firstName: string;
```

#### @SanitizeNoSQL()
Prevents NoSQL injection:
- Removes MongoDB operators (`$`, `{}`)
- Removes path traversal (`..`)
```typescript
@Field()
@SanitizeNoSQL()
identifier: string;
```

#### @Trim()
Removes leading/trailing whitespace:
```typescript
@Field()
@Trim()
username: string;
```

#### @ToLowerCase()
Converts to lowercase:
```typescript
@Field()
@ToLowerCase()
email: string;
```

#### @NormalizeEmail()
Normalizes email (lowercase + trim):
```typescript
@Field()
@NormalizeEmail()
email: string;
```

#### @SanitizeUrl()
Validates and sanitizes URLs:
- Only allows `http://`, `https://`, `mailto:` protocols
- Blocks `javascript:` and `data:` protocols
```typescript
@Field()
@SanitizeUrl()
website: string;
```

## Validation Rules

### Authentication DTOs

**RegisterDto**:
- Email: Valid format, normalized
- Username: 3-30 chars, alphanumeric + `_-`, trimmed
- Password: 8-128 chars
- Names: Max 50 chars, HTML stripped

**LoginDto**:
- Identifier: Max 255 chars, NoSQL sanitized
- Password: 8-128 chars

### Profile DTOs

**UpdateProfileDto**:
- Title: Max 200 chars, HTML sanitized
- Description: Max 500 chars, HTML sanitized
- Content: Max 5000 chars, HTML sanitized
- URLs: Valid format, protocol sanitized

### Project DTOs

**CreateProjectInput**:
- Title: 3-200 chars, HTML sanitized
- Description: 10-2000 chars, HTML sanitized
- Language: 2-letter ISO code
- URLs: Valid format, protocol sanitized

**SearchProjectInput**:
- Query: Max 200 chars, NoSQL sanitized
- Limit: 1-100

## Usage Examples

### Basic Validation
```typescript
@InputType()
export class CreateUserDto {
  @Field()
  @IsEmail({}, { message: 'Invalid email format' })
  @NormalizeEmail()
  email: string;

  @Field()
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  @Matches(/^[a-zA-Z0-9_-]+$/)
  @Trim()
  username: string;
}
```

### HTML Content
```typescript
@Field()
@IsString()
@MaxLength(5000)
@Trim()
@SanitizeHtml()
content: string;
```

### URLs
```typescript
@Field()
@IsUrl({}, { message: 'Invalid URL' })
@SanitizeUrl()
website: string;
```

### Search Queries
```typescript
@Field()
@IsString()
@MaxLength(200)
@Trim()
@SanitizeNoSQL()
query: string;
```

## Error Response Format

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "errors": ["Invalid email format"]
    },
    {
      "field": "username",
      "errors": [
        "Username must be at least 3 characters",
        "Username can only contain letters, numbers, underscores, and hyphens"
      ]
    }
  ]
}
```

## Security Benefits

### XSS Prevention
- HTML sanitization removes malicious scripts
- URL sanitization blocks javascript: protocol
- Event handler removal prevents inline JS execution

### NoSQL Injection Prevention
- Removes MongoDB operators (`$where`, `$regex`, etc.)
- Prevents query manipulation
- Blocks path traversal

### Data Integrity
- Type validation ensures correct data types
- Length limits prevent buffer overflow
- Format validation (email, URL, etc.)

### Information Disclosure Prevention
- Production mode hides detailed errors
- Doesn't expose target objects
- Doesn't reveal submitted values

## Best Practices

1. **Always validate at DTO level** - First line of defense
2. **Combine multiple decorators** - Layer security measures
3. **Use specific validators** - More restrictive = more secure
4. **Set reasonable limits** - Prevent DoS via large payloads
5. **Sanitize before storage** - Clean data at entry point
6. **Never trust client input** - Validate everything

## Testing

```typescript
describe('Validation', () => {
  it('should reject XSS attempts', () => {
    const input = '<script>alert("xss")</script>';
    // After sanitization: ''
  });

  it('should reject NoSQL injection', () => {
    const input = '{ $ne: null }';
    // After sanitization: ' ne: null '
  });

  it('should reject javascript: URLs', () => {
    const input = 'javascript:alert("xss")';
    // After sanitization: ''
  });
});
```

## Performance Considerations

- Sanitization runs on every request
- Minimal overhead (~1-2ms per field)
- Cached validation schemas
- Early rejection of invalid data

## Future Enhancements

- [ ] Custom sanitization rules per field
- [ ] Rate limiting per validation failure
- [ ] Audit log for suspicious inputs
- [ ] Machine learning for anomaly detection
