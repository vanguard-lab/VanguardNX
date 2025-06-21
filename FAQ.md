# 🤔 VanguardNX FAQ

## Table of Contents

- [Understanding the Project](#understanding-the-project)
  - [What is this project exactly?](#what-is-this-project-exactly)
  - [Do I need to understand CQRS and DDD to use this?](#do-i-need-to-understand-cqrs-and-ddd-to-use-this)
  - [Why are there so many folders just for "users"?](#why-are-there-so-many-folders-just-for-users)
- [Technical Implementation](#technical-implementation)
  - [Why do I have to register my command/query handlers manually?](#why-do-i-have-to-register-my-commandquery-handlers-manually)
  - [Why does my DTO mapping fail silently?](#why-does-my-dto-mapping-fail-silently)
  - [Why is Swagger missing my new endpoint?](#why-is-swagger-missing-my-new-endpoint)
- [Architecture Decisions](#architecture-decisions)
  - [Why isn't this a REST + GraphQL hybrid starter?](#why-isnt-this-a-rest--graphql-hybrid-starter)
  - [Why not just use NestJS with microservices directly?](#why-not-just-use-nestjs-with-microservices-directly)
  - [Can I remove or simplify the CQRS structure?](#can-i-remove-or-simplify-the-cqrs-structure)
- [Deployment & Scaling](#deployment--scaling)
  - [Can I run all services in a single process?](#can-i-run-all-services-in-a-single-process)
  - [Can I build event-driven communication later (Kafka, RabbitMQ)?](#can-i-build-event-driven-communication-later-kafka-rabbitmq)
- [Tooling Choices](#tooling-choices)
  - [Why is Nx used instead of Lerna or turborepo?](#why-is-nx-used-instead-of-lerna-or-turborepo)
- [When NOT to Use This](#when-not-to-use-this)
  - [What if I just want a basic NestJS app?](#what-if-i-just-want-a-basic-nestjs-app)
- [Development & Debugging](#development--debugging)
  - [How do I debug handler logic?](#how-do-i-debug-handler-logic)
- [Code Organization](#code-organization)
  - [Why are there so many index.ts files?](#why-are-there-so-many-indexts-files)
  - [What's the difference between users-ms and shared-core-lib?](#whats-the-difference-between-users-ms-and-shared-core-lib)
  - [Is this a good fit for a monolith?](#is-this-a-good-fit-for-a-monolith)
- [Long-term Vision](#long-term-vision)
  - [Can I build an entire platform with this?](#can-i-build-an-entire-platform-with-this)

---

## Understanding the Project

### What is this project exactly?

It's a boilerplate, not a product. VanguardNX gives you a head start building your own distributed backend. It's not a CMS, API-as-a-service, or hosted tool. Think of it as a blueprint: you clone it, extend it, and ship your own features using its patterns.

### Do I need to understand CQRS and DDD to use this?

Yes. You don't need to be an expert, but basic familiarity helps. If you don't know the difference between a command and a query, take a moment to read up before diving in.

### Why are there so many folders just for "users"?

This follows strict vertical slice architecture. Each feature (like "users") is treated as an isolated app-in-miniature. This helps scalability. The folders (commands, queries, models, domain) enforce DDD and CQRS boundaries.

## Technical Implementation

### Why do I have to register my command/query handlers manually?

VanguardNX uses strict CQRS (via custom decorators) to avoid runtime surprises. That means no magical discovery like the default NestJS CQRS module. You get static safety, at the cost of some extra boilerplate.

### Why does my DTO mapping fail silently?

You likely didn't add the Automapper profile or forgot to register it in the module. Check that your mapper.createMap() calls are correct and that @AutoMap() decorators exist on your DTO and entity.

### Why is Swagger missing my new endpoint?

You probably forgot to add @ApiTags(), @ApiResponse(), or use validated DTOs. Nest + Swagger needs explicit decorators to generate docs. Also check your route uses the correct controller version prefix (@Controller({ version: '1' })).

## Architecture Decisions

### Why isn't this a REST + GraphQL hybrid starter?

This boilerplate focuses on RESTful APIs with strict CQRS separation. GraphQL support is possible, but it's not included out of the box to keep the architecture minimal and focused.

### Why not just use NestJS with microservices directly?

You can, but this repo brings opinionated patterns (CQRS, vertical slice, Nx workspace, Automapper, strict types, versioned Swagger, shared tooling) into a coherent starting point. It saves weeks of setup and enforces scale-ready conventions.

### Can I remove or simplify the CQRS structure?

Technically yes but it's not recommended. This project is for teams that need discipline, traceability, and clear boundaries. If you want faster iteration without CQRS, this starter might be overkill.

## Deployment & Scaling

### Can I run all services in a single process?

This monorepo supports modular services but does not enforce isolated deployments. You can run all services together in one Docker Compose setup or split them later as real microservices.

### Can I build event-driven communication later (Kafka, RabbitMQ)?

Yes. CQRS prepares your app for async message-driven behavior. You can add EventBus or message brokers when needed without reworking the entire architecture.

## Tooling Choices

### Why is Nx used instead of Lerna or turborepo?

Nx offers better NestJS integration, dependency graph tooling, task caching, and consistent DX across backend projects. It scales better with multiple apps/libs and has first-class TypeScript support.

## When NOT to Use This

### What if I just want a basic NestJS app?

Use `nest new` instead. VanguardNX is for production-grade setups with separation of concerns baked in. If you don't want CQRS, shared libs, or structured domain modeling, this may be too much.

## Code Organization

### Why are there so many index.ts files?

Barrel exports. They simplify imports (`import { X } from './features/users'`) and avoid deep nested paths. This also helps with circular dependency management.

### What's the difference between users-ms and shared-core-lib?

`users-ms` is a feature-specific app. `shared-core-lib` is a generic toolbox used across apps. Think of `shared-core-lib` as your internal backend SDK.

### Is this a good fit for a monolith?

Yes. Though designed for microservices, the architecture supports monolithic deployment. Each feature is modular, so scaling later into separate services is straightforward.

## Long-term Vision

### Can I build an entire platform with this?

Yes. This structure supports adding dozens of features (auth, billing, notifications, etc.) as isolated slices. Every new module follows the same features/<n>/ pattern, staying consistent.
