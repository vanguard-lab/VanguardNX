import { IAbacActor, ICondition } from '../../abac';
import { IPolicyBuilder } from './i-policy-builder';

/**
 * Interface for building nested condition chains in ABAC policies.
 * Supports flat conditions and grouped conditions with AND/OR operators.
 *
 * ## FEATURES
 * - **Nested Groups**: Unlimited nesting of AND/OR condition groups
 * - **Fluent Chaining**: Add conditions and groups in sequence
 * - **Type Safe**: Maintains generic constraints from parent builder
 * - **Operator Support**: Boolean logic for complex rules
 */
export interface IConditionChain<
  TActor extends IAbacActor = IAbacActor,
  TResource extends string = string,
  TAction extends string = string,
  TRecord extends Record<string, any> = Record<string, any>,
  TMetadata extends Record<string, any> = Record<string, any>,
> {
  /**
   * Adds a single condition to the current chain level.
   * @param condition - Condition object with field, operator, and value
   * @returns This chain for further additions
   * @example .add({ operator: 'equals', field: 'actor.role', value: 'admin' })
   */
  add(condition: ICondition<TActor, TResource, TAction, TRecord, TMetadata>): this;

  /**
   * Begins a nested condition group with AND/OR operator.
   * @param operator - 'AND' (all conditions true) or 'OR' (any condition true)
   * @param fn - Callback receiving nested chain for adding conditions
   * @returns This chain (parent level) after group completes
   * @example
   * .addGroup('AND', nestedChain => {
   *   nestedChain.add({ field: 'actor.department', operator:'eq', value: 'hr' })
   *     .add({ field: '{{record.timeAfter}}', operator:'gt', value: 9 })
   * })
   */
  addGroup(operator: 'AND' | 'OR', fn: (chain: IConditionChain<TActor, TResource, TAction, TRecord, TMetadata>) => void): this;

  /**
   * Completes condition building and returns to parent PolicyBuilder.
   * @returns Parent PolicyBuilder instance
   */
  end(): IPolicyBuilder<TActor, TResource, TAction, TRecord, TMetadata>;
}
