# Architecture Overview

## System Components
- **API Layer**: GraphQL with Apollo Server
- **Authentication**: JWT with Passport
- **Database**: MongoDB with Mongoose
- **Cache**: Redis with Cache Manager
- **Translation**: DeepL API
- **Search**: Elasticsearch (planned)

## Data Flow
1. Client → GraphQL API
2. Guards → Authentication/Authorization
3. Services → Business Logic
4. Repositories → Database
5. Cache Layer → Performance Optimization
