import { IPermission } from './common';

export interface IAbacUser {
  id: string;

  permissions: IPermission[];

  // Authorization attributes
  clearanceLevel?: number;

  metadata?: Record<string, any>;

  accessValidFrom?: number;
  accessValidUntil?: number;
}
