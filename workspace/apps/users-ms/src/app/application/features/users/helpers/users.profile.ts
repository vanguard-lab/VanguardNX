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

import { Injectable } from '@nestjs/common';
import { User } from '../domain';
import { AddUserRequest, GetUserRequest, GetUserResponse, UserTinyResponse } from '../models';
import { GetUserQuery, ListUsersQuery } from '../queries';
import { AddUserCommand } from '../commands';
import { InjectMapper, ITransmute, MapperProfile } from '@vanguard-nx/core';

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
export class UsersMapperProfile extends MapperProfile {
  /**
   * Creates a new UsersMapperProfile instance.
   *
   * @param mapper - The AutoMapper instance injected by NestJS
   */
  constructor(@InjectMapper() protected readonly mapper: ITransmute) {
    super(mapper);
  }

  /**
   * Returns the mapping profile function that configures all mappings.
   * This is the entry point for AutoMapper's configuration.
   *
   * @returns {MappingProfile} The mapping profile function
   */
  public override configure(): void {
    this.get();
    this.add();
    this.response();
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
  private get(): void {
    this.createMap(GetUserRequest, GetUserQuery);
    this.createMap(ListUsersQuery, User);
  }

  private add(): void {
    this.createMap(AddUserRequest, AddUserCommand);
    this.createMap(AddUserCommand, User);
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
  private response(): void {
    this.createMap(User, GetUserResponse);
    this.createMap(User, UserTinyResponse);
  }
}
