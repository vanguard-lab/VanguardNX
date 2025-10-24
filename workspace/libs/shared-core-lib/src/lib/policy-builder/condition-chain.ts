import { IAbacActor, ICondition, IConditionGroup } from '../abac';
import { PolicyBuilder } from './policy-builder';
import { IConditionChain } from './types';

export class ConditionChain<
  TActor extends IAbacActor = IAbacActor,
  TResource extends string = string,
  TAction extends string = string,
  TRecord extends Record<string, any> = Record<string, any>,
  TMetadata extends Record<string, any> = Record<string, any>,
> implements IConditionChain<TActor, TResource, TAction, TRecord, TMetadata>
{
  constructor(
    private parent: PolicyBuilder<TActor, TResource, TAction, TRecord, TMetadata>,
    private target: Array<ICondition<TActor, TResource, TAction, TRecord, TMetadata> | IConditionGroup<TActor, TResource, TAction, TRecord, TMetadata>>,
  ) {}

  public add(condition: ICondition<TActor, TResource, TAction, TRecord, TMetadata>): this {
    this.target.push(condition);
    return this;
  }

  public addGroup(operator: 'AND' | 'OR', fn: (chain: IConditionChain<TActor, TResource, TAction, TRecord, TMetadata>) => void): this {
    const groupConditions: Array<ICondition<TActor, TResource, TAction, TRecord, TMetadata> | IConditionGroup<TActor, TResource, TAction, TRecord, TMetadata>> = [];
    const nestedChain = new ConditionChain<TActor, TResource, TAction, TRecord, TMetadata>(this.parent, groupConditions);
    fn(nestedChain);
    this.target.push({ operator, conditions: groupConditions });
    return this;
  }

  public end(): PolicyBuilder<TActor, TResource, TAction, TRecord, TMetadata> {
    return this.parent;
  }
}
