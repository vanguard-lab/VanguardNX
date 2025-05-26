# VanguardNx Shared Library — Strictly Helpful, Surprisingly Friendly

A powerful, type-safe core library for NestJS microservices & DDD architectures.
Implements CQRS (Command Query Responsibility Segregation), repository patterns, robust exception handling, and more.
Ideal for scalable, maintainable, enterprise-grade Node.js backends.


Whether you’re just learning CQRS or scaling out microservices in production, this package saves you time, catches bugs early, and helps you write code that stays clean over time.



## TLDR: What You Get

- **CQRS?** Your handlers are *strictly* typed, enforced, and routed.
- **DB?** Extend the base repo, never copy code again.
- **Exceptions?** All errors—service, DB, RPC—handled and logged, globally.
- **Logging?** Pino, Sentry, ready to plug in. Be an ops hero.
- **Utils?** Save time, look smart.


## Features

- **CQRS Pattern**: Strict, type-safe CQRS with decorators for command/query handlers and a unified mediator.
- **Repository Pattern**: Abstract, generic repositories for database operations with TypeScript typing.
- **Exception Handling**: Advanced, extensible RPC and HTTP error classes for robust error management.
- **Logger Utilities**: Pino and Sentry configuration helpers for advanced observability.
- **Environment Tools**: Helpers for environment detection and dotenv management.
- **Interceptors**: Global RPC exception interceptor for consistent NestJS error responses.
- **Utils for Humans, not Robots**: Validation and type helpers you’ll actually use.


## Basic Setup

```ts
import { VanguardNxSharedCoreLibModule } from '@vanguard-nx/core';

@Module({
  imports: [VanguardNxSharedCoreLibModule.forRoot()],
})
export class AppModule {}
```

That’s it. You’re wired up.

---

## Core Concepts

### CqrsMediator

Central dispatch—no more spaghetti.

```ts
const result = await mediator.execute(new DoSomethingCommand());
```

It figures out what kind of object you passed in and routes it correctly. No more `CommandBus` vs `QueryBus` debates.

### Strict Handlers

You declare exactly which handler processes which object, and it’s enforced at runtime:

```ts
@CommandHandlerStrict(MyCommand)
export class MyCommandHandler implements ICommandHandler<MyCommand> { ... }
```

**CQRS error enforcement**: Your handlers better play by the rules - No mismatches, no surprises.


### Base Repositories

Use `BaseRepo` (or `BaseReadOnlyRepo`) to avoid:

* Copying the same `find`/`save`/`map` logic
* Forgetting to log database errors
* Manually converting DB entities to domain models

Just extend and go.

### Structured Exceptions

All exceptions follow a consistent shape. Consumers (frontends or services) get structured responses.

```ts
throw new RpcNotFoundException("User not found");
```
Use built-in exception classes for consistent RPC error management:

- `RpcBaseException`
- `RpcBadRequestException`
- `RpcInternalServerErrorException`
- `RpcNotFoundException`
- `ArgumentNilException`
- `DbException`

And auto-convert errors to HTTP via `RpcGlobalExceptionInterceptor`.

---

### Logger & Sentry Configuration

```typescript
import { generateLoggerConfig, generateSentryConfig } from '@vanguard-nx/core';

const loggerConfig = generateLoggerConfig();
const sentryConfig = generateSentryConfig();
```

---

### Environment Utilities

```typescript
import { isDev, isProd, isTest, isStaging, isLocal, dotEnvName } from '@vanguard-nx/core';
```

---

## Usage Scenarios

### Check Stock for a Product

Query current inventory levels:

```ts
class GetStockLevelQuery extends QueryBase {
  stockId: string;
}
```

Controller usage:

```ts
const result = await mediator.execute(new GetStockLevelQuery('ABC123'));
```

Handler returns the product or throws if missing.

### Create an Order

Record an order placement:

```ts
class CreateOrderCommand extends CommandBase {
  customerId: string;
  totalAmount: number;
}
```

In your controller:

```ts
const result = await mediator.execute(new CreateOrderCommand(...));
```

Handler maps and persists the order domain model.

### List Audit Logs

Fetch logs tied to a resource:

```ts
class ListAuditLogsQuery extends QueryBase {
  resourceId: string;
}
```

Handler uses a read-only repo and returns structured logs.

---

## Configuration Add-ons

### Logging

```ts
LoggerModule.forRootAsync({
  useFactory: () => generateLoggerConfig(),
});
```

### Database

```ts
TypeOrmModule.forRootAsync({
  useFactory: () => generateDataSourceOptions(envVars),
});
```

### Sentry Integration

```ts
SentryModule.forRootAsync({
  useFactory: () => generateSentryConfig(),
});
```

---

## API Reference

### CQRS Exports

- `CommandBase`, `QueryBase`, `CQBase`
- `CommandHandlerStrict`, `QueryHandlerStrict`
- `CqrsMediator`
- Exceptions: `NotCommandOrQueryException`

### Repository Exports

- `BaseReadOnlyRepo`, `BaseRepo`
- `IBaseRepo`, `IReadOnlyRepo`
- Database exception: `DbException`

### Exception Exports

- `RpcBaseException`, `RpcBadRequestException`, `RpcInternalServerErrorException`, `RpcNotFoundException`, `ArgumentNilException`

### Logger & Tools

- Logger: `generateLoggerConfig`, `generateSentryConfig`
- Environment: `isDev`, `isProd`, `isTest`, `isStaging`, `isLocal`, `dotEnvName`

---

## Best Practices

* Use strict decorators. Don’t let runtime bugs slip in.
* Profile AutoMapper early to avoid surprises.
* Use RpcBaseException types for all thrown errors.


## Peer Dependencies:
- `@nestjs/common` (tested on v10/11)
- `@nestjs/cqrs`
- `typeorm`
- `nestjs-pino`
- `@automapper/core`
- `@ntegral/nestjs-sentry` (for Sentry integration)
- `lodash`
- `uuid`




## If You’re Not Using This, You’re Doing Too Much Work

Every function here solves a real, painful problem. If you’re not leveraging these, you’re either:

- Copy-pasting the same code for the 10th time, or
- Wondering why your CQRS is a dumpster fire.

**_Don’t be basic. Be Vanguard._**




## License

[LICENSE](../../LICENSE) © VanguardNX. 2025. All rights reserved.

## Acknowledgements

- [NestJS CQRS](https://github.com/nestjs/cqrs)
- [nestjs-pino](https://github.com/iamolegga/nestjs-pino)
- [@automapper/core](https://automapperts.netlify.app/)
- [typeorm](https://typeorm.io/)
- [lodash](https://lodash.com/)


