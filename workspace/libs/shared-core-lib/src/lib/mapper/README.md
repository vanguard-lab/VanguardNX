<!-- Meh its AI generated, i suck at writing usage docs T_T -->
# Object Mapper

A decorator-based object mapping library specifically designed for NestJS applications. Transform data between different object types with ease using decorators and flexible configuration options.

## Features

- 🎯 **NestJS Integration** - Native dependency injection support
- 🏷️ **Decorator-Based** - Simple `@AutoMap` decorator for field mapping
- 🔧 **Custom Mappings** - Flexible custom transformation functions
- 📝 **TypeScript Support** - Full type safety with generics
- 🔍 **Field Validation** - Automatic validation of mappable fields
- 📊 **Detailed Logging** - Comprehensive mapping operation logs
- ⚡ **Performance Optimized** - Efficient symbol-based mapping registry
- 🧪 **Array Support** - Map single objects or arrays seamlessly


## Quick Start

### 1. Import the Module

```typescript
import { Module } from '@nestjs/common';
import { ObjectMapperModule } from '@vanguard-nx/core';

@Module({
  imports: [
    ObjectMapperModule.forRoot({
      logging: { enabled: true }
    })
  ],
})
export class AppModule {}
```

### 2. Define Your Classes

```typescript
import { AutoMap } from '@vanguard-nx/core';

export class UserDto {
  @AutoMap()
  id: number;

  @AutoMap()
  name: string;

  @AutoMap()
  email: string;
}

export class UserEntity {
  @AutoMap()
  id: number;

  @AutoMap()
  name: string;

  @AutoMap()
  email: string;

  @AutoMap()
  createdAt: Date;
}
```

### 3. Create a Mapping Profile

```typescript
import { Injectable } from '@nestjs/common';
import { MapperProfile, ObjectMapper, forMember, mapFrom } from '@vanguard-nx/core';

@Injectable()
export class UserProfile extends MapperProfile {
  constructor(mapper: ObjectMapper) {
    super(mapper);
  }

  protected configure(): void {
    this.createMap(UserEntity, UserDto);
    
    // Custom mapping example
    this.createMap(UserEntity, UserDto, (config) =>
      config.forMember(
        (dest) => dest.displayName,
        mapFrom((source) => `${source.firstName} ${source.lastName}`)
      )
    );
  }
}
```

### 4. Use in Services

```typescript
import { Injectable, Inject } from '@nestjs/common';
import { ObjectMapper, OBJECT_MAPPER } from '@vanguard-nx/core';

@Injectable()
export class UserService {
  constructor(
    @Inject(OBJECT_MAPPER) private readonly mapper: ObjectMapper
  ) {}

  async getUser(id: number): Promise<UserDto> {
    const userEntity = await this.userRepository.findById(id);
    return this.mapper.map(userEntity, UserEntity, UserDto);
  }

  async getUsers(): Promise<UserDto[]> {
    const userEntities = await this.userRepository.findAll();
    return this.mapper.mapArray(userEntities, UserEntity, UserDto);
  }
}
```

## Advanced Usage

### Custom Mapping Functions

```typescript
this.createMap(UserEntity, UserDto, (config) =>
  config
    .forMember(
      (dest) => dest.fullName,
      mapFrom((source) => `${source.firstName} ${source.lastName}`)
    )
    .forMember(
      (dest) => dest.isActive,
      mapFrom((source) => source.status === 'active')
    )
);
```

### Async Module Configuration

```typescript
@Module({
  imports: [
    ObjectMapperModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        logging: {
          enabled: configService.get('MAPPER_LOGGING', true),
          logger: new CustomLogger()
        }
      })
    })
  ],
})
export class AppModule {}
```

### Multiple Profiles

```typescript
@Injectable()
export class UserProfile extends MapperProfile {
  protected configure(): void {
    this.createMap(UserEntity, UserDto);
    this.createMap(UserEntity, UserSummaryDto);
  }
}

@Injectable()
export class ProductProfile extends MapperProfile {
  protected configure(): void {
    this.createMap(ProductEntity, ProductDto);
  }
}
```

### Standalone Usage

```typescript
import { createMap } from '@vanguard-nx/core';

const mapper = new ObjectMapper();
createMap(mapper, UserEntity, UserDto);

const userDto = mapper.map(userEntity, UserEntity, UserDto);
```

## API Reference

### Decorators

#### `@AutoMap()`
Marks a property for automatic mapping between classes.

```typescript
export class User {
  @AutoMap()
  id: number;
}
```

### Classes

#### `ObjectMapper`
Main service for creating mappings and transforming objects.

- `map<T, U>(source: T, sourceClass: Class<T>, targetClass: Class<U>): U`
- `mapArray<T, U>(sources: T[], sourceClass: Class<T>, targetClass: Class<U>): U[]`
- `createMapping<T, U>(sourceClass: Class<T>, targetClass: Class<U>): MappingEntry`

#### `MapperProfile`
Abstract base class for defining mapping configurations.

- `createMap<T, U>(sourceClass: Class<T>, targetClass: Class<U>, config?: Function): MappingConfiguration<T, U>`

#### `MappingConfiguration<TSource, TDestination>`
Fluent API for configuring individual mappings.

- `forMember(destinationMember: Function, mapping: MappingOptions): this`
- `ignoreMember(destinationMember: Function): this` (Beta)

### Helper Functions

#### `forMember(destinationMember, mapping)`
Creates a member mapping configuration.

#### `mapFrom(mappingFunction)`
Creates a custom mapping function.

#### `createMap(mapper, sourceClass, destinationClass, configuration?)`
Standalone function to create mappings without profiles.

## Configuration Options

### ObjectMapperModuleOptions

```typescript
interface ObjectMapperModuleOptions {
  logging?: {
    enabled: boolean;
    logger?: ILogger;
  };
}
```

### Custom Logger

```typescript
interface ILogger {
  log(message: string, param?: any): void;
}

class CustomLogger implements ILogger {
  log(message: string, param?: any): void {
    // Custom logging implementation
  }
}
```

## Best Practices

1. **Use Profiles**: Organize mappings in profile classes for better maintainability
2. **Mark Fields**: Always use `@AutoMap()` on properties you want to map
3. **Type Safety**: Leverage TypeScript generics for compile-time type checking
4. **Custom Mappings**: Use `forMember` for complex transformations
5. **Performance**: Register mappings once during application startup
6. **Debugging**: Enable logging during development to troubleshoot mappings

## Error Handling

The library provides detailed error messages for common issues:

- Missing `@AutoMap` decorators
- Unregistered class mappings
- Invalid mapping configurations
- Type mismatches

```typescript
  const result = mapper.map(source, SourceClass, TargetClass);
```

