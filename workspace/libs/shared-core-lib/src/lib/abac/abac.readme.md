# Vanguard-NX: Shared Core Library - ABAC Module

## Overview

The Attribute-Based Access Control (ABAC) module in the `shared-core-lib` of the **Vanguard-NX** project provides a robust, flexible, and type-safe framework for implementing fine-grained access control. This module enables developers to define and enforce complex authorization policies based on attributes of actors, resources, actions, and contextual metadata. It is designed to integrate seamlessly with the Vanguard-NX clean architecture, supporting CQRS and microservices patterns.

The ABAC module offers:
- A fluent API for policy evaluation (`for(actor).on(resource).can(action)`).
- Support for dynamic policies with permission wildcards and nested condition logic.
- A builder pattern for constructing policies with type-safe constraints.
- Extensibility for domain-specific resources and actions.
- Comprehensive logging for debugging and audit trails.

This module is a core component of the Vanguard-NX ecosystem, enabling secure and scalable authorization across services.

## Features

- **Fluent Authorization API**: Chainable methods (`for`, `on`, `with`, `can`) for readable permission checks.
- **Policy Evaluation**: Supports `allow`/`deny` effects and priority-based resolution.
- **Permission Wildcards**: Handles patterns like `resource:*` (all actions on a resource) and `*:*` (superuser access).
- **Condition Logic**: Supports complex conditions with operators (`eq`, `neq`, `gt`, `lt`, `in`, etc.) and nested AND/OR groups.
- **Batch Operations**: Methods like `canAll` and `canAny` for checking multiple permissions efficiently.
- **Policy Builder**: Fluent `PolicyBuilder` class for constructing policies with nested conditions.
- **Type Safety**: Generic TypeScript interfaces ensure compile-time validation of resources, actions, and conditions.
- **Extensibility**: Abstract `AbacService` allows subclasses to define domain-specific actions and policies.


## Usage

### 1. Setting Up the ABAC Service

To use the ABAC module, extend the `AbacService` abstract class and implement the required methods (`getAllActions` and `registerPolicies`).

```typescript
import { AbacService, IAbacActor, IPolicy } from '@vanguard-nx/shared-core-lib';

interface MyActor extends IAbacActor {
  id: string;
  role: string;
  permissions: string[];
}

class MyAbacService extends AbacService<MyActor, 'user' | 'post', 'read' | 'write' | 'delete'> {
  protected getAllActions(): Array<'read' | 'write' | 'delete'> {
    return ['read', 'write', 'delete'];
  }

  protected registerPolicies(): Array<IPolicy<MyActor, 'user' | 'post', 'read' | 'write' | 'delete'>> {
    return [
      new PolicyBuilder<MyActor, 'user' | 'post', 'read' | 'write' | 'delete'>()
        .withId('allow-admin-read')
        .withPermission('*:read')
        .withEffect('allow')
        .conditions()
        .add({ field: '{{actor.role}}', operator: 'eq', value: 'admin' })
        .end()
        .build(),
      new PolicyBuilder<MyActor, 'user' | 'post', 'read' | 'write' | 'delete'>()
        .withId('allow-own-post-delete')
        .withPermission('post:delete')
        .withEffect('allow')
        .conditions()
        .add({ field: '{{actor.id}}', operator: 'eq', value: '{{record.authorId}}' })
        .end()
        .build(),
    ];
  }
}
```

### 2. Checking Permissions

Use the fluent API to check if an actor can perform an action on a resource.

```typescript
const abac = new MyAbacService(logger);
const user: MyActor = { id: 'user123', role: 'admin', permissions: ['user:read', 'post:read'] };
const post = { id: 'post1', authorId: 'user123', content: 'Hello' };

// Check if user can read a post
const canRead = await abac.for(user).on('post', post).can('read');
// true (admin role has *:read permission)

// Check if user can delete their own post
const canDelete = await abac.for(user).on('post', post).can('delete');
// true (actor.id matches post.authorId)

// Check if user can delete another user's post
const otherPost = { id: 'post2', authorId: 'user456' };
const canDeleteOther = await abac.for(user).on('post', otherPost).can('delete');
// false (actor.id does not match post.authorId)
```

### 3. Batch Permission Checks

Use `canAll` or `canAny` to check multiple permissions.

```typescript
// Check if user can perform all actions
const canReadAndWrite = await abac.for(user).on('post', post).canAll('read', 'write');
// true if user has both permissions

// Check if user can perform any action
const canDoSomething = await abac.for(user).on('post', post).canAny('write', 'delete');
// true if user has either permission
```

### 4. Getting Allowed Actions

Retrieve all actions an actor can perform on a resource.

```typescript
const allowedActions = await abac.for(user).on('post', post).getAllowedActions();
// ['read', 'delete'] (based on policies)
```

### 5. Building Complex Policies

Use `PolicyBuilder` and `ConditionChain` to create policies with nested conditions.

```typescript
const policy = new PolicyBuilder<MyActor, 'user' | 'post', 'read' | 'write' | 'delete'>()
  .withId('complex-policy')
  .withPermission('post:write')
  .withEffect('allow')
  .withPriority(10)
  .validFrom(Date.now())
  .validUntil(Date.now() + 86400000) // 24 hours
  .conditions()
  .addGroup('OR', (chain) => {
    chain
      .add({ field: '{{actor.role}}', operator: 'eq', value: 'admin' })
      .addGroup('AND', (nested) => {
        nested
          .add({ field: '{{actor.department}}', operator: 'eq', value: 'it' })
          .add({ field: '{{record.createdAt}}', operator: 'gt', value: Date.now() - 3600000 }); // Last hour
      });
  })
  .end()
  .build();
```

### 6. Adding Contextual Metadata

Attach metadata to the context for custom evaluation logic.

```typescript
const canAccess = await abac
  .for(user)
  .on('admin-panel')
  .with({ ip: '127.0.0.1', timeOfDay: new Date().getHours() })
  .can('access');
```

Use metadata in a condition's `transformField` or `transformValue`:

```typescript
conditions()
  .add({
    field: '{{actor.id}}',
    operator: 'eq',
    value: 'admin123',
    transformField: (value, ctx) => {
      return ctx.metadata?.ip === '127.0.0.1' ? value : null; // Restrict to localhost
    },
  })
  .end();
```

## Key Components

### AbacService

- **Purpose**: Core engine for evaluating policies.
- **Methods**:
  - `for(actor)`: Sets the actor and timestamp.
  - `on(resource, record?)`: Specifies the resource and optional record data.
  - `with(metadata)`: Attaches contextual metadata.
  - `can(action)`: Checks if an action is allowed.
  - `cannot(action)`: Inverse of `can`.
  - `canAll(...actions)`: Checks if all actions are allowed.
  - `canAny(...actions)`: Checks if any action is allowed.
  - `getAllowedActions()`: Returns all permitted actions.
  - `hasPermission(permission)`: Checks if actor has a specific permission.
  - `getMatchingPolicies(action?)`: Returns policies matching the context.
  - `getEffectivePermissions(resource)`: Returns all permissions for a resource.
- **Abstract Methods**:
  - `getAllActions()`: Define all possible actions.
  - `registerPolicies()`: Define policies for the service.

### PolicyBuilder

- **Purpose**: Constructs policies with a fluent API.
- **Methods**:
  - `withId(id, description?)`: Sets policy ID and optional description.
  - `withPermission(permission)`: Defines the resource:action pair.
  - `withEffect(effect)`: Sets `allow` or `deny`.
  - `withPriority(priority)`: Sets evaluation order.
  - `conditions()`: Starts condition chain.
  - `build()`: Validates and returns the policy.

### ConditionChain

- **Purpose**: Builds nested condition groups.
- **Methods**:
  - `add(condition)`: Adds a single condition.
  - `addGroup(operator, fn)`: Adds a nested AND/OR group.
  - `end()`: Returns to the parent `PolicyBuilder`.

### Types and Enums

- **IAbacActor**: Interface for actors with permissions and optional time-based access.
- **IPermission**: String format `resource:action` or wildcards (`*:*`, `resource:*`).
- **ICondition**: Defines field, operator, value, and optional transforms.
- **IConditionGroup**: Supports nested AND/OR logic.
- **IPolicy**: Defines policy attributes (ID, permission, effect, conditions, etc.).
- **EConditionOperator**: Enum for comparison operators (`eq`, `neq`, `gt`, `lt`, `in`, etc.).

## Use Cases

### 1. Admin Access Control

**Scenario**: Only admins can read all user profiles.

```typescript
const policy = new PolicyBuilder()
  .withId('admin-read-users')
  .withPermission('user:read')
  .withEffect('allow')
  .conditions()
  .add({ field: '{{actor.role}}', operator: 'eq', value: 'admin' })
  .end()
  .build();

const canRead = await abac.for({ id: 'user1', role: 'admin', permissions: [] }).on('user').can('read');
// true
```

### 2. Own Resource Modification

**Scenario**: Users can delete their own posts but not others'.

```typescript
const policy = new PolicyBuilder()
  .withId('own-post-delete')
  .withPermission('post:delete')
  .withEffect('allow')
  .conditions()
  .add({ field: '{{actor.id}}', operator: 'eq', value: '{{record.authorId}}' })
  .end()
  .build();

const user = { id: 'user1', role: 'user', permissions: ['post:delete'] };
const ownPost = { authorId: 'user1' };
const otherPost = { authorId: 'user2' };

const canDeleteOwn = await abac.for(user).on('post', ownPost).can('delete');
// true
const canDeleteOther = await abac.for(user).on('post', otherPost).can('delete');
// false
```




### 3. Complex Conditions

**Scenario**: Allow post updates if the user is in the IT department and the post is recent.

```typescript
const policy = new PolicyBuilder()
  .withId('it-recent-post-update')
  .withPermission('post:write')
  .withEffect('allow')
  .conditions()
  .addGroup('AND', (chain) => {
    chain
      .add({ field: '{{actor.department}}', operator: 'eq', value: 'it' })
      .add({ field: '{{record.createdAt}}', operator: 'gt', value: Date.now() - 3600000 });
  })
  .end()
  .build();

const user = { id: 'user1', department: 'it', permissions: ['post:write'] };
const recentPost = { createdAt: Date.now() - 1800000 }; // 30 minutes ago
const oldPost = { createdAt: Date.now() - 7200000 }; // 2 hours ago

const canUpdateRecent = await abac.for(user).on('post', recentPost).can('write');
// true
const canUpdateOld = await abac.for(user).on('post', oldPost).can('write');
// false
```

## Logging and Debugging

The module uses `PinoLogger` to log condition evaluations and errors.

Use `getMatchingPolicies` to debug which policies apply:

```typescript
const policies = await abac.for(user).on('post', post).getMatchingPolicies('write');
// [{ id: 'it-recent-post-update', permission: 'post:write', effect: 'allow', ... }]
```

## Extensibility

To extend for domain-specific needs:

1. Define custom resource and action types:
```typescript
type MyResource = 'user' | 'post' | 'comment';
type MyAction = 'read' | 'write' | 'delete' | 'publish';
```

2. Extend `AbacService`:
```typescript
class CustomAbacService extends AbacService<MyActor, MyResource, MyAction> {
  protected getAllActions(): MyAction[] {
    return ['read', 'write', 'delete', 'publish'];
  }
  protected registerPolicies(): Array<IPolicy<MyActor, MyResource, MyAction>> {
    // Custom policies
  }
}
```

## Limitations

- **Performance**: Evaluating large numbers of policies or complex condition groups may impact performance. Use priorities to optimize evaluation order.
- **Record Dependency**: Conditions referencing `{{record.*}}` require a record in the context; otherwise, they fail.
- **No Built-in Persistence**: Policies are defined in code via `registerPolicies`. For dynamic policies, integrate with a database or external store.



## License

The ABAC module is part of the Vanguard-NX project and is licensed under the project's standard license
