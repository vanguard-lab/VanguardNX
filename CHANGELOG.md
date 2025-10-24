# Changelog

All notable changes to this project will be documented in this file.


## [v2.1.0] 2025-10-24

### Added

* Implemented a **robust ABAC (Attribute-Based Access Control)** system in `shared-core-lib`, introducing `AbacService`, `PolicyBuilder`, and `ConditionChain` for flexible, policy-driven authorization ([commit](https://github.com/vanguard-lab/VanguardNX/commit/a6804aba5748a395373ae907f3b802335fba49ca)).
* Integrated **ABAC policy enforcement** into the `users-ms` service with `UserAbacService`, domain-specific policies, and action/resource enums ([commit](https://github.com/vanguard-lab/VanguardNX/commit/5a61aec8b5041d63ba95d6ecb73b98de5aa75b05)).

### Changed

* Registered `USER_ABAC_SERVICE` provider in `ApplicationModule` to enable injection via string token.
* Updated `ListUsersQueryHandler` to perform ABAC-based authorization for user listing.

### Removed

* Deleted unused `EResource` enum and related references from core library ([commit](https://github.com/vanguard-lab/VanguardNX/commit/1589804d804b19f4dd5ed499d6ef6e1995132f58)).


## [v2.0.0] 2025-08-13

### Added
- Implemented user editing functionality with new `EditUserCommand` and `EditUserCommandHandler` for updating existing user records ([commit](https://github.com/vanguard-lab/VanguardNX/commit/d567657)).
- Added `EditUserRequest` model to handle user update requests with validation ([commit](https://github.com/vanguard-lab/VanguardNX/commit/54815ad)).
- Introduced new `/edit` endpoint in `UsersController` for updating user details via PATCH requests ([commit](https://github.com/vanguard-lab/VanguardNX/commit/82de6e9)).
- Added mapping configurations for `EditUserCommand` and `EditUserRequest` in `UsersMapperProfile` ([commit](https://github.com/vanguard-lab/VanguardNX/commit/1579d7c)).
- Created new `edit` directory under `commands` with command and handler files ([commit](https://github.com/vanguard-lab/VanguardNX/commit/7f72949)).

### Changed
- **Breaking Change**: Renamed `VanguardTransmute` to `Mapper` and `ITransmute` to `IMapper` across the codebase for consistency and clarity ([commit](https://github.com/vanguard-lab/VanguardNX/commit/8bc32c9)).
- Updated `isNilOrEmpty` function in `shared-utils-lib` to improve type safety with explicit return type ([commit](https://github.com/vanguard-lab/VanguardNX/commit/dcb1a3c)).
- Modified `UsersController` to support new edit functionality and updated mapper interface usage ([commit](https://github.com/vanguard-lab/VanguardNX/commit/82de6e9)).
- Updated `GetUserQueryHandler` to remove unnecessary non-null assertion for cleaner code ([commit](https://github.com/vanguard-lab/VanguardNX/commit/5550fca)).
- Refactored repository and mapper files to use new `IMapper` interface ([commit](https://github.com/vanguard-lab/VanguardNX/commit/c5f09d7), [commit](https://github.com/vanguard-lab/VanguardNX/commit/6a99faa), [commit](https://github.com/vanguard-lab/VanguardNX/commit/b6b4b64)).
- Enhanced `ObjectTransformer` to support mutation operations with new `mutate` and `mutateArray` methods ([commit](https://github.com/vanguard-lab/VanguardNX/commit/5d7688c)).




## [v1.2.0] 2025-08-10

### Breaking Changes

- Replaced AutoMapper library with custom `VanguardTransmute` from `@vanguard-nx/core`, affecting all mapping profiles, commands, queries, and controllers in `users-ms` [[commit]](https://github.com/api-ace/VanguardNX/commit/b77cd89f02fe249c14d489d7be48bf912a3c47a4) [[commit]](https://github.com/api-ace/VanguardNX/commit/44da8251ac2c82442b294e1f8fdaacb36864920d) [[commit]](https://github.com/api-ace/VanguardNX/commit/6c646285871ee34d44f74ee70288f997da9e3443) [[commit]](https://github.com/api-ace/VanguardNX/commit/127479e6f7a8946de760c6e2afa7e0f5e62d5faa):
  - Mapping profiles now extend `MapperProfile` and use `createMap` from the new system.
  - Updated imports: `AutoMap`, `CommandHandlerStrict`, `InjectMapper`, `ITransmute` now sourced from `@vanguard-nx/core`.
  - Renamed `users.mapper.ts` to `users.profile.ts` and refactored to use new mapping API.
  - Replaced `AutomapperModule` with `VanguardTransmuteModule.forRootAsync()` in `user.module.ts`.
- Removed `CustomUserMapperProfile` and related custom mappings registration [[commit]](https://github.com/api-ace/VanguardNX/commit/b77cd89f02fe249c14d489d7be48bf912a3c47a4).
- Removed `EntityMapperProfile` export from infrastructure module [[commit]](https://github.com/api-ace/VanguardNX/commit/127479e6f7a8946de760c6e2afa7e0f5e62d5faa).

### Added

- New custom object mapper implementation in `shared-core-lib/src/lib/mapper/` [[commit]](https://github.com/api-ace/VanguardNX/commit/3e5e0d3d31d49b1d1b7a8c4c2e5f6g7h):
  - Core classes: `VanguardTransmute`, `MapperProfile`, `MappingConfiguration`, `MappingRegistry`, etc.
  - Features: Decorator-based mapping (`@AutoMap`), transformation strategy caching, detailed logging, field validation, and custom mapping support.
  - Added `README.md` with usage examples, API reference, and best practices.
  - Added `object-transformer.md` explaining caching and performance optimizations.
- New files in `users-ms` [[commit]](https://github.com/api-ace/VanguardNX/commit/6c646285871ee34d44f74ee70288f997da9e3443) 
  - `shared/adapters/pino-logger.adapter.ts`: Adapter for `PinoLogger` to implement `ILogger` interface.
- Exported new mapper utilities from `shared-core-lib/src/index.ts` (e.g., decorators, types, module) [[commit]](https://github.com/api-ace/VanguardNX/commit/3e5e0d3d31d49b1d1b7a8c4c2e5f6g7h).
- Added debug methods to mapper components (e.g., `debug()` in `VanguardTransmute`) [[commit]](https://github.com/api-ace/VanguardNX/commit/3e5e0d3d31d49b1d1b7a8c4c2e5f6g7h).
 

### Changed

- Refactored `users-ms` to use new custom mapper [[commit]](https://github.com/api-ace/VanguardNX/commit/b77cd89f02fe249c14d489d7be48bf912a3c47a4) [[commit]](https://github.com/api-ace/VanguardNX/commit/44da8251ac2c82442b294e1f8fdaacb36864920d) [[commit]](https://github.com/api-ace/VanguardNX/commit/6c646285871ee34d44f74ee70288f997da9e3443) [[commit]](https://github.com/api-ace/VanguardNX/commit/127479e6f7a8946de760c6e2afa7e0f5e62d5faa):
  - Updated command handlers (e.g., `add-user.command-handler.ts`): Use `ITransmute` instead of `Mapper`.
  - Updated queries (e.g., `list-users.query-handler.ts`): Minor execution tweaks and import adjustments, removed unnecessary mappings.
  - Updated controller (`users.controller.ts`): Use `ITransmute` for mapping.
  - Updated domain model (`user.ts`): Reordered fields and updated `AutoMap` import.
  - Updated helpers (`users.profile.ts`): Extend `MapperProfile`, use `configure()` method, and add new mappings (e.g., `ListUsersQuery` to `User`).
  - Updated models: Consistent `AutoMap` imports and extended responses.
  - Updated infrastructure: Updated entity mappings to use new system, persistence repositories (`user.repo.ts`): Use `ITransmute` instead of `Mapper`.
- In `shared-core-lib` [[commit]](https://github.com/api-ace/VanguardNX/commit/3e5e0d3d31d49b1d1b7a8c4c2e5f6g7h):
  - Updated base repos (`base-read-only.repo.ts`, `base.repo.ts`): Use `ITransmute` for mapping.
  - Added comprehensive types, exceptions, and utilities for the new mapper.
- Updated `shared-utils-lib` to export additional lodash functions (`map`, `find`) [[commit]](https://github.com/api-ace/VanguardNX/commit/i8j9k0l1m2n3o4p5q6r7s8t9u0v1).

### Fixed

- Improved logging and error handling in the new mapper (e.g., `AutoMapNotFoundException`, `InvalidConstructorException`) [[commit]](https://github.com/api-ace/VanguardNX/commit/3e5e0d3d31d49b1d1b7a8c4c2e5f6g7h).
- Ensured type safety and caching in transformation logic to prevent redundant computations [[commit]](https://github.com/api-ace/VanguardNX/commit/3e5e0d3d31d49b1d1b7a8c4c2e5f6g7h).

### Dependencies

- Removed: `@automapper/classes@^8.8.1`, `@automapper/core@^8.8.1`, `@automapper/nestjs@^8.8.1` [[commit]](https://github.com/api-ace/VanguardNX/commit/i8j9k0l1m2n3o4p5q6r7s8t9u0v1).


## [v1.0.0] - 2025-05-27

### Added
- CQRS command handler and command for creating users; query and handler for listing users ([43708c6](https://github.com/api-ace/VanguardNX/commit/43708c62182fd244b024a3d0688984c2205f7c10))
- AutoMapper profiles for user mapping
- UsersController endpoints for user creation and listing
- UserNotFoundException and generic RpcNotFoundException
- Detailed README for shared library ([f7c89d8](https://github.com/api-ace/VanguardNX/commit/f7c89d85ee2cd3f9d3c827a72ee90c66fc1dd704))
- SECURITY.md file ([da50a39](https://github.com/api-ace/VanguardNX/commit/da50a39a221633c557c41b2e09c3786764487274))

### Changed
- Modernized CockroachDB service, dynamic DB init, and TypeORM env loading for devops ([7788ce7](https://github.com/api-ace/VanguardNX/commit/7788ce7d29849b899e1a70813ab352e0ee173e05))
- Centralized API config and main bootstrap on env/config service ([3714337](https://github.com/api-ace/VanguardNX/commit/37143378132947269bf55cf0b764d1e2b0a1785f))
- Switched to custom personal non-commercial license ([5aee7a4](https://github.com/api-ace/VanguardNX/commit/5aee7a4a19e322c1b0d7cbf94d4ccc4042eb3218))
- Enhanced README with architecture overview, CQRS principles, and project philosophy ([19fadf0](https://github.com/api-ace/VanguardNX/commit/19fadf0163649dd1836588f54d6f5a2fe232346d))

### Removed
- Legacy CI workflow configuration ([a0cd3d3](https://github.com/api-ace/VanguardNX/commit/a0cd3d3e627e4e1690d7987912f031260c1d64cc))
- Local backup file accidentally pushed to repo ([a9805a5](https://github.com/api-ace/VanguardNX/commit/a9805a5c4adfe49c3d8bc0dce0084da10792cdd0))

### Docs
- Added issue and PR templates, contributing guide, and code of conduct ([a0cd3d3](https://github.com/api-ace/VanguardNX/commit/a0cd3d3e627e4e1690d7987912f031260c1d64cc))
