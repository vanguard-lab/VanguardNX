import { IPermission } from './common';
import { IAbacActor } from './i-abac-actor';
import { ICondition } from './i-condition';
import { IConditionGroup } from './i-condition-group';

export interface IPolicy<
  TActor extends IAbacActor = IAbacActor,
  TResource extends string = string,
  TAction extends string = string,
  TRecord extends Record<string, any> = Record<string, any>,
  TMetadata extends Record<string, any> = Record<string, any>,
> {
  id: string;
  description?: string;
  permission: IPermission<TResource, TAction>;
  effect?: 'allow' | 'deny';
  priority?: number;
  validFrom?: number;
  validUntil?: number;
  requiredPermissions?: Array<IPermission<TResource, TAction>>;
  requiredClearanceLevel?: number;
  scope?: {
    conditions: Array<ICondition<TActor, TResource, TAction, TRecord, TMetadata>>;
  };
  conditions?: Array<ICondition<TActor, TResource, TAction, TRecord, TMetadata> | IConditionGroup<TActor, TResource, TAction, TRecord, TMetadata>>;
}
