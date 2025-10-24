import { IAbacActor, IPolicy, IPermission } from '../../abac';
import { IConditionChain } from './i-condition-chain';

/**
 * Interface for building ABAC (Attribute-Based Access Control) policies
 * using a fluent, chainable API pattern.
 *@example
 * ```typescript
 *const policy = new PolicyBuilder<IAbacActor, 'user' | 'file', 'read' | 'write'>()
 *     .withId('policy-1')
 *     .withDescription('Allow users to read files')
 *     .withPermission('file:read')
 *     .withEffect('allow')
 *     .withPriority(10)
 *     .validFrom(Date.now())
 *     .validUntil(Date.now() + 86400000)
 *     .conditions()
 *     .addGroup('AND', (chain) => {
 *       chain
 *         .add({ field: 'actor.role', operator: EConditionOperator.Eq, value: 'user' }) // user.role === user ?
 *         // AND
 *         .add({ field: 'actor.department', operator: EConditionOperator.Eq, value: ['hr', 'it'] }); // user.department in [hr,it] ?
 *     })
 *     .end()
 *    .build();
 * ```
 *
 * ## FEATURES
 * - **Fluent API**: Chainable methods for readable policy construction
 * - **Nested Conditions**: Support for AND/OR condition groups
 * - **Type Safety**: Generic constraints ensure correct resource/action types
 * - **Validation**: Required fields enforced at build time
 * - **Temporal Control**: Validity periods for time-bound policies
 */
export interface IPolicyBuilder<
  TActor extends IAbacActor = IAbacActor,
  TResource extends string = string,
  TAction extends string = string,
  TRecord extends Record<string, any> = Record<string, any>,
  TMetadata extends Record<string, any> = Record<string, any>,
> {
  /**
   * Sets the unique policy identifier.
   * @param id - Unique string identifier for the policy
   * @param description - Descriptive text explaining policy purpose
   * @returns This builder for chaining
   */
  withId(id: string, description?: string): this;

  /**
   * Sets the permission this policy applies to.
   * @param permission - Resource-action pair defining policy scope
   * @returns This builder for chaining
   */
  withPermission(permission: IPermission<TResource, TAction>): this;

  /**
   * Sets the policy effect (allow or deny).
   * @param effect - 'allow' grants access, 'deny' blocks access
   * @returns This builder for chaining
   */
  withEffect(effect: 'allow' | 'deny'): this;

  /**
   * Sets the evaluation priority (lower numbers = higher priority).
   * @param priority - Numeric priority for conflict resolution
   * @returns This builder for chaining
   */
  withPriority(priority: number): this;

  /**
   * Sets the start timestamp to be validated.
   * @param timestamp - Unix timestamp (milliseconds)
   * @returns This builder for chaining
   */
  validFrom(timestamp: number): this;

  /**
   * Sets the end timestamp to be validated.
   * @param timestamp - Unix timestamp (milliseconds)
   * @returns This builder for chaining
   */
  validUntil(timestamp: number): this;

  /**
   * Begins building conditional rules for policy evaluation.
   * @returns Condition chain builder for adding conditions/groups
   * @example
   * .conditions()
   *   .add({ type: 'equals', attribute: 'role', value: 'admin' })
   *   .end()
   */
  conditions(): IConditionChain<TActor, TResource, TAction, TRecord, TMetadata>;

  /**
   * Validates and constructs the final policy object.
   * @throws {Error} If required fields (id, permission) are missing
   * @returns Fully constructed, validated IPolicy object
   */
  build(): IPolicy<TActor, TResource, TAction, TRecord, TMetadata>;
}
