import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { Mapper } from '@automapper/core';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { InjectMapper } from '@automapper/nestjs';
import { CqrsMediator } from '@vanguard-nx/core';

import { GetUserQuery } from './queries';
import { User } from './domain';
import { GetUserRequest, GetUserResponse } from './models';

/**
 * Base path and API version for the Users controller.
 * @constant {string} CONTROLLER_PATH - Root route ('/users')
 * @constant {string} CONTROLLER_VERSION - API version
 */
const CONTROLLER_PATH = '/users';
const CONTROLLER_VERSION = '1';

/**
 * Strictly enforced User operations following strict architecture:
 * 1. CQRS pattern enforcement
 * 2. Auto-mapped DTOs
 * 3. Versioned APIs
 * 4. Compile-time OpenAPI documentation
 */
@ApiTags('users')
@Controller({ path: CONTROLLER_PATH, version: CONTROLLER_VERSION })
export class UsersController {
  /**
   * @constructor
   * @param {CqrsMediator} mediator - VanguardNX-enforced command mediator
   * @param {Mapper} mapper - AutoMapper instance (type-safe mappings)
   * @param {PinoLogger} logger - Structured logger with dependency tracing
   */
  constructor(
    protected readonly mediator: CqrsMediator,
    @InjectMapper() protected readonly mapper: Mapper,
    @InjectPinoLogger(UsersController.name)
    protected readonly logger: PinoLogger
  ) {}

  /**
   * Get user by ID
   * 1. Param → Query mapping validated upon receiving request
   * 2. Mediator enforces CQRS pattern
   * 3. Domain → Response mapping validated by automapper
   *
   * @ApiOperation { summary: 'Get User' } - OpenAPI metadata
   * @ApiOkResponse { type: GetUserResponse } - response metadata
   * @HttpCode 200 - Strict status code enforcement
   * @Get ':id' - Versioned endpoint
   * @param {GetUserRequest} model - Param-validated DTO
   * @returns {Promise<GetUserResponse>} - Type-safe response
   * @throws {MappingError} 500 - If DTO mapping fails
   */
  @ApiOperation({ summary: 'Get User' })
  @ApiOkResponse({ type: GetUserResponse })
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  public async getAddress(
    @Param() model: GetUserRequest
  ): Promise<GetUserResponse> {
    // AutoMapper validates GetUserRequest → GetUserQuery mapping at startup
    const query = this.mapper.map(model, GetUserRequest, GetUserQuery);

    // Mediator enforces CQRS - cannot call UserRepository directly
    const result = await this.mediator.execute<GetUserQuery, User>(query);

    // Domain → Response mapping validated by automapper config
    return this.mapper.map(result, User, GetUserResponse);
  }
}
