import { IAbacActor, IPermission, IPolicy } from '../abac';
import { ConditionChain } from './condition-chain';
import { IConditionChain, IPolicyBuilder } from './types';

export class PolicyBuilder<
  TActor extends IAbacActor = IAbacActor,
  TResource extends string = string,
  TAction extends string = string,
  TRecord extends Record<string, any> = Record<string, any>,
  TMetadata extends Record<string, any> = Record<string, any>,
> implements IPolicyBuilder<TActor, TResource, TAction, TRecord, TMetadata>
{
  private policy: Partial<IPolicy<TActor, TResource, TAction>> = {};

  public withId(id: string, description?: string): this {
    this.policy.id = id;
    this.policy.description = description;
    return this;
  }

  public withPermission(permission: IPermission<TResource, TAction>): this {
    this.policy.permission = permission;
    return this;
  }

  public withEffect(effect: 'allow' | 'deny'): this {
    this.policy.effect = effect;
    return this;
  }

  public withPriority(priority: number): this {
    this.policy.priority = priority;
    return this;
  }

  public validFrom(date: Date | string | number): this {
    const timestamp = typeof date === 'number' ? date : new Date(date).getTime();
    this.policy.validFrom = timestamp;
    return this;
  }

  public validUntil(date: Date | string | number): this {
    const timestamp = typeof date === 'number' ? date : new Date(date).getTime();
    this.policy.validUntil = timestamp;
    return this;
  }

  public conditions(): IConditionChain<TActor, TResource, TAction, TRecord, TMetadata> {
    if (!this.policy.conditions) {
      this.policy.conditions = [];
    }
    return new ConditionChain<TActor, TResource, TAction, TRecord, TMetadata>(this, this.policy.conditions);
  }

  public build(): IPolicy<TActor, TResource, TAction> {
    if (!this.policy?.id) throw new Error('Policy ID is required');
    if (!this.policy?.permission) throw new Error('Policy permission is required');
    const built = this.policy as IPolicy<TActor, TResource, TAction>;
    this.reset();
    return built;
  }

  /**
   * Resets the builder state for reuse.
   * @internal
   * Clears all accumulated policy properties
   */
  private reset(): void {
    this.policy = {};
  }
}
