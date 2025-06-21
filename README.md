<div align="center">
 <img src="./logo.svg" />

  <p><strong>Enterprise-grade NestJS microservices architecture with CQRS, DDD, and modern tooling</strong></p>
  
 
  [![NestJS](https://img.shields.io/badge/NestJS-v11-E0234E?logo=nestjs&logoColor=white)](https://nestjs.com/)
  [![Nx](https://img.shields.io/badge/Nx-Monorepo-143055?logo=nx&logoColor=white)](https://nx.dev/)
  [![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)
  [![CockroachDB](https://img.shields.io/badge/CockroachDB-Compatible-6933FF?logo=cockroachlabs&logoColor=white)](https://www.cockroachlabs.com/)

</div>

## Microservices Monorepo

A **production-ready** microservices monorepo that eliminates the complexity of setting up enterprise-grade Node.js backends. Built by developers, for developers who value **clean architecture**, **type safety**, and **developer experience**.

### ✨ What Makes It Special

- **Battle-tested Architecture** - CQRS + DDD patterns that scale with your team
- **Nx Monorepo** - Share code efficiently across multiple microservices
- **Type-Safe Everything** - Strict TypeScript with custom CQRS decorators
- **Auto-Generated Docs** - Swagger UI with versioned APIs out of the box
- **Production Ready** - Docker, logging, error tracking, and migrations included

## 🛠️ Tech Stack

| Category          | Technology      | Purpose                               |
| ----------------- | --------------- | ------------------------------------- |
| **Framework**     | NestJS v11      | Enterprise Node.js framework          |
| **Monorepo**      | Nx              | Code sharing and build optimization   |
| **Architecture**  | CQRS + DDD      | Scalable command/query separation     |
| **Database**      | CockroachDB     | Cloud-native distributed SQL          |
| **ORM**           | TypeORM         | Type-safe database operations         |
| **Validation**    | class-validator | DTO validation and transformation     |
| **Documentation** | Swagger/OpenAPI | Auto-generated API docs               |
| **Logging**       | Pino + Sentry   | Structured logging and error tracking |

## ⚡ Quick Start

### Prerequisites

- Node.js 20+
- Docker
- pnpm package manager

### 1. Clone

```bash
git clone https://github.com/vanguard-lab/VanguardNX.git
cd VanguardNX
```

### 2. Start Database

```bash

docker-compose up
```

### 3. Install

```bash
cd workspace
pnpm install
```

### 4. Configure Environment

```bash
cp apps/users-ms/temp.env apps/users-ms/.env
```

### 5. Run Migrations

```bash
pnpm users:migration:up
```

### 6. Launch the Service

```bash
pnpm  users:start
```

### 🎉 You're Live!

- **API**: http://localhost:3000/users/v1
- **Swagger Docs**: http://localhost:3000/users/docs

### Try It Out

```bash
# Create a user
curl -X POST http://localhost:3000/users/v1/users \
  -H "Content-Type: application/json" \
  -d '{"username":"johndoe","email":"john@example.com"}'

# Get user by ID
curl http://localhost:3000/users/v1/users/{id}
```

### Core Libraries

| Library              | Purpose          | Key Features                              |
| -------------------- | ---------------- | ----------------------------------------- |
| **shared-core-lib**  | CQRS foundation  | Strict decorators, base classes, mediator |
| **shared-utils-lib** | Common utilities | Parsers, validators, helper functions     |

## Development Workflow

### Adding a New Microservice

```bash
# Generate new NestJS application
nx generate @nrwl/nest:application my-service

# Add shared dependencies
# Import VanguardNxSharedCoreLibModule in your AppModule
```

### Database Operations

```bash
# Generate migration
pnpm users:migration:generate

# Apply migrations
pnpm  users:migration:up

# Rollback migration
pnpm users:migration:down
```

# Development

See [Structure](./Structure.md) for complete file organization and architectural patterns.

## 🌟 Contributing

We welcome contributions from the community!

### 📋 Contribution Guidelines

- Follow existing code patterns and architecture
- Use conventional commits (`feat:`, `fix:`, `docs:`, etc.)
- Update documentation for API changes

## ❓ Frequently Asked Questions

see [FAQ](FAQ.md)

## 🗺️ Roadmap

### 🎯 **Coming Soon**

- [ ] Authentication & Authorization module
- [ ] Event-driven communication between services
- [ ] Redis caching integration
- [ ] Message queue patterns (RabbitMQ/Kafka)
- [ ] Multi-database support
- [ ] Advanced testing utilities

## License

[LICENSE](./LICENSE) © VanguardNX. 2025. All rights reserved.

## Acknowledgments

Built with ❤️ by developers who believe in:

- **Clean Architecture** that stands the test of time
- **Developer Experience** that makes coding enjoyable
- **Community-Driven** open source development
- **Enterprise-Grade** solutions accessible to everyone

---

<div align="center">
  <strong>Ready to build something amazing?</strong><br>
  VanguardNX provides the foundation – you focus on the features that matter.
  
  <br><br>
  
  ⭐ **[Star this repo](https://github.com/vanguard-lab/VanguardNX/stargazers)** if it helped you!<br>
🐛 **[Report issues](https://github.com/vanguard-lab/VanguardNX/issues)** to help us improve<br>
🚀 **[Contribute](CONTRIBUTING.md)** to make it even better
<br>

  <br>
  
  **Happy coding!** 🎉
</div>
