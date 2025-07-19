export * from './users';

import { UsersController, UsersMapperProfile, CustomUserMapperProfile } from './users';
import UsersQueryHandler from './users/queries';
import UserCommandHandler from './users/commands';

export const Controllers = [UsersController];

export const QueryHandlers = [...UsersQueryHandler];
export const CommandHandlers = [...UserCommandHandler];
export const MappingProfiles = [UsersMapperProfile];
export const CustomMappings = [CustomUserMapperProfile];
