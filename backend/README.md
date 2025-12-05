# Kardasch Backend

Enterprise-grade NestJS backend with GraphQL, MongoDB, Redis, and Elasticsearch.

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Setup environment
cp .env.example .env

# Start development server
pnpm run start:dev

# Run with Docker
docker-compose -f ../devops/docker/docker-compose.dev.yml up
```

## 📚 Documentation

- **[Complete Implementation Guide](../docs/IMPLEMENTATION_GUIDE.md)** - Full A-Z documentation
- **[Architecture Overview](../docs/architecture/overview.md)** - System design
- **[API Documentation](#api-documentation)** - GraphQL queries & mutations

## 🛠️ Tech Stack

### Core
- **NestJS** 11.x - Progressive Node.js framework
- **TypeScript** 5.7.x - Type-safe development
- **GraphQL** - API with Apollo Server

### Databases
- **MongoDB** 9.x - Primary database (Mongoose)
- **Redis** 7.x - Caching & sessions
- **Elasticsearch** 8.x - Full-text search

### Security
- **JWT** + **Passport** - Authentication
- **Argon2id** - Password hashing
- **reCAPTCHA v3** - Bot detection
- **Multi-tier Rate Limiting** - DDoS protection
- **Input Sanitization** - XSS/Injection prevention

## ✅ Implemented Features

### Authentication & Authorization
- ✅ User registration with strong password validation
- ✅ Login with JWT tokens
- ✅ Refresh token rotation
- ✅ Password strength checking
- ✅ Compromised password detection (HIBP)
- ✅ Device fingerprinting
- ✅ Token blacklisting

### Security Features
- ✅ **Multi-Tier Rate Limiting**
  - Anonymous: 10 req/min
  - Authenticated: 100 req/min
  - Admin: 1000 req/min
  - GraphQL cost calculation

- ✅ **CAPTCHA & Bot Detection**
  - reCAPTCHA v3 integration
  - User-Agent analysis
  - Honeypot fields
  - Fingerprint tracking
  - Adaptive CAPTCHA (score-based)

- ✅ **Brute Force Prevention**
  - Exponential backoff (2^n seconds)
  - Account lockout (5 attempts → 30 min)
  - IP banning (10 attempts → 24 hours)

- ✅ **Input Validation & Sanitization**
  - XSS prevention
  - NoSQL injection prevention
  - URL sanitization
  - Comprehensive DTO validation

- ✅ **Audit Logging**
  - Immutable audit trail
  - PII masking
  - All auth/CRUD events logged
  - Compliance-ready (GDPR, HIPAA)

### Core Features
- ✅ User management with RBAC
- ✅ Profile management (multi-language)
- ✅ Project management with Elasticsearch
- ✅ Full-text search with fuzzy matching
- ✅ Redis caching
- ✅ Health checks
- ✅ Structured logging

## 📖 API Documentation

### GraphQL Endpoint
```
http://localhost:3000/graphql
```

### Authentication

#### Register
```graphql
mutation Register {
  register(input: {
    email: "user@example.com"
    username: "johndoe"
    password: "SecurePass123!"
    firstName: "John"
    lastName: "Doe"
  }) {
    accessToken
    user {
      id
      username
      email
      role
    }
  }
}
```

#### Login
```graphql
mutation Login {
  login(input: {
    identifier: "user@example.com"
    password: "SecurePass123!"
  }) {
    accessToken
    user {
      id
      username
      email
      role
    }
  }
}
```

#### Logout
```graphql
mutation Logout {
  logout
}
```

### Profile Management

#### Get Profile
```graphql
query GetProfile {
  profile(userId: "123") {
    id
    translations {
      en {
        title
        description
      }
      ar {
        title
        description
      }
    }
    socialLinks {
      github
      linkedin
      twitter
    }
    avatar
  }
}
```

#### Update Profile
```graphql
mutation UpdateProfile {
  updateProfile(input: {
    translations: {
      en: {
        title: "Full Stack Developer"
        description: "Building scalable systems"
      }
    }
    socialLinks: {
      github: "https://github.com/username"
      linkedin: "https://linkedin.com/in/username"
    }
  }) {
    id
    updatedAt
  }
}
```

### Project Search

```graphql
query SearchProjects {
  searchProjects(input: {
    query: "react typescript"
    status: [ACTIVE]
    skills: ["React", "TypeScript"]
    featured: true
    limit: 20
  }) {
    items {
      id
      title
      description
      skills
      status
      featured
      viewCount
      demoUrl
      repoUrl
      createdAt
    }
    total
    hasMore
    cursor
  }
}
```

## 🔧 Configuration

### Environment Variables

```env
# Application
NODE_ENV=development
PORT=3000

# MongoDB
MONGODB_URI=mongodb://localhost:27017/kardasch

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Elasticsearch
ELASTICSEARCH_NODE=http://localhost:9200
ELASTICSEARCH_USERNAME=elastic
ELASTICSEARCH_PASSWORD=changeme

# JWT
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=15m

# reCAPTCHA
RECAPTCHA_SECRET_KEY=your-recaptcha-secret-key
RECAPTCHA_SITE_KEY=your-recaptcha-site-key

# DeepL
DEEPL_API_KEY=your-deepl-api-key

# Security
CORS_ORIGIN=http://localhost:3000
RATE_LIMIT_TTL=60
RATE_LIMIT_MAX=100
```

## 🧪 Testing

```bash
# Unit tests
pnpm run test

# E2E tests
pnpm run test:e2e

# Test coverage
pnpm run test:cov

# Watch mode
pnpm run test:watch
```

## 📦 Scripts

```bash
# Development
pnpm run start:dev          # Start with watch mode
pnpm run start:debug        # Start with debugger

# Building
pnpm run build              # Build for production

# Code Quality
pnpm run lint               # Lint code
pnpm run format             # Format code

# Production
pnpm run start:prod         # Start production server
```

## 🏗️ Project Structure

```
src/
├── common/              # Shared utilities
│   ├── decorators/      # @SanitizeHtml, @Trim, etc.
│   ├── guards/          # RateLimitGuard, CaptchaGuard
│   ├── pipes/           # ValidationPipe
│   └── interceptors/    # LoggingInterceptor
├── config/              # Configuration files
│   ├── app.config.ts
│   ├── database.config.ts
│   ├── rate-limit.config.ts
│   └── security.config.ts
├── core/                # Core infrastructure
│   ├── cache/           # Redis cache
│   ├── database/        # MongoDB connection
│   ├── graphql/         # GraphQL setup
│   ├── health/          # Health checks
│   └── observability/   # Logging & audit
├── modules/             # Feature modules
│   ├── auth/            # Authentication
│   ├── user/            # User management
│   ├── profile/         # User profiles
│   ├── project/         # Projects
│   ├── security/        # Security services
│   └── logging/         # Audit logging
└── main.ts              # Application entry
```

## 🔒 Security Features

### Rate Limiting
- **Anonymous**: 10 requests/minute
- **Authenticated**: 100 requests/minute
- **Admin**: 1000 requests/minute
- GraphQL query cost calculation
- Redis-based distributed limiting

### Bot Detection
- User-Agent analysis (score: 0-40)
- Header validation (score: 0-35)
- Honeypot fields (score: 100)
- Request frequency (score: 0-30)
- Fingerprint consistency (score: 0-25)
- **Bot threshold**: ≥50 points

### Brute Force Protection
- **Progressive delays**: 2^n seconds
- **Account lockout**: 5 attempts → 30 minutes
- **IP banning**: 10 attempts → 24 hours
- Automatic reset on successful login

### Input Sanitization
- XSS prevention (HTML tag removal)
- NoSQL injection prevention (operator removal)
- URL protocol validation
- Email normalization
- Comprehensive DTO validation

### Audit Logging
- Immutable audit trail in MongoDB
- PII masking (passwords, tokens, emails, IPs)
- All authentication events logged
- All CRUD operations logged
- Security events tracked
- Compliance-ready (GDPR, HIPAA, SOC 2)

## 📊 Performance

- **API Response**: <100ms (p95)
- **Database Queries**: <50ms (p95)
- **Cache Hit Rate**: >80%
- **Uptime Target**: 99.9%

## 🚢 Deployment

### Docker
```bash
# Build image
docker build -f ../devops/docker/Dockerfile.prod -t kardasch-backend .

# Run with docker-compose
docker-compose -f ../devops/docker/docker-compose.dev.yml up
```

### Kubernetes
```bash
# Apply configurations
kubectl apply -k ../devops/kubernetes/overlays/production/

# Check status
kubectl get pods -n production
```

## 📝 License

UNLICENSED - Private Project

## 🔗 Links

- [GitHub Repository](https://github.com/kardasch404/Kardasch)
- [Complete Documentation](../docs/IMPLEMENTATION_GUIDE.md)
- [Architecture Decisions](../docs/ADRs/)

---

**Version**: 0.2.0  
**Status**: Active Development  
**Last Updated**: January 2024
