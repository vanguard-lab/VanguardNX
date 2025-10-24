import { IAbacActor } from './i-abac-actor';
import { ICondition } from './i-condition';
export interface IConditionGroup<
  TActor extends IAbacActor = IAbacActor,
  TResource extends string = string,
  TAction extends string = string,
  TRecord extends Record<string, any> = Record<string, any>,
  TMetadata extends Record<string, any> = Record<string, any>,
> {
  operator: 'AND' | 'OR';
  conditions: Array<ICondition<TActor, TResource, TAction, TRecord, TMetadata> | IConditionGroup<TActor, TResource, TAction, TRecord, TMetadata>>;
}
