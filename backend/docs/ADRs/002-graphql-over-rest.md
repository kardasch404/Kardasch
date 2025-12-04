# ADR 002: GraphQL over REST

## Status
Accepted

## Context
Need to choose API architecture for frontend-backend communication.

## Decision
Use GraphQL instead of REST for the following reasons:
- Single endpoint reduces network overhead
- Client-driven data fetching prevents over/under-fetching
- Strong typing with schema
- Real-time subscriptions support

## Consequences
- Requires GraphQL expertise
- More complex caching strategy
- Better developer experience
