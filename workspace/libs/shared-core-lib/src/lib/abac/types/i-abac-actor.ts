import { IPermission } from './common';

export interface IAbacActor {
  permissions?: IPermission[];
  // Additional actor-specific fields can be added in extensions
}
