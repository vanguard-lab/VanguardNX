# VanguardNx Controller Pattern

## Overview

This document outlines the controller implementation pattern used in the VanguardNx. controllers follow a strict architectural approach that ensures consistency, maintainability, and adherence to best practices.

## Core Architecture Principles

- **CQRS Pattern**: Strict separation of commands and queries
- **DTO Mapping**: AutoMapper for type-safe transformations
- **API Versioning**: Built-in versioning for all endpoints
- **OpenAPI Documentation**: Comprehensive API documentation at compile-time
- **Structured Logging**: Dependency-traced logging


## Flow Diagram 
<!-- this is not really how it should be - change this in near future! -->

```
┌─────────────┐     ┌─────────────┐     ┌──────────────┐     ┌────────────┐
│  RequestDTO │────▶│Query/Command│────▶│ Domain Entity│────▶│ ResponseDTO│
└─────────────┘     └─────────────┘     └──────────────┘     └────────────┘
     HTTP             CQRS Layer           Domain Layer         HTTP
```

## Controller Implementation Pattern

```typescript
@ApiTags('resource-name')
@Controller({ path: '/resource-path', version: 'version-number' })
export class ResourceController {
  constructor(
    protected readonly mediator: CqrsMediator,
    @InjectMapper() protected readonly mapper: Mapper,
    @InjectPinoLogger(ResourceController.name)
    protected readonly logger: PinoLogger
  ) {}

  // Endpoint implementations...
}
```

## Request Flow Pattern

Every endpoint in VanguardNx follows this strict flow:

1. **Request Validation**: Route parameters/body automatically validated via class-validator
2. **DTO Mapping**: Request DTO mapped to CQRS Query/Command
3. **CQRS Execution**: Query/Command executed via mediator
4. **Response Mapping**: Domain result mapped to Response DTO

## Implementation Examples

### GET Endpoint Pattern

```typescript
@ApiOperation({ summary: 'Get Resource' })
@ApiOkResponse({ type: GetResourceResponse })
@HttpCode(HttpStatus.OK)
@Get(':id')
public async getResource(
  @Param() model: GetResourceRequest
): Promise<GetResourceResponse> {
  const query = this.mapper.map(model, GetResourceRequest, GetResourceQuery);
  const result = await this.mediator.execute<GetResourceQuery, ResourceEntity>(query);
  return this.mapper.map(result, ResourceEntity, GetResourceResponse);
}
```

### POST Endpoint Pattern

```typescript
@ApiOperation({ summary: 'Create Resource' })
@ApiCreatedResponse({ type: CreateResourceResponse })
@HttpCode(HttpStatus.CREATED)
@Post()
public async createResource(
  @Body() model: CreateResourceRequest
): Promise<CreateResourceResponse> {
  const command = this.mapper.map(model, CreateResourceRequest, CreateResourceCommand);
  const result = await this.mediator.execute<CreateResourceCommand, ResourceEntity>(command);
  return this.mapper.map(result, ResourceEntity, CreateResourceResponse);
}
```

## Benefits of This Approach

- **Consistency**: All endpoints follow the same pattern
- **Separation of Concerns**: Clean separation between HTTP, domain logic, and data access
- **Type Safety**: AutoMapper ensures type-safe transformations
- **Documentation**: OpenAPI annotations provide comprehensive API documentation
- **Maintainability**: Clear structure makes code easier to maintain
- **Traceability**: Structured logging facilitates request tracing

## Best Practices

1. **Keep Controllers Thin**: Controllers should only handle HTTP concerns
2. **Use Descriptive Names**: Name your DTOs, queries, and commands clearly
3. **Document Endpoints**: Always include OpenAPI annotations
4. **Validate Input**: Use class-validator for request validation

## Common Code Smells to Avoid

- **Business Logic in Controllers**: All business logic should be in handlers
- **Direct Repository Access**: Always use CQRS mediator
- **Manual Mapping**: Avoid manual object mapping, use AutoMapper
- **Inconsistent Status Codes**: Follow HTTP standards for status codes
- **Missing Documentation**: Always include OpenAPI annotations

## Setting Up a New Controller

1. Define your controller with proper path and version
2. Create request and response DTOs in the `models` directory
3. Create queries and/or commands in the respective directories
4. Implement your mapper profile for the new DTOs
6. Register everything in your module

## Additional Resources

- [CQRS Pattern](https://martinfowler.com/bliki/CQRS.html)
- [OpenAPI/Swagger](https://swagger.io/specification/)
