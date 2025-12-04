# Kardasch Backend - Complete Implementation Guide

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Technology Stack](#technology-stack)
4. [Implemented Features](#implemented-features)
5. [Module Documentation](#module-documentation)
6. [Security Features](#security-features)
7. [DevOps & Infrastructure](#devops--infrastructure)
8. [API Documentation](#api-documentation)
9. [Development Workflow](#development-workflow)
10. [Future Roadmap](#future-roadmap)

---

## 🎯 Project Overview

**Kardasch Backend** is an enterprise-grade NestJS backend system designed for a personal portfolio platform with advanced features including:
- Multi-language support (AR, EN, FR, DE, JA)
- Real-time analytics
- AI-powered documentation
- Live streaming capabilities
- Comprehensive security measures

### Project Status
- **Version**: 0.2.0 (Core Features Phase)
- **Branch**: `feature/v0.2-core-features`
- **Completion**: ~40% (Foundation + Security Complete)

---

## 🏗️ Architecture

### High-Level Architecture
```
┌─────────────────────────────────────────────────────────┐
│                    Client Layer                          │
│              (GraphQL API Consumers)                     │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                   API Gateway Layer                      │
│         (Apollo Server + GraphQL Schema)                 │
│  - Rate Limiting  - CAPTCHA  - Input Validation         │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                  Application Layer                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │   Auth   │  │ Profile  │  │ Project  │             │
│  │  Module  │  │  Module  │  │  Module  │             │
│  └──────────┘  └──────────┘  └──────────┘             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │   User   │  │ Security │  │ Logging  │             │
│  │  Module  │  │  Module  │  │  Module  │             │
│  └──────────┘  └──────────┘  └──────────┘             │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                Infrastructure Layer                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │ MongoDB  │  │  Redis   │  │Elasticsearch│           │
│  └──────────┘  └──────────┘  └──────────┘             │
└─────────────────────────────────────────────────────────┘
```

### Directory Structure
```
backend/
├── src/
│   ├── common/              # Shared utilities
│   │   ├── decorators/      # Custom decorators
│   │   ├── guards/          # Auth & security guards
│   │   ├── pipes/           # Validation pipes
│   │   └── interceptors/    # Request/response interceptors
│   ├── config/              # Configuration files
│   ├── core/                # Core infrastructure
│   │   ├── cache/           # Redis cache
│   │   ├── database/        # MongoDB connection
│   │   ├── graphql/         # GraphQL setup
│   │   ├── health/          # Health checks
│   │   └── observability/   # Logging & metrics
│   ├── modules/             # Feature modules
│   │   ├── auth/            # Authentication
│   │   ├── user/            # User management
│   │   ├── profile/         # User profiles
│   │   ├── project/         # Projects with search
│   │   ├── security/        # Security services
│   │   └── logging/         # Audit logging
│   └── main.ts              # Application entry
├── test/                    # Tests
├── scripts/                 # Utility scripts
└── devops/                  # Deployment configs
```

---

## 🛠️ Technology Stack

### Core Framework
- **NestJS** 11.x - Progressive Node.js framework
- **TypeScript** 5.7.x - Type-safe development
- **Node.js** 20.x - Runtime environment

### API Layer
- **GraphQL** - API query language
- **Apollo Server** 5.x - GraphQL server
- **Code-First Approach** - Schema generation from TypeScript

### Databases & Storage
- **MongoDB** 9.x - Primary database (Mongoose ODM)
- **Redis** 7.x - Caching & session storage
- **Elasticsearch** 8.x - Full-text search engine

### Authentication & Security
- **Passport.js** - Authentication middleware
- **JWT** - Token-based authentication
- **Argon2id** - Password hashing
- **reCAPTCHA v3** - Bot detection
- **Helmet** - Security headers
- **express-mongo-sanitize** - NoSQL injection prevention
- **HPP** - HTTP parameter pollution prevention

### Observability
- **Winston** - Structured logging
- **Custom Metrics** - Performance tracking
- **Audit Logging** - Immutable audit trail

### Translation
- **DeepL API** - Professional translation service

### DevOps
- **Docker** - Containerization
- **Kubernetes** - Orchestration
- **GitHub Actions** - CI/CD
- **Terraform** - Infrastructure as Code

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Husky** - Git hooks
- **Jest** - Testing framework
- **pnpm** - Package manager

---

## ✅ Implemented Features

### Phase 1: Foundation (Complete ✓)
- [x] Project setup with NestJS
- [x] MongoDB connection with Mongoose
- [x] Redis caching layer
- [x] GraphQL API with Apollo Server
- [x] Winston logging with daily rotation
- [x] Health check endpoints
- [x] Security middleware (Helmet, CORS, HPP)
- [x] Environment configuration
- [x] Docker & Kubernetes setup
- [x] CI/CD pipelines

### Phase 2: Core Features & Security (Complete ✓)

#### Authentication & Authorization
- [x] User registration with validation
- [x] Login with JWT tokens
- [x] Refresh token rotation
- [x] Password hashing with Argon2id
- [x] Password strength validation
- [x] Compromised password detection (HIBP)
- [x] JWT strategy with Passport
- [x] Token blacklisting
- [x] Device fingerprinting

#### User Management
- [x] User CRUD operations
- [x] User repository pattern
- [x] Role-based access control (USER, ADMIN)
- [x] Last login tracking
- [x] Account status management

#### Profile Management
- [x] Multi-language profile support (AR, EN, FR, DE, JA)
- [x] Social links management
- [x] Avatar & resume upload
- [x] Translation management
- [x] Profile repository pattern

#### Project Management
- [x] Project CRUD operations
- [x] Multi-language project content
- [x] Elasticsearch integration
- [x] Full-text search with fuzzy matching
- [x] Project filtering (status, skills, featured)
- [x] Cursor-based pagination
- [x] View count tracking
- [x] Redis caching for project lists

#### Security Features
- [x] **Multi-Tier Rate Limiting**
  - Anonymous: 10 req/min
  - Authenticated: 100 req/min
  - Admin: 1000 req/min
  - GraphQL cost calculation
  - Redis-based distributed limiting

- [x] **CAPTCHA & Bot Detection**
  - reCAPTCHA v3 integration
  - User-Agent analysis
  - Header validation
  - Honeypot fields
  - Request frequency tracking
  - Fingerprint consistency checks
  - Adaptive CAPTCHA (score-based)

- [x] **Brute Force Prevention**
  - Progressive delays (exponential backoff: 2^n seconds)
  - Account lockout (5 attempts → 30 min lock)
  - IP banning (10 attempts → 24 hour ban)
  - Automatic reset on success

- [x] **Input Validation & Sanitization**
  - Global validation pipe
  - XSS prevention (HTML sanitization)
  - NoSQL injection prevention
  - URL sanitization
  - Email normalization
  - Comprehensive DTO validation

- [x] **Audit Logging**
  - Immutable audit trail in MongoDB
  - PII masking (passwords, tokens, emails, IPs)
  - Authentication event logging
  - Data access logging (CRUD)
  - Security event logging
  - Structured logging with severity levels

### Phase 3-5: Advanced Features (Planned 📋)
- [ ] Skill management
- [ ] Experience tracking
- [ ] Blog with MDX support
- [ ] Achievement system
- [ ] Gallery management
- [ ] Analytics & visitor tracking
- [ ] AI-powered documentation
- [ ] Live streaming sessions
- [ ] Chess game integration

---

## 📚 Module Documentation

### 1. Auth Module
**Location**: `src/modules/auth/`

**Services**:
- `AuthService` - Main authentication logic
- `PasswordService` - Password hashing & validation
- `TokenService` - JWT generation & management
- `CaptchaService` - reCAPTCHA v3 verification
- `BruteForceService` - Attack prevention

**Features**:
- User registration with strong password requirements
- Login with brute force protection
- Refresh token rotation
- Token blacklisting
- Device fingerprinting
- CAPTCHA verification

**GraphQL Mutations**:
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
    user { id username email }
  }
}

mutation Login {
  login(input: {
    identifier: "user@example.com"
    password: "SecurePass123!"
  }) {
    accessToken
    user { id username email }
  }
}
```

**Documentation**:
- [Token Security](../backend/src/modules/auth/TOKEN_SECURITY.md)
- [Brute Force Prevention](../backend/src/modules/auth/BRUTE_FORCE_PREVENTION.md)

---

### 2. User Module
**Location**: `src/modules/user/`

**Entity**: User
- Fields: username, email, password, role, lastLogin
- Indexes: email (unique), username (unique)
- Methods: isActive(), hasRole()

**Repository Pattern**:
- Interface-based repository
- CRUD operations
- Query methods (findByEmail, findByUsername)

---

### 3. Profile Module
**Location**: `src/modules/profile/`

**Entity**: Profile
- Multi-language translations (AR, EN, FR, DE, JA)
- Social links (GitHub, LinkedIn, Twitter, etc.)
- Avatar & resume URLs
- Contact information

**Features**:
- Translation management per locale
- Social media integration
- Profile updates with validation

---

### 4. Project Module
**Location**: `src/modules/project/`

**Entity**: Project
- Multi-language content
- Skills array
- Status (DRAFT, ACTIVE, COMPLETED, ARCHIVED)
- Featured flag
- View count tracking
- URLs (demo, repository, images)

**Features**:
- **Elasticsearch Integration**:
  - Full-text search across title & description
  - Multi-language search
  - Fuzzy matching
  - Filter by status, skills, featured
  
- **Redis Caching**:
  - 5-minute TTL for project lists
  - Individual project caching
  - Cache invalidation on updates

- **Cursor Pagination**:
  - Efficient large dataset handling
  - Base64-encoded cursors

**GraphQL Queries**:
```graphql
query SearchProjects {
  searchProjects(input: {
    query: "react"
    status: [ACTIVE]
    featured: true
    limit: 20
  }) {
    items {
      id
      title
      description
      skills
      viewCount
    }
    total
    hasMore
    cursor
  }
}
```

---

### 5. Security Module
**Location**: `src/modules/security/`

**Services**:
- `BotDetectionService` - Multi-factor bot detection
  - User-Agent analysis (score: 0-40)
  - Header validation (score: 0-35)
  - Honeypot fields (score: 100)
  - Request frequency (score: 0-30)
  - Fingerprint consistency (score: 0-25)
  - Bot threshold: ≥50 points

**Documentation**:
- [CAPTCHA & Bot Detection](../backend/src/modules/security/CAPTCHA_BOT_DETECTION.md)

---

### 6. Logging Module
**Location**: `src/modules/logging/`

**Entity**: AuditLog (Immutable)
- Action types (LOGIN, LOGOUT, CREATE, UPDATE, DELETE, etc.)
- Severity levels (INFO, WARNING, ERROR, CRITICAL)
- User context (userId, username)
- Network info (IP, user agent)
- Resource tracking
- Metadata with PII masking

**Features**:
- Immutable audit trail
- Automatic PII masking
- IP address anonymization
- Indexed for fast queries
- Compliance-ready (GDPR, HIPAA, SOC 2, PCI DSS)

**Documentation**:
- [Audit Logging](../backend/src/core/observability/AUDIT_LOGGING.md)

---

### 7. Core Modules

#### Cache Module
- Redis integration with IORedis
- Connection pooling
- Health checks
- Automatic reconnection

#### Database Module
- MongoDB connection with Mongoose
- Connection pooling
- Health monitoring
- Graceful shutdown

#### GraphQL Module
- Apollo Server setup
- Code-first schema generation
- Custom scalars (Date, JSON)
- Error formatting
- Playground (dev only)

#### Health Module
- `/health` endpoint
- Database connectivity check
- Redis connectivity check
- Terminus integration

#### Observability Module
- Winston logger with daily rotation
- Structured logging
- Metrics collection
- Audit logger service

---

## 🔒 Security Features

### 1. Authentication Security
- **Password Requirements**:
  - Minimum 8 characters
  - Strength validation (score ≥60)
  - Compromised password detection via HIBP API
  - Argon2id hashing (memory-hard, GPU-resistant)

- **Token Security**:
  - Short-lived access tokens (15 minutes)
  - Long-lived refresh tokens (7 days)
  - Token rotation on refresh
  - Device fingerprinting
  - Token blacklisting
  - HttpOnly cookies for refresh tokens

### 2. Rate Limiting
- **Multi-Tier System**:
  - Anonymous: 10 requests/minute
  - Authenticated: 100 requests/minute
  - Admin: 1000 requests/minute

- **GraphQL Cost Calculation**:
  - Base cost per query
  - Selection depth cost
  - Argument cost
  - 2x multiplier for search operations

- **Implementation**:
  - Redis-based distributed limiting
  - 60-second sliding window
  - Per-user and per-IP tracking

**Documentation**: [Rate Limiting](../backend/src/common/guards/RATE_LIMITING.md)

### 3. Bot Detection & CAPTCHA
- **Detection Methods**:
  - User-Agent analysis
  - Missing browser headers
  - Honeypot fields
  - Request frequency anomalies
  - Fingerprint inconsistencies

- **Adaptive CAPTCHA**:
  - reCAPTCHA v3 (score-based)
  - 0.5 threshold
  - Only required when bot detected
  - Action verification

### 4. Brute Force Prevention
- **Progressive Delays**:
  - Exponential backoff (2^n seconds)
  - 1st attempt: 2s, 2nd: 4s, 3rd: 8s, 4th: 16s

- **Account Protection**:
  - 5 failed attempts → 30-minute lock
  - Automatic unlock after duration

- **IP Protection**:
  - 10 failed attempts → 24-hour ban
  - Distributed attack prevention

### 5. Input Validation & Sanitization
- **XSS Prevention**:
  - HTML tag removal
  - Script tag blocking
  - Event handler stripping
  - JavaScript protocol blocking

- **NoSQL Injection Prevention**:
  - MongoDB operator removal ($, {})
  - Path traversal blocking (..)
  - Query sanitization

- **Validation**:
  - DTO-level validation
  - Type checking
  - Length limits
  - Format validation (email, URL, etc.)
  - Whitelist-only properties

**Documentation**: [Input Validation](../backend/src/common/decorators/INPUT_VALIDATION.md)

### 6. Audit Logging
- **Event Tracking**:
  - All authentication events
  - Data modifications (CRUD)
  - Security violations
  - Failed attempts

- **PII Protection**:
  - Password redaction
  - Token masking
  - Email partial masking (jo***@example.com)
  - IP anonymization (192.168.1.***)

- **Compliance**:
  - Immutable logs
  - Indexed for queries
  - Retention policies
  - GDPR/HIPAA ready

---

## 🚀 DevOps & Infrastructure

### Docker Setup
**Files**:
- `devops/docker/Dockerfile.prod` - Production image
- `devops/docker/docker-compose.dev.yml` - Development stack
- `devops/docker/docker-compose.test.yml` - Testing stack

**Services**:
- App (NestJS)
- MongoDB 7
- Redis 7
- Elasticsearch 8 (planned)

### Kubernetes Deployment
**Structure**:
```
devops/kubernetes/
├── base/                    # Base configurations
├── overlays/
│   └── production/          # Production overrides
├── deployment.yaml          # App deployment
├── service.yaml            # Service definition
├── ingress.yaml            # Ingress rules
├── configmap.yaml          # Configuration
└── secret.yaml             # Secrets
```

**Features**:
- 3 replicas in production
- Rolling updates
- Health checks
- Resource limits
- ConfigMap for environment
- Secrets management

### CI/CD Pipeline
**GitHub Actions**:
- `.github/workflows/ci.yml` - Continuous Integration
  - Linting
  - Type checking
  - Unit tests
  - Build verification

- `.github/workflows/cd.yml` - Continuous Deployment
  - Docker image build
  - Push to registry
  - Kubernetes deployment

### Git Hooks (Husky)
- `pre-commit` - Lint & format
- `commit-msg` - Conventional commits
- `pre-push` - Run tests

---

## 📖 API Documentation

### GraphQL Endpoint
- **URL**: `http://localhost:3000/graphql`
- **Playground**: Available in development mode

### Authentication Flow
```graphql
# 1. Register
mutation {
  register(input: {
    email: "user@example.com"
    username: "johndoe"
    password: "SecurePass123!"
  }) {
    accessToken
    user { id username email }
  }
}

# 2. Login
mutation {
  login(input: {
    identifier: "user@example.com"
    password: "SecurePass123!"
  }) {
    accessToken
    user { id username email role }
  }
}

# 3. Use token in headers
# Authorization: Bearer <accessToken>

# 4. Logout
mutation {
  logout
}
```

### Profile Management
```graphql
# Get profile
query {
  profile(userId: "123") {
    translations {
      en { title description }
      ar { title description }
    }
    socialLinks {
      github
      linkedin
    }
  }
}

# Update profile
mutation {
  updateProfile(input: {
    translations: {
      en: {
        title: "Full Stack Developer"
        description: "Passionate about building scalable systems"
      }
    }
    socialLinks: {
      github: "https://github.com/username"
    }
  }) {
    id
    updatedAt
  }
}
```

### Project Search
```graphql
query {
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
    }
    total
    hasMore
    cursor
  }
}
```

---

## 💻 Development Workflow

### Setup
```bash
# Clone repository
git clone https://github.com/kardasch404/Kardasch.git
cd Kardasch/backend

# Install dependencies
pnpm install

# Setup environment
cp .env.example .env
# Edit .env with your configuration

# Start development server
pnpm run start:dev
```

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

### Scripts
```bash
# Development
pnpm run start:dev          # Start with watch mode
pnpm run start:debug        # Start with debugger

# Building
pnpm run build              # Build for production

# Testing
pnpm run test               # Run unit tests
pnpm run test:watch         # Watch mode
pnpm run test:cov           # Coverage report
pnpm run test:e2e           # E2E tests

# Code Quality
pnpm run lint               # Lint code
pnpm run format             # Format code

# Production
pnpm run start:prod         # Start production server
```

### Git Workflow
```bash
# Feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "feat: add new feature"

# Push to remote
git push origin feature/new-feature

# Create pull request on GitHub
```

### Commit Convention
```
feat: New feature
fix: Bug fix
docs: Documentation
style: Formatting
refactor: Code restructuring
test: Adding tests
chore: Maintenance
```

---

## 🗺️ Future Roadmap

### Phase 3: Content Management (Planned)
- [ ] Skill management with proficiency levels
- [ ] Experience timeline
- [ ] Blog system with MDX support
- [ ] Achievement & certification tracking
- [ ] Gallery management (photos, videos)
- [ ] Favorite items categorization

### Phase 4: Analytics & AI (Planned)
- [ ] Real-time visitor analytics
- [ ] Page view tracking
- [ ] Geographic analytics
- [ ] Device analytics
- [ ] AI-powered documentation generation
- [ ] Semantic search with vector embeddings
- [ ] RAG (Retrieval-Augmented Generation)
- [ ] AI chatbot integration

### Phase 5: Live Features (Planned)
- [ ] Live coding sessions
- [ ] Stream recording & playback
- [ ] Chess game integration
- [ ] Real-time viewer count
- [ ] Chat functionality
- [ ] Session scheduling

### Infrastructure Improvements
- [ ] Microservices architecture
- [ ] Event-driven communication
- [ ] GraphQL Federation
- [ ] Distributed tracing
- [ ] Advanced monitoring (Prometheus, Grafana)
- [ ] Log aggregation (ELK Stack)
- [ ] CDN integration
- [ ] Multi-region deployment

### Security Enhancements
- [ ] OAuth2 integration (Google, GitHub)
- [ ] Two-factor authentication (2FA)
- [ ] Biometric authentication
- [ ] Advanced threat detection
- [ ] SIEM integration
- [ ] Automated security scanning
- [ ] Penetration testing automation

---

## 📊 Project Statistics

### Code Metrics
- **Total Files**: ~150+
- **Lines of Code**: ~15,000+
- **Modules**: 7 feature modules
- **Services**: 20+ services
- **Guards**: 5 security guards
- **Decorators**: 10+ custom decorators
- **Tests**: Unit + E2E coverage

### Dependencies
- **Production**: 35 packages
- **Development**: 25 packages
- **Total Size**: ~500MB (with node_modules)

### Performance Targets
- **API Response**: <100ms (p95)
- **Database Queries**: <50ms (p95)
- **Cache Hit Rate**: >80%
- **Uptime**: 99.9%

---

## 📞 Support & Contact

### Documentation
- [Architecture Overview](./architecture/overview.md)
- [ADRs](./ADRs/)
- [Deployment Runbook](./runbooks/deployment.md)

### Repository
- **GitHub**: https://github.com/kardasch404/Kardasch
- **Branch**: `feature/v0.2-core-features`

### Key Decisions
- [ADR-001: GraphQL Federation](./ADRs/001-graphql-federation.md)
- [ADR-002: GraphQL over REST](./ADRs/002-graphql-over-rest.md)
- [ADR-003: MongoDB Choice](./ADRs/003-mongodb-choice.md)

---

## 📝 License

UNLICENSED - Private Project

---

**Last Updated**: January 2024
**Version**: 0.2.0
**Status**: Active Development
