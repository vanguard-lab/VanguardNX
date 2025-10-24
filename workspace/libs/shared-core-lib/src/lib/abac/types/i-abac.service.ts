import { IPermission } from './common';
import { IAbacActor } from './i-abac-actor';
import { IPolicy } from './i-policy';

/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║                                                                           ║
 * ║                     ███████ ██████╗  █████╗  ██████╗                      ║
 * ║                     ██╔══██╗██╔══██╗██╔══██╗██╔════╝                      ║
 * ║                     ███████║██████╔╝███████║██║                           ║
 * ║                     ██╔══██║██╔══██╗██╔══██║██║                           ║
 * ║                     ██║  ██║██████╔╝██║  ██║╚██████╗                      ║
 * ║                     ╚═╝  ╚═╝╚═════╝ ╚═╝  ╚═╝ ╚═════╝                      ║
 * ║                                                                           ║
 * ║              ABAC Service Interface - Public API Contract                 ║
 * ║                                                                           ║
 * ║                                                                           ║
 * ║                                                                           ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

/**
 * @interface IAbacService
 * @template TActor - Actor type performing actions (must implement IAbacActor)
 * @template TResource - String union of resource types in the system
 * @template TAction - String union of possible actions
 *
 * Public contract for Attribute-Based Access Control service.
 * Defines fluent authorization API and permission inspection methods.
 *
 * Usage pattern:
 *   const authorized = abac.for(user).on('posts', post).can('delete');
 *
 * Features:
 * - Fluent chaining API for readability
 * - Batch permission checks (canAll, canAny)
 * - Permission introspection (getAllowedActions, getEffectivePermissions)
 * - Policy debugging (getMatchingPolicies)
 */
export interface IAbacService<TActor extends IAbacActor, TResource extends string = string, TAction extends string = string> {
  /**
   * Initialize actor.
   * First step in fluent chain.
   *
   * Sets the actor context and captures current timestamp for policies.
   *
   * @param actor - The actor attempting to perform an action
   * @returns this for method chaining
   *
   * @example
   * ```typescript
   * abac.for(currentUser).on('posts').can('create');
   * ```
   */
  for(actor: TActor): this;

  /**
   * Specify the resource and optional record to check authorization against.
   * Second step in fluent chain.
   *
   * The record parameter enables field-level conditions in policies.
   * Without a record, only permission-based policies can be evaluated.
   *
   * @param resource - Resource type being accessed (e.g., 'posts', 'comments')
   * @param record - Optional record data for condition evaluation
   * @returns this for method chaining
   *
   * @example
   * ```typescript
   * // Without record (permission-based only)
   * abac.for(user).on('posts').can('create');
   *
   * // With record (enables field conditions)
   * abac.for(user).on('posts', post).can('delete');
   * // Can now evaluate conditions like: post.authorId === user.id
   * ```
   */
  on(resource: TResource, record?: Record<string, any>): this;

  /**
   * Attaches arbitrary contextual metadata to the policy evaluation context.
   * This is an optional step in the fluent chain used to supply auxiliary data
   * that your own `transform` functions or custom evaluators can consume.
   *
   * The framework itself performs **no direct operations** on this metadata.
   * It simply stores the provided key-value pairs in `ctx.metadata`, allowing
   * advanced, user-defined access logic such as IP restriction, geolocation,
   * time-of-day limits, or request fingerprinting.
   *
   * @param metadata - Any serializable contextual information to attach
   * @returns this - Enables fluent chaining
   *
   * @example
   * ```typescript
   * abac
   * .for(user)
   * .on('admin-panel')
   * .with({ ip: req.ip, userAgent: req.headers['user-agent'] })
   * .can('access');
   * ```
   * // Later inside a transform:
   * ```typescript
   * transform: (value, ctx) => {
   * if (ctx.metadata?.ip !== '127.0.0.1') return 'localhost-only'; // cant think of a better example T_T
   * return value;
   * }
   * ```
   */
  with(metadata: Record<string, any>): this;

  /**
   * Check if the actor can perform the specified action.
   * Terminal method in fluent chain - triggers policy evaluation.
   *
   * Evaluation process:
   * 1. Find policies matching resource:action pattern
   * 2. Check DENY policies first (explicit denials always win)
   * 3. Check ALLOW policies
   * 4. Default to deny if no explicit allow found
   *
   * @param action - Action to authorize (e.g., 'read', 'update', 'delete')
   * @returns true if authorized, false otherwise
   *
   * @example
   * ```typescript
   * if (abac.for(user).on('posts', post).can('delete')) {
   *   await deletePost(post.id);
   * }
   * ```
   */
  can(action: TAction): Promise<boolean>;

  /**
   * Check if the actor cannot perform the specified action.
   * Inverse of can() for clearer negative checks.
   *
   * @param action - Action to check
   * @returns true if NOT authorized, false if authorized
   *
   * @example
   * ```typescript
   * if (abac.for(user).on('posts', post).cannot('delete')) {
   *   throw new ForbiddenError('Cannot delete this post');
   * }
   * ```
   */
  cannot(action: TAction): Promise<boolean>;

  /**
   * Check if actor can perform ALL specified actions (AND logic).
   * Useful for operations requiring multiple permissions.
   *
   * Short-circuits on first failure for performance.
   *
   * @param actions - Actions to check
   * @returns true only if ALL actions are authorized
   *
   * @example
   * ```typescript
   * // Require both read and update permissions
   * if (abac.for(user).on('posts', post).canAll('read', 'update')) {
   *   showEditButton();
   * }
   * ```
   */
  canAll(...actions: TAction[]): Promise<boolean>;

  /**
   * Check if actor can perform ANY of the specified actions (OR logic).
   * Useful for showing UI elements when user has at least one permission.
   *
   * Short-circuits on first success for performance.
   *
   * @param actions - Actions to check
   * @returns true if ANY action is authorized
   *
   * @example
   * ```typescript
   * // Show actions menu if user can do any action
   * if (abac.for(user).on('posts', post).canAny('update', 'delete', 'publish')) {
   *   showActionsMenu();
   * }
   * ```
   */
  canAny(...actions: TAction[]): Promise<boolean>;

  /**
   * Get all actions the actor can perform on the current resource/record.
   * Useful for dynamic UI generation showing only available actions.
   *
   * Evaluates every possible action in the system against current context.
   * Performance note: Caches if possible, but may be expensive for large action sets.
   *
   * @returns Array of authorized actions
   *
   * @example
   * ```typescript
   * const actions = abac.for(user).on('posts', post).getAllowedActions();
   * // Returns: ['read', 'update'] (not 'delete' if user doesn't own post)
   *
   * actions.forEach(action => {
   *   renderActionButton(action);
   * });
   * ```
   */
  getAllowedActions(): Promise<TAction[]>;

  /**
   * Check if actor has a specific permission in their permission set.
   * Direct permission check without policy evaluation.
   *
   * Supports wildcard patterns:
   * - Exact: "posts:delete" - specific permission
   * - Resource wildcard: "posts:*" - all actions on posts
   * - Global wildcard: "*:*" - superuser (all permissions)
   *
   * @param permission - Permission string in format "resource:action"
   * @returns true if actor has the permission
   *
   * @example
   * ```typescript
   * // Check exact permission
   * if (abac.for(user).hasPermission('posts:delete')) {
   *   console.log('User has delete permission');
   * }
   *
   * // Check for superuser
   * if (abac.for(user).hasPermission('*:*')) {
   *   console.log('User is superuser');
   * }
   * ```
   */
  hasPermission(permission: IPermission<TResource, TAction>): boolean;

  /**
   * Get all policies that match the current context and action.
   * Primarily for debugging, audit trails, and policy testing.
   *
   * Returns policies in evaluation order (sorted by priority, highest first).
   * Includes both ALLOW and DENY policies.
   *
   * @param action - Optional action override (defaults to context.action)
   * @returns Matching policies in priority order
   *
   * @example
   * ```typescript
   * const policies = abac.for(user).on('posts', post).getMatchingPolicies('delete');
   * console.log('Policies evaluated:', policies.map(p => p.id));
   * // Output: ['deny-others-posts', 'allow-own-posts']
   *
   * // Debug why authorization failed
   * const deniedPolicies = policies.filter(p => p.effect === 'deny');
   * console.log('Denied by:', deniedPolicies);
   * ```
   */
  getMatchingPolicies(action?: TAction): Array<IPolicy<TActor, TResource, TAction>>;

  /**
   * Get all permissions the actor has that apply to the specified resource.
   * Returns effective permissions considering wildcard expansion.
   *
   * Useful for understanding what an actor can do on a resource type.
   *
   * @param resource - Resource to check
   * @returns Array of applicable permissions
   *
   * @example
   * ```typescript
   * const perms = abac.for(user).getEffectivePermissions('posts');
   * // If user has 'posts:*', returns all post permissions
   * // If user has '*:*', returns all permissions
   * // Otherwise returns explicit post permissions
   *
   * console.log('User can:', perms);
   * // Output: ['posts:read', 'posts:create', 'posts:update']
   * ```
   */
  getEffectivePermissions(resource: TResource): Array<IPermission<TResource, TAction>>;

  // Note: The following are overridable protected methods in the abstract class.
  // They are included here for documentation purposes, but in TypeScript interfaces,
  // protected members cannot be defined.
  // Subclasses should override them directly in the class implementation if needed.
  //
  // protected evaluate(): boolean;
  // protected policyMatchesContext(policy: IPolicy, ctx: IPolicyContext<TActor, TResource, TAction>): boolean;
  // protected evaluatePolicyConditions(policy: IPolicy, ctx: IPolicyContext<TActor, TResource, TAction>): boolean;
  // protected evaluateConditionList(conditions: Array<ICondition<TActor, TResource, TAction> | IConditionGroup<TActor, TResource, TAction>>, ctx: IPolicyContext<TActor, TResource, TAction>): boolean;
  // protected isConditionGroup(item: any): item is IConditionGroup<TActor, TResource, TAction>;
  // protected evaluateConditionGroup(group: IConditionGroup<TActor, TResource, TAction>, ctx: IPolicyContext<TActor, TResource, TAction>): boolean;
  // protected evaluateConditions(conditions: ICondition<TActor, TResource, TAction>[], ctx: IPolicyContext<TActor, TResource, TAction>): boolean;
  // protected evaluateCondition(cond: ICondition<TActor, TResource, TAction>, ctx: IPolicyContext<TActor, TResource, TAction>): boolean;
  // protected resolveActorAttribute(actor: TActor, path: string): any;
  // protected resolveNestedPath(obj: any, path: string): any;
  // protected resolveTemplate(template: string, ctx: IPolicyContext<TActor, TResource, TAction>): any;
  // protected applyOperator(recordValue: any, operator: EConditionOperator, compareValue: any): boolean;
  // protected validateContext(context: Partial<IPolicyContext<TActor, TResource, TAction>>): asserts context is IPolicyContext<TActor, TResource, TAction>;
  // protected abstract getAllActions(): TAction[];
}
