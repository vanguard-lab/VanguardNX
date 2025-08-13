import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { CqrsMediator, InjectMapper, IMapper } from '@vanguard-nx/core';
import { AddUserCommand, EditUserCommand } from './commands';
import { User } from './domain';
import { AddUserRequest, GetUserRequest, GetUserResponse, UserTinyResponse } from './models';
import { GetUserQuery, ListUsersQuery } from './queries';
import { EditUserRequest } from './models/edit-user.request';

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
    @InjectMapper() protected readonly mapper: IMapper,
    @InjectPinoLogger(UsersController.name) protected readonly logger: PinoLogger,
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
  @Get('get/:id')
  public async getUser(@Param() model: GetUserRequest): Promise<GetUserResponse> {
    // AutoMapper validates GetUserRequest → GetUserQuery mapping at startup
    const query = this.mapper.map(model, GetUserRequest, GetUserQuery);

    // Mediator enforces CQRS - cannot call UserRepository directly
    const result = await this.mediator.execute<GetUserQuery, User>(query);

    // Domain → Response mapping validated by automapper config
    return this.mapper.map(result, User, GetUserResponse);
  }

  /**
   * List all users
   * 1. CQRS query (ListUsersQuery) called without filter support
   * 2. Mediator dispatches query to handler
   * 3. Domain → DTO mapping validated via AutoMapper
   *
   * @ApiOperation { summary: 'List Users' } - OpenAPI metadata
   * @ApiOkResponse { type: [UserTinyResponse] } - Response metadata
   * @HttpCode 200 - Strict status code enforcement
   * @Get 'list' - Versioned endpoint
   * @returns {Promise<UserTinyResponse[]>} - Array of slim user DTOs
   */
  @ApiOperation({ summary: 'List Users' })
  @ApiOkResponse({ type: [UserTinyResponse] })
  @HttpCode(HttpStatus.OK)
  @Get('list')
  public async listUsers(): Promise<UserTinyResponse[]> {
    const query = new ListUsersQuery(); // as of now there is no filtering feature available so calling down the query directly instead of mapping with request class
    const result = await this.mediator.execute<ListUsersQuery, User[]>(query);

    return this.mapper.mapArray(result, User, UserTinyResponse);
  }

  /**
   * Create a new user
   * 1. Request DTO (AddUserRequest) → Command mapping via AutoMapper
   * 2. Mediator enforces CQRS - sends command to handler
   * 3. Result mapped to minimal response DTO
   *
   * @ApiOperation { summary: 'Create new User' } - OpenAPI metadata
   * @ApiOkResponse { type: UserTinyResponse } - Response metadata
   * @HttpCode 201 - Created response
   * @Post '/' - Versioned endpoint
   * @param {AddUserRequest} model - Body-validated request DTO
   * @returns {Promise<UserTinyResponse>} - Minimal response payload
   * @throws {MappingError} 500 - If DTO mapping fails
   */
  @ApiOperation({ summary: 'Create new User' })
  @ApiOkResponse({ type: UserTinyResponse })
  @HttpCode(HttpStatus.CREATED)
  @Post()
  public async createUser(@Body() model: AddUserRequest): Promise<UserTinyResponse> {
    const command = this.mapper.map(model, AddUserRequest, AddUserCommand);
    const result = await this.mediator.execute<AddUserCommand, User>(command);

    return this.mapper.map(result, User, UserTinyResponse);
  }

  /**
   * Update existing user
   * 1. Request DTO (EditUserRequest) → Command mapping via AutoMapper
   * 2. Mediator processes update command through CQRS handler
   * 3. Updated entity mapped to full response DTO
   *
   * @ApiOperation { summary: 'Update User' } - OpenAPI metadata
   * @ApiOkResponse { type: GetUserResponse } - Response metadata
   * @HttpCode 200 - OK response
   * @Patch '/edit' - Partial update endpoint
   * @param {EditUserRequest} model - Body-validated request DTO
   * @returns {Promise<GetUserResponse>} - Full user response payload
   * @throws {MappingError} 500 - If DTO mapping fails
   * @throws {UserNotFound} 404 - If user does not exist
   */
  @ApiOperation({ summary: 'Update User' })
  @ApiOkResponse({ type: GetUserResponse })
  @HttpCode(HttpStatus.OK)
  @Patch('/edit')
  public async editUser(@Body() model: EditUserRequest): Promise<GetUserResponse> {
    const command = this.mapper.map(model, EditUserRequest, EditUserCommand);
    const res = await this.mediator.execute<EditUserCommand, User>(command);
    return this.mapper.map(res, User, GetUserResponse);
  }
}
