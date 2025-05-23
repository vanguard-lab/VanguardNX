import { IBaseRepo } from '@vanguard-nx/core';
import { User } from '../domain';

export const USER_REPO = 'IUserRepo';

/**
 * IUsersRepository
 *
 * Interface definition for user repository operations.
 * Enforced through DI — no concrete implementation leakage.
 * Used by:
 * - Command Handlers
 * - Query Handlers
 *
 */
export interface IUserRepo extends IBaseRepo<User, string> {
  listUsersAsync(): Promise<User[]>;
}
