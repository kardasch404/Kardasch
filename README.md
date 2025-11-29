# Kardasch Backend

Enterprise-grade NestJS backend with GraphQL, MongoDB, Redis, and Kubernetes deployment.

## Architecture

```
├── .github/workflows/     # CI/CD pipelines
├── .husky/               # Git hooks
├── docs/                 # Documentation & ADRs
├── devops/              # Docker & Kubernetes configs
├── scripts/             # Utility scripts
├── test/                # Unit, Integration, E2E tests
└── src/
    ├── config/          # Configuration
    ├── core/            # Cross-cutting concerns
    ├── common/          # Reusable components
    └── modules/         # Feature modules
```

## Quick Start

```bash
# Install dependencies
pnpm install

# Setup environment
cp .env.example .env

# Run development
pnpm run start:dev

# Run with Docker
docker-compose -f devops/docker/docker-compose.dev.yml up
```

## Tech Stack

- **Framework**: NestJS + TypeScript
- **API**: GraphQL (Apollo Server)
- **Database**: MongoDB (Mongoose)
- **Cache**: Redis
- **Auth**: JWT + Passport
- **Translation**: DeepL
- **Orchestration**: Kubernetes
- **CI/CD**: GitHub Actions
