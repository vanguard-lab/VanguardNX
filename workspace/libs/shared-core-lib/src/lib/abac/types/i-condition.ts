import { Awaitable, LooseString } from '../../types';
import { EConditionOperator } from '../enums';
import { FieldTemplate } from './common';
import { IAbacActor } from './i-abac-actor';
import { IPolicyContext } from './i-policy-context';

export interface ICondition<
  TActor extends IAbacActor = IAbacActor,
  TResource extends string = string,
  TAction extends string = string,
  TRecord extends Record<string, any> = Record<string, any>,
  TMetadata extends Record<string, any> = Record<string, any>,
> {
  field: FieldTemplate<TActor, TRecord, TMetadata> | LooseString;
  operator: EConditionOperator;
  value?: any;

  /**
   * Optional transformation applied to the *resolved value* from the `field` path.
   *
   * The `resolvedValue` parameter is the value obtained at runtime by crawling
   * the specified field template. Example:
   * ```ts
   * .add({
   *   field: '{{record.count}}', // runtime value might be '42'
   *   operator: EConditionOperator.Eq,
   *   transformField: (resolvedValue) => parseInt(resolvedValue, 10), // transform '42' -> 42
   *   value: 42
   * })
   * ```
   *
   * The `context` parameter provides access to actor, resource, metadata, record, and timestamp.
   */
  transformField?: (resolvedValue: any, context: IPolicyContext<TActor, TResource, TAction, TRecord, TMetadata>) => Awaitable<any>;

  /**
   * Optional transformation applied to the *condition value* before comparison.
   *
   * The `value` parameter is the condition's static value specified in the policy.
   * Example:
   * ```ts
   * .add({
   *   field: '{{record.count}}',
   *   operator: EConditionOperator.Eq,
   *   value: '42',
   *   transformValue: (val) => parseInt(val, 10) // transform '42' -> 42 for comparison
   * })
   * ```
   *
   * This ensures that the comparison between the resolved field value and the
   * condition value uses consistent types or formats.
   */
  transformValue?: (value: any, context: IPolicyContext<TActor, TResource, TAction, TRecord, TMetadata>) => Awaitable<any>;
}
