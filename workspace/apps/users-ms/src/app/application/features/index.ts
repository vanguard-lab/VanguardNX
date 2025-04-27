import { UsersController, UsersMapperProfile } from './users';
import UsersQueryHandler from './users/queries';

export const Controllers = [UsersController];

export const QueryHandlers = [...UsersQueryHandler];
export const MappingProfiles = [UsersMapperProfile];
