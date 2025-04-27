# VanguardNx Module Structure and Registration

## Overview

This document explains the standardized module structure and registration pattern used in the VanguardNx project. Our architecture follows a feature-based organization with centralized registration to maintain scalability and consistency as the application grows.

## Directory Structure

```
src/
├── features/
│   ├── index.ts                       # Central registration point for all features
│   ├── [feature-name]/
│   │   ├── index.ts                   # Feature barrel file
│   │   ├── domain/                    # Domain entities
│   │   │   ├── index.ts
│   │   │   └── [entity].ts
│   │   ├── models/                    # DTOs (Request/Response models)
│   │   │   ├── index.ts
│   │   │   ├── [model]-request.ts
│   │   │   └── [model]-response.ts
│   │   ├── queries/                   # CQRS queries
│   │   │   ├── index.ts               # Query handler registration
│   │   │   └── [query-name]/
│   │   │       ├── index.ts
│   │   │       ├── [query-name].query.ts
│   │   │       └── [query-name].handler.ts
│   │   ├── commands/                  # CQRS commands (if applicable)
│   │   │   ├── index.ts               # Command handler registration
│   │   │   └── [command-name]/
│   │   │       ├── index.ts
│   │   │       ├── [command-name].command.ts
│   │   │       └── [command-name].handler.ts
│   │   ├── helpers/                   # Feature-specific utilities
│   │   ├── [feature-name].controller.ts # Controller implementation
│   │   └── [feature-name].profile.ts  # AutoMapper profile
│   └── [other-features]/              # Additional features follow same pattern
└── application.module.ts              # Root application module
```

## Module Registration Pattern

The VanguardNx architecture uses a centralized registration approach through barrel files:

1. **Component Exports**: Each module exports its components through index files
2. **Handler Registration**: Query and command handlers are grouped in dedicated index files
3. **Central Registration**: All components are registered in the main features index
4. **Single Entry Point**: The ApplicationModule imports from a single source

## Implementation Details

### Feature Index File

Each feature has an `index.ts` that exports all its components:

```typescript
// features/[feature-name]/index.ts
export * from './domain';
export * from './models';
export * from './queries';
export * from './commands'; // if applicable
export * from './helpers';
export * from './[feature-name].controller';
export * from './[feature-name].profile';
```

### Handler Registration

CQRS handlers are grouped in dedicated index files:

```typescript
// features/[feature-name]/queries/index.ts
export * from './[query-1]';
export * from './[query-2]';
// ... other query exports

// Export an array of all handlers for easy registration
import { Query1Handler } from './[query-1]';
import { Query2Handler } from './[query-2]';

export default [Query1Handler, Query2Handler];
```

### Central Registration

All features are registered through the main features index:

```typescript
// features/index.ts
import {
  Feature1Controller,
  Feature1MapperProfile
} from './[feature-1]';
import {
  Feature2Controller,
  Feature2MapperProfile
} from './[feature-2]';
import Feature1QueryHandlers from './[feature-1]/queries';
import Feature1CommandHandlers from './[feature-1]/commands';
import Feature2QueryHandlers from './[feature-2]/queries';

export const Controllers = [
  Feature1Controller,
  Feature2Controller,
  // Add new controllers here
];

export const QueryHandlers = [
  ...Feature1QueryHandlers,
  ...Feature2QueryHandlers,
  // Add new query handlers here
];

export const CommandHandlers = [
  ...Feature1CommandHandlers,
  // Add new command handlers here
];

export const MappingProfiles = [
  Feature1MapperProfile,
  Feature2MapperProfile,
  // Add new mapper profiles here
];
```

### Application Module

The ApplicationModule imports and registers all components:

```typescript
// application.module.ts
import { DynamicModule, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import {
  Controllers,
  MappingProfiles,
  QueryHandlers,
  CommandHandlers
} from './features';

@Module({})
export class ApplicationModule {
  public static forRoot(): DynamicModule {
    return {
      global: true,
      module: ApplicationModule,
      imports: [CqrsModule],
      controllers: [...Controllers],
      providers: [
        ...QueryHandlers,
        ...CommandHandlers,
        ...MappingProfiles,
      ],
    };
  }
}
```

## Adding a New Feature

To add a new feature:

1. Create a directory under `features/` with the feature name
2. Create the necessary subdirectories (domain, models, queries, etc.)
3. Implement your components following the established patterns
4. Create index files to export all components
5. Add your feature's components to the arrays in `features/index.ts`

## Benefits of This Approach

- **Modularity**: Features are self-contained and can be developed independently
- **Scalability**: The application can grow without structural changes
- **Discoverability**: New developers can quickly understand the architecture
- **Consistency**: All features follow the same structure and patterns
- **Maintainability**: Changes to one feature don't affect others
- **Testability**: Features can be unit tested in isolation

## Best Practices

1. **Keep Features Cohesive**: Each feature should represent a distinct domain concept
2. **Follow Naming Conventions**: Be consistent with file and class names
3. **Minimize Cross-Feature Dependencies**: Features should be as independent as possible
4. **Don't Bypass Barrel Files**: Always import through index files
5. **Document Feature Boundaries**: Clearly define what each feature is responsible for
6. **Maintain Registration Discipline**: Always update central registration when adding components

## Common Anti-Patterns to Avoid

- **Scattered Registration**: Don't register components outside the central system
- **Feature Leakage**: Don't let concepts from one feature bleed into another
- **Missing Exports**: Ensure all public components are exported in index files
- **Inconsistent Structure**: Don't deviate from the established directory structure
- **Circular Dependencies**: Avoid features that depend on each other

## Command-Line Interface

For efficient development, consider using a scaffolding tool:

*No scaffold tool. Just you, 47 folders, and a dream. Good luck, hero.*
