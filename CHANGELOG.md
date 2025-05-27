# Changelog

All notable changes to this project will be documented in this file.

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
