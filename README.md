# VanguardNX — Deterministic Microservice Architecture Boilerplate



**VanguardNX** is a production-grade, CQRS-driven microservice architecture for Node.js and TypeScript. It enforces strict boundaries, explicit flows, and runtime determinism, designed for teams prioritizing scalability, maintainability, and correctness over shortcuts. This is not a generic NestJS starter—it’s a disciplined framework for real-world, distributed systems.




## Table of Contents

- [Project Philosophy](#project-philosophy)
- [Execution Flow](#execution-flow)
- [Layer & Folder Partitioning](#layer--folder-partitioning)
- [Feature Architecture](#feature-architecture)
- [CQRS & Handler System](#cqrs--handler-system)
- [Repository & Infra Boundaries](#repository--infra-boundaries)
- [Configuration Strategy](#configuration-strategy)
- [Shared Layer](#shared-layer)
- [Development Workflow (0-100)](#development-workflow-0-100)
- [Best Practices & Anti-Patterns](#best-practices--anti-patterns)
- [Applicability & Impact](#applicability--impact)
- [References & License](#references--license)



## Project Philosophy

- **No ambient behavior:** All flows are explicit, visible, and opt-in.
- **Domain isolation:** No DTO, command, or infra leaks into domain logic.
- **CQRS as protocol:** Read/write segregation is enforced, not suggested.
- **Traceability:** Every message is UUID-stamped, mediator-controlled, and runtime-bound.
- **Zero shortcuts:** No controller accesses a repo. No handler accepts a raw HTTP payload.

## Execution Flow

```
[HTTP Request] → [Request DTO] → [AutoMapper] → [CqrsMediator] → [Handler] → [Repository Interface] → [Domain Entity] → [AutoMapper] → [Response DTO]
```
- **No controller talks to a repo.**
- **No handler accepts raw HTTP data.**
- **Every state mutation is isolated and traceable.**
 
## Directory Structure

**VanguardNX** follows a modular, feature-oriented architecture aligned with CQRS and DDD principles. Each feature is isolated with its own commands, queries, models, and domain logic. This structure promotes scalability, traceability, and clear separation of concerns.

```
src/
├── app/
│   ├── application/
│   │   ├── application.module.ts                # Root application module
│   │   └── features/
│   │       ├── [feature-name]/                  # Single feature (e.g., users, products)
│   │       │   ├── domain/                      # Pure domain entities and enums
│   │       │   ├── models/                      # HTTP DTOs (Request/Response)
│   │       │   ├── queries/                     # CQRS read operations
│   │       │   │   ├── index.ts                 # Query handler registration
│   │       │   │   └── [query-name]/            # Specific query
│   │       │   │       ├── index.ts             # Barrel export for query
│   │       │   │       ├── [query].query.ts     # Query definition
│   │       │   │       └── [query].handler.ts   # Query handler
│   │       │   ├── commands/                    # CQRS write operations
│   │       │   │   ├── index.ts                 # Command handler registration
│   │       │   │   └── [command-name]/          # Specific command
│   │       │   │       ├── index.ts             # Barrel export for command
│   │       │   │       ├── [command].command.ts # Command definition
│   │       │   │       └── [command].handler.ts # Command handler
│   │       │   ├── exceptions/                  # Feature-specific exceptions
│   │       │   ├── helpers/                     # Feature-specific utilities
│   │       │   │   ├── index.ts                 # Barrel export for helpers
│   │       │   │   └── [feature-name].mapper.ts # Automapper mappings
│   │       │   ├── repositories/                # Repository interfaces
│   │       │   │   ├── index.ts                 # Barrel export for repositories
│   │       │   │   └── i-[repo].ts              # Repository interface
│   │       │   └── [feature-name].controller.ts # Controller implementation
│   │       └── [other-features]/                # Additional features follow same pattern
│   └── configuration/
│       ├── config.factory.ts                    # Factory for dynamic configuration
│       ├── i-api.options.ts                     # Global API options interface
│       ├── i-[app-name].config.ts               # Application-specific config shape
│       └── index.ts                             # Barrel export for configuration
├── infrastructure/                              # DB implementations and external adapters.
│   ├── persistence/
│   │   ├── entities/                            # ORM entities
│   │   ├── mappers/                             # Entity ↔ DTO mapping layers
│   │   ├── migrations/                          # DB migration scripts
│   │   ├── options/                             # Additional DB config
│   │   ├── repositories/                        # ORM repository implementations
│   │   └── type-orm.config.ts                   # ORM config
│   └── infrastructure.module.ts                 # Infrastructure module
└── main.ts                                      # App bootstrap entrypoint
```

### Root-Level Structure

- `src/`: Main source code directory.
- `app/`: Contains the core application logic, including feature modules, global configuration, and application bootstrap.
- `configuration/`: Dynamic and environment-based configuration setup.
- `infrastructure/`: Contains persistence logic, ORM entities, repositories, and data-mapping utilities.
- `main.ts`: Application entry point.

### Feature Modules

Each feature resides under `application/features/[feature-name]/` and follows a consistent internal layout:

- `domain/`: Domain entities and enums. Entities are plain stateless classes.
- `models/`: HTTP DTOs, split into request and response files. Also includes minimal or summary DTOs if needed.
- `commands/`: CQRS command definitions and handlers. Used for write operations.
- `queries/`: Similar as commands but for read operations.
- `exceptions/`: Feature-specific exception types.
- `helpers/`: Utility functions and AutoMapper profiles.
- `repositories/`: Interface definitions for persistence abstraction.
- `[feature-name].controller.ts`: Feature-specific controller for handling HTTP routes.

### Application Module

- `application.module.ts`: Central module that aggregates and registers all feature modules and global providers.
- `constants.ts`: Defines application-wide constants such as error codes and API versions.

### Configuration

- `config.factory.ts`: Factory for generating dynamic configuration objects.
- `i-api.options.ts`: Interface defining global API configuration.
- `i-[app-name].config.ts`: Interface for application-specific configuration values.

### Infrastructure

- `persistence/`: Contains all persistence-related logic including:
  - `entities/`: ORM-compatible entity classes.
  - `mappers/`: Functions/classes to map between entity and DTO.
  - `migrations/`: Migration scripts.
  - `options/`: Custom TypeORM configurations.
  - `repositories/`: Implementations of feature-level repository interfaces.
- `infrastructure.module.ts`: Registers infrastructure services and repositories.

### Design Principles

- **Barrel Files**: All directories contain `index.ts` files to provide clean, centralized exports.
- **CQRS**: Queries and commands are strictly separated, ensuring single-responsibility handlers.
- **DDD Alignment**: Domain logic is encapsulated away from transport and persistence concerns.
- **Feature Isolation**: Each feature is self-contained and can be scaled or modified independently.

### **Layer Roles**

- **Model DTO Layer:** Only for HTTP input/output. Decorated, validated, never reused internally.
- **Command/Query Layer:** Internal-only, typed contracts for CQRS handlers.
- **Domain Layer:** Pure business rules and models. NO framework or external annotations.
- **Handler Layer:** Coordinates logic, side-effects. One per message.
- **Repo Layer:** Infrastructure contract. Returns domain objects only.



## Feature Architecture

Each feature is a strict vertical slice.

- **commands/** — `*Command` & `*CommandHandler` (write operations)
- **queries/** — `*Query` & `*QueryHandler` (read operations)
- **domain/** — Pure business entities and enums
- **models/** — Swagger-annotated, validated DTOs (controllers only)
- **repositories/** — Interfaces only (infra implements)
- **exceptions/**, **helpers/** — Stateless, feature-specific logic

**Dependencies:**  
- Each folder can only depend "down" the stack (e.g. controller -> commands -> domain, never the reverse).
- No imports from infra/config into application logic.



## CQRS & Handler System

**VanguardNX** uses a strict, reflection-free implementation of the Command Query Responsibility Segregation (CQRS) pattern. This system ensures that read and write operations are fully decoupled, traceable, and maintainable across distributed features.

### Purpose

Unlike typical CQRS setups that rely on decorators and runtime metadata discovery (common in NestJS), this implementation avoids runtime reflection in favor of static, explicit registration. This enhances determinism, debugging clarity, and testability—key requirements for production-grade systems with strict audit and trace constraints.
### Why Custom CQRS?

- **No magic decorators.** No reflection-based handler discovery.
- **Explicit message-handler binding:** Every command/query is mapped to its handler with metadata.
- **Guaranteed traceability:** Every message has a UUID and is runtime-bound.
* **Scalable composition:** New commands/queries can be added without side effects or hidden coupling.
### Core Components

- **CqrsMediator:** Central dispatcher, validates messages, executes handlers.
- **CommandHandlerStrict / QueryHandlerStrict:** Bind handlers by metadata, not reflection.
- **Handler Registration:**  
  All handlers are registered in feature/index files — _never ad-hoc_.


### Benefits

* Full control over routing and resolution.
* Static discoverability of all message-handler links.
* Eliminates surprises during runtime debugging or failure analysis.

This CQRS implementation sacrifices convenience for control. It ensures all command and query logic is explicit, composable, and statically analyzable—critical for high-reliability systems.


## Repository & Infra Boundaries

- **Repos are interfaces** implemented in infra only.
- **Handlers access interfaces, not implementations.**
- **Repos return domain objects only.**
- **No DTOs, no external types, no cross-contamination.**



## Configuration Strategy

- **No direct ConfigService in application code.** Only in module/infra.
- **Environment access isolated to `config.factory.ts`**.
- **Options are passed via module boundaries, never ambient.**

```typescript
// configuration/config.factory.ts
export const configFactory = (): IUsersMsConfig => ({
  api: { ... },
  database: { ... },
  logger,
  sentry,
});
```



## Shared Layer

- **application/shared/** mirrors feature substructure: `commands`, `queries`, `domain`, etc.
- **No external imports from infra/config.**
- **Pure, reusable logic only.**
 
## Best Practices & Anti-Patterns

### Best Practices

- **Keep features cohesive:** Each is a bounded domain.
- **Never skip barrel files:** Only import via `index.ts`.
- **Register everything centrally:** Handlers, controllers, profiles.
- **No domain leakage:** DTOs never reused internally, domain never reused externally.
- **Strict dependency rules:** No up-stack or cross-layer imports.

### Anti-Patterns

- **Scattered registration:** All is central, never hidden.
- **Feature leakage:** No cross-feature dependencies.
- **Circular dependencies:** Structure enforces separation.
- **Missing exports:** All public code is exported via barrels.



## Applicability & Impact

**Use VanguardNX if…**

- You need deterministic, traceable CQRS enforcement (no runtime surprises).
- You’re building real, horizontally partitioned microservices—not glorified monoliths.
- You care about runtime and compile-time boundary enforcement.
- You want to scale teams _without_ scaling technical debt.
- You reject magic decorators, reflection, and accidental complexity.

**Don’t use if…**

- You want NestJS plugin magic or runtime decorator discovery.
- You prefer DX shortcuts over runtime determinism.
- You want to mutate state inside controllers or route handlers.



## What Makes VanguardNX Different?

- **No hidden flows:** Every action is deliberate and inspectable.
- **Enforced boundaries:** Compile- and runtime; not just “by convention”.
- **Custom CQRS:** No silent handler binding, no reflection, no lost messages.
- **Team-scale ready:** Partitioned for parallel work, frictionless onboarding (for advanced devs).
- **Zero ambient magic:** If something happens, you asked for it.
 

## References & License

- [CQRS by Martin Fowler](https://martinfowler.com/bliki/CQRS.html)
- [AutoMapper for TypeScript](https://automapperts.netlify.app/)
- [NestJS CQRS Module](https://docs.nestjs.com/recipes/cqrs)
- [OpenAPI Specification](https://swagger.io/specification/)



## License

[LICENSE](./LICENSE) © VanguardNX. 2025. All rights reserved.

<!-- # TODOS AND NOTES TO SELF BEFORE OPEN-SOURCING
make shared lib
```bash
npx nx generate @nx/nest:library --directory=lib/shared-utils-lib  --importPath=@vanguard-nx/shared-utils-lib
``` -->
