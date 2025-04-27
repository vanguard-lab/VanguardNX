# VanguardNx - AutoMapper Patterns

## Core Principles

1. **Separation of Concerns**: separate domain models from DTOs (Data Transfer Objects)
2. **Consistent Mapping**: All transformations between layers use AutoMapper

## Mapper Profiles

Each module should have its own mapper profile class that extends `AutomapperProfile`:

```typescript
@Injectable()
export class ModuleNameMapperProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  public override get profile(): MappingProfile {
    return (mapper) => {
      // Call your mapping methods here
      this.requestMappings(mapper);
      this.responseMappings(mapper);
    };
  }

  // Group related mappings into methods
  private requestMappings(mapper: Mapper): void {
    // Request DTO to Query/Command mappings
    createMap(mapper, RequestDTO, QueryOrCommand);
  }

  private responseMappings(mapper: Mapper): void {
    // Domain entity to Response DTO mappings
    createMap(mapper, DomainEntity, ResponseDTO);
  }
}
```


## Implementation Guide

### Step 1: Create your DTOs

Define your request and response DTOs in the `models` directory:

```typescript
// models/get-user-request.ts
export class GetUserRequest {
  id: string;
}

// models/get-user-response.ts
export class GetUserResponse {
  id: string;
  username: string;
}
```

### Step 2: Create CQRS Query/Command

Define your query or command object in the `queries` or `commands` directory:

```typescript
// queries/get-user.query.ts
export class GetUserQuery {
  id: string;
}
```

### Step 3: Create Domain Entity

Define your domain entity in the `domain` directory:

```typescript
// domain/user.ts
export class User {
  id: string;
  username: string;
}
```

### Step 4: Create Mapper Profile

Create a mapper profile in the `mappers` directory following the pattern described above.

### Step 5: Register in Module

Register your mapper profile in your module:

```typescript
@Module({
  providers: [YourMapperProfile],
})
```

## Advanced Mapping Scenarios

### Custom Value Transformations

For more complex mappings, use `.forMember()`:

```typescript
createMap(
  mapper, 
  User, 
  GetUserResponse,
  forMember(
    destination => destination.fullName,
    mapFrom(source => `${source.firstName} ${source.lastName}`)
  )
);
```

### Conditional Mapping

For conditional mappings:

```typescript
createMap(
  mapper,
  User,
  GetUserResponse,
  forMember(
    destination => destination.status,
    mapFrom(source => source.isActive ? 'Active' : 'Inactive')
  )
);
```

## Best Practices

1. **Group Related Mappings**: Organize mappings into logical groups (requests, responses, etc.)
2. **Use Descriptive Method Names**: Make your mapping method names clear and descriptive
5. **Keep Profiles Focused**: Each profile should handle a single module's mappings

## Common Issues and Solutions

- **Circular Dependencies**: If you encounter circular dependencies, consider using interfaces or creating intermediate DTOs
- **Complex Mappings**: For very complex transformations, consider using a custom resolver or mapping function

## Additional Resources

- [AutoMapper TypeScript Documentation](https://automapperts.netlify.app/)
- [NestJS AutoMapper Module](https://automapperts.netlify.app/docs/nestjs)
