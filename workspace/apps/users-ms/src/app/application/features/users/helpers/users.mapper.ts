/**
 * ██╗   ██╗ █████╗ ███╗   ██╗ ██████╗ ██╗   ██╗ █████╗ ██████╗ ██████╗ ███╗   ██╗██╗  ██╗
 * ██║   ██║██╔══██╗████╗  ██║██╔════╝ ██║   ██║██╔══██╗██╔══██╗██╔══██╗████╗  ██║╚██╗██╔╝
 * ██║   ██║███████║██╔██╗ ██║██║  ███╗██║   ██║███████║██████╔╝██║  ██║██╔██╗ ██║ ╚███╔╝
 * ╚██╗ ██╔╝██╔══██║██║╚██╗██║██║   ██║██║   ██║██╔══██║██╔══██╗██║  ██║██║╚██╗██║ ██╔██╗
 *  ╚████╔╝ ██║  ██║██║ ╚████║╚██████╔╝╚██████╔╝██║  ██║██║  ██║██████╔╝██║ ╚████║██╔╝ ██╗
 *   ╚═══╝  ╚═╝  ╚═╝╚═╝  ╚═══╝ ╚═════╝  ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝ ╚═╝  ╚═══╝╚═╝  ╚═╝
 *
 * @module Users
 * @description AutoMapper profile for mapping between User domain entities and DTOs
 * @author VanguardNx Team
 * @version 1.0.0
 */

import { createMap, Mapper, MappingProfile } from '@automapper/core';
import { AutomapperProfile, InjectMapper as IMpr } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { User } from '../domain';
import { AddUserRequest, GetUserRequest, GetUserResponse, UserTinyResponse } from '../models';
import { GetUserQuery, ListUsersQuery } from '../queries';
import { AddUserCommand } from '../commands';
import { InjectMapper, MapperProfile, ObjectMapper } from '@vanguard-nx/core';

/**
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │                         USERS MAPPER PROFILE                            │
 * ├─────────────────────────────────────────────────────────────────────────┤
 * │ Handles the AutoMapper configuration for the Users module.              │
 * │ Implements mapping between API DTOs and domain objects.                 │
 * │                                                                         │
 * │ Maps:                                                                   │
 * │  - GetUserRequest → GetUserQuery (for incoming requests)                │
 * │  - User → GetUserResponse (for outgoing responses)                      │
 * └─────────────────────────────────────────────────────────────────────────┘
 */

@Injectable()
export class UsersMapperProfile extends AutomapperProfile {
  /**
   * Creates a new UsersMapperProfile instance.
   *
   * @param mapper - The AutoMapper instance injected by NestJS
   */
  constructor(@IMpr() mapper: Mapper) {
    super(mapper);
  }

  /**
   * Returns the mapping profile function that configures all mappings.
   * This is the entry point for AutoMapper's configuration.
   *
   * @returns {MappingProfile} The mapping profile function
   */
  public override get profile(): MappingProfile {
    return (mapper) => {
      this.get(mapper);
      this.add(mapper);
      this.response(mapper);
    };
  }

  /**
   * ┌────────────────────────────────────────────┐
   * │              REQUEST MAPPING               │
   * └────────────────────────────────────────────┘
   *
   * Maps the Request DTO to Query or Command object.
   * Used when handling incoming API requests.
   *
   * @param mapper - The AutoMapper instance
   */
  private get(mapper: Mapper): void {
    createMap(mapper, GetUserRequest, GetUserQuery);
    createMap(mapper, ListUsersQuery, User);
  }

  private add(mapper: Mapper): void {
    createMap(mapper, AddUserRequest, AddUserCommand);
    createMap(mapper, AddUserCommand, User);
  }

  /**
   * ┌────────────────────────────────────────────┐
   * │             RESPONSE MAPPING               │
   * └────────────────────────────────────────────┘
   *
   * Maps the domain entity to Response DTO.
   * Used when sending responses back to clients.
   *
   * @param mapper - The AutoMapper instance
   */
  private response(mapper: Mapper): void {
    createMap(mapper, User, GetUserResponse);
    createMap(mapper, User, UserTinyResponse);
  }
}

@Injectable()
export class CustomUserMapperProfile extends MapperProfile {
  constructor(@InjectMapper() protected readonly mapper: ObjectMapper) {
    console.log('##################################################### it got registered');
    super(mapper);
  }

  protected configure(): void {
    this.createMap(User, ListUsersQuery);
  }
}
