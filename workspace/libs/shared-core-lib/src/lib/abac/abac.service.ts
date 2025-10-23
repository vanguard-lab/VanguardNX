import { endsWith, every, filter, get, has, includes, isArray, map, orderBy, some, split, startsWith } from 'lodash';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { EConditionOperator } from './enums';
import { IAbacActor, IAbacService, ICondition, IConditionGroup, IPermission, IPolicy, IPolicyContext } from './types';

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
 * ║              Attribute-Based Access Control Service                       ║
 * ║                                                                           ║
 * ║  A flexible, policy-driven Access Control framework for fine-grained      ║
 * ║  access control. Supports condition evaluation, permission wildcards,     ║
 * ║  and complex logical operators.                                           ║
 * ║                                                                           ║
 * ║  Author: Vanguard Team                                                    ║
 * ║  Version: 1.0.0                                                           ║
 * ║                                                                           ║
 * ║                                                                           ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

/**
 * @abstract
 * @class AbacService
 * @template TActor - Actor type performing the action (must implement IAbacActor)
 * @template TAction - String union of possible actions
 * @template TResource - String union of resource types
 *
 * Core ABAC engine implementing policy-based access control with support for:
 * - Dynamic policy registration and evaluation
 * - Permission hierarchies with wildcard support (*:* for superuser)
 * - Complex condition evaluation (AND/OR groups, field comparisons)
 * - Batch permission checks (canAll, canAny)
 * - Template-based value resolution ({{actor.id}})
 *
 * The service uses a fluent API pattern: for(actor).on(resource).can(action)
 */
export abstract class AbacService<TActor extends IAbacActor = IAbacActor, TAction extends string = string, TResource extends string = string>
  implements IAbacService<TActor, TResource, TAction>
{
  /** Registered policies defining access rules */
  protected policies: Array<IPolicy<TActor, TResource, TAction>> = [];

  /** Current context built via API */
  protected context: Partial<IPolicyContext<TActor, TResource, TAction>> = {};

  constructor(@InjectPinoLogger(AbacService.name) protected readonly logger: PinoLogger) {
    this.policies = this.registerPolicies();
  }

  public for(actor: TActor): this {
    this.context = { actor, timestamp: Date.now() };
    return this;
  }

  public on<TRecord extends Record<string, any> = Record<string, any>>(resource: TResource, record?: TRecord): this {
    this.context.resource = resource;
    this.context.record = record;
    return this;
  }

  public with<TMetadata extends Record<string, any> = Record<string, any>>(metadata?: TMetadata): this {
    this.context.metadata = metadata;
    return this;
  }

  public async can(action: TAction): Promise<boolean> {
    this.context.action = action;
    return this.evaluate();
  }

  public async cannot(action: TAction): Promise<boolean> {
    return !(await this.can(action));
  }

  public async canAll(...actions: TAction[]): Promise<boolean> {
    const results = await Promise.all(map(actions, async (action) => this.can(action)));
    return results.every((result) => result);
  }

  public async canAny(...actions: TAction[]): Promise<boolean> {
    const results = await Promise.all(map(actions, async (action) => this.can(action)));
    return results.some((result) => result);
  }

  public async getAllowedActions(): Promise<TAction[]> {
    if (!this.context.actor || !this.context.resource) return [];

    const allActions = this.getAllActions();
    const results = await Promise.all(allActions.map(async (action) => ({ action, allowed: await this.can(action) })));
    return results.filter((r) => r.allowed).map((r) => r.action);
  }

  public hasPermission(permission: IPermission<TResource, TAction>): boolean {
    if (!this.context.actor) return false;

    const actorPermissions = this.context.actor.permissions || [];

    if (includes(actorPermissions, permission)) return true;

    const [resource] = split(permission, ':') as [TResource | '*', TAction | '*'];

    if (includes(actorPermissions, `${resource}:*` as IPermission<TResource, TAction>)) return true;

    if (includes(actorPermissions, '*:*' as IPermission<TResource, TAction>)) return true;

    return false;
  }

  public getMatchingPolicies(action?: TAction): Array<IPolicy<TActor, TResource, TAction>> {
    if (!this.context.actor || !this.context.resource) return [];

    const tempCtx: Partial<IPolicyContext<TActor, TResource, TAction>> = {
      ...this.context,
      action: action ?? this.context.action,
    };

    this.assertFullContext(tempCtx);

    const ctx = tempCtx;

    let filtered = filter(this.policies, (policy) => this.policyMatchesContext(policy, ctx));

    // return filtered.sort((a, b) => (b.priority || 0) - (a.priority || 0));
    return orderBy(filtered, ['priority'], ['desc']);
  }

  public getEffectivePermissions(resource: TResource): Array<IPermission<TResource, TAction>> {
    if (!this.context.actor) return [];

    const actorPermissions = this.context.actor.permissions || [];

    return filter(actorPermissions, (p) => p === '*:*' || startsWith(p, `${resource}:`) || startsWith(p, '*:')) as Array<IPermission<TResource, TAction>>;
  }

  /**
   * TypeScript assertion to ensure context has all required fields.
   * Throws descriptive errors for missing context components.
   *
   * @param ctx - Partial context to validate
   * @throws Error if required fields are missing
   */
  protected assertFullContext(ctx: Partial<IPolicyContext<TActor, TResource, TAction>>): asserts ctx is IPolicyContext<TActor, TResource, TAction> {
    if (!ctx.action) throw new Error('Action is required');
    if (!ctx.resource) throw new Error('Resource is required');
    if (!ctx.actor) throw new Error('Actor context is required');
  }

  /**
   * Core policy evaluation algorithm.
   *
   * Evaluation order:
   * 1. Validate context completeness
   * 2. Find matching policies (by permission pattern)
   * 3. Check DENY policies first (security-first approach)
   * 4. Check ALLOW policies
   * 5. Default deny if no explicit allow
   *
   * @returns boolean - true if action is allowed, false otherwise
   */
  protected async evaluate(): Promise<boolean> {
    if (!this.context.actor || !this.context.resource || !this.context.action) {
      return false;
    }

    const ctx = this.context as IPolicyContext<TActor, TResource, TAction>;

    if (ctx.record) {
      ctx.record._vanguard_abac_action = ctx.action;
    }

    const matchingPolicies = this.getMatchingPolicies(ctx.action);

    const denyPolicies = filter(matchingPolicies, { effect: 'deny' });
    const allowPolicies = filter(matchingPolicies, (p) => !p.effect || p.effect === 'allow');

    const anyDeny = await Promise.all(map(denyPolicies, async (policy) => this.evaluatePolicyConditions(policy, ctx)));
    if (some(anyDeny)) return false;

    const anyAllow = await Promise.all(map(allowPolicies, async (policy) => this.evaluatePolicyConditions(policy, ctx)));
    if (some(anyAllow)) return true;

    return false;
  }

  /**
   * Check if a policy's permission pattern matches the current context.
   *
   * Permission matching rules:
   * - *:* matches everything
   * - resource:action matches exactly
   * - resource:* matches all actions on resource
   * - *:action matches action on all resources
   *
   * @param policy - Policy to check
   * @param ctx - Current context
   * @returns true if policy applies to this context
   */
  protected policyMatchesContext(policy: IPolicy<TActor, TResource, TAction>, ctx: IPolicyContext<TActor, TResource, TAction>): boolean {
    const permission = `${ctx.resource}:${ctx.action}` as IPermission<TResource, TAction>;

    if (policy.permission === permission || policy.permission === '*:*') return true;

    const [policyRes, policyAct] = policy.permission.split(':') as [TResource, TAction];
    const [ctxRes, ctxAct] = [ctx.resource, ctx.action] as [TResource, TAction];

    // Wildcard handling: resource or action
    return (policyRes === ctxRes && policyAct === '*') || (policyRes === '*' && policyAct === ctxAct);
  }

  /**
   * Evaluate all conditions for a policy to determine if it applies.
   *
   * Checks in order:
   * 1. Required permissions (actor must have all listed permissions)
   * 2. Scope conditions (resource-level filters)
   * 3. Policy conditions (field-level comparisons)
   *
   * @param policy - Policy to evaluate
   * @param ctx - Current context
   * @returns true if all conditions pass
   */
  protected async evaluatePolicyConditions(policy: IPolicy, ctx: IPolicyContext<TActor, TResource, TAction>): Promise<boolean> {
    if (policy.requiredPermissions) {
      const hasAllPermissions = every(policy.requiredPermissions, (perm) => this.hasPermission(perm as IPermission<TResource, TAction>));
      if (!hasAllPermissions) return false;
    }

    if (policy.scope?.conditions) {
      if (!ctx.record) return false; //TODO: why am i checking record data for scope...does this even make sense?
      const scopeValid = await this.evaluateConditions(policy.scope.conditions, ctx);
      if (!scopeValid) return false;
    }

    if (!policy.conditions || policy.conditions.length === 0) return true;
    if (!ctx.record && policy.conditions.length > 0) return false;

    return this.evaluateConditionList(policy.conditions, ctx);
  }

  /**
   * Evaluate a list of conditions or condition groups.
   * Default behavior is AND logic (all must pass).
   *
   * @param conditions - Array of conditions or condition groups
   * @param ctx - Current context
   * @returns true if all conditions pass
   */
  protected async evaluateConditionList(conditions: Array<ICondition | IConditionGroup>, ctx: IPolicyContext<TActor, TResource, TAction>): Promise<boolean> {
    const results = await Promise.all(map(conditions, async (item) => (this.isConditionGroup(item) ? this.evaluateConditionGroup(item, ctx) : this.evaluateCondition(item, ctx))));
    return every(results);
  }

  /**
   * Type guard to check if an item is a condition group (has operator).
   *
   * @param item - Condition or group to check
   * @returns true if item is a condition group
   */
  protected isConditionGroup(item: ICondition<TActor, TResource, TAction> | IConditionGroup<TActor, TResource, TAction>): item is IConditionGroup {
    return item.operator && (item.operator === 'AND' || item.operator === 'OR');
  }

  /**
   * Evaluate a condition group with AND/OR logic.
   * Supports nested groups for complex boolean expressions.
   *
   * @param group - Condition group with operator
   * @param ctx - Current context
   * @returns true if group evaluation passes
   */
  protected async evaluateConditionGroup(group: IConditionGroup, ctx: IPolicyContext<TActor, TResource, TAction>): Promise<boolean> {
    const results = await Promise.all(
      map(group.conditions, async (item) => (this.isConditionGroup(item) ? this.evaluateConditionGroup(item, ctx) : this.evaluateCondition(item, ctx))),
    );

    return group.operator === 'OR' ? some(results) : every(results);
  }

  /**
   * Evaluate multiple simple conditions with AND logic.
   * Helper for backwards compatibility.
   *
   * @param conditions - Array of conditions
   * @param ctx - Current context
   * @returns true if all conditions pass
   */
  protected async evaluateConditions(conditions: ICondition[], ctx: IPolicyContext<TActor, TResource, TAction>): Promise<boolean> {
    const results = await Promise.all(map(conditions, async (cond) => this.evaluateCondition(cond, ctx)));
    return every(results);
  }

  /**
   * Evaluate a single condition against the context.
   *
   * Process:
   * 1. Extract record value (or actor attribute if field starts with "actor.")
   * 2. Resolve template values ({{actor.id}})
   * 3. Apply transform function if defined
   * 4. Apply comparison operator
   *
   * @param cond - Condition to evaluate
   * @param ctx - Current context
   * @returns true if condition passes
   */
  protected async evaluateCondition(cond: ICondition, ctx: IPolicyContext<TActor, TResource, TAction>): Promise<boolean> {
    let fieldValue = await this.processTemplate(cond.field, ctx, cond.transformField);
    let compareValue = await this.processTemplate(cond.value, ctx, cond.transformValue);

    const res = this.applyOperator(fieldValue, cond.operator, compareValue);

    this.logger.info(`Condition check -> field: "${cond.field}", actual: [${fieldValue}], operator: "${cond.operator}", expected: [${compareValue}]  result: ${res}`);

    return res;
  }

  /**
   * Resolves a template string or returns a literal value.
   * If the input is a template (e.g., "{{actor.id}}"), it extracts the path
   * and retrieves the corresponding value from the policy context.
   * If the field does not exist in the context, logs an error.
   *
   * If the input is not a template, returns the value as-is.
   *
   * Examples:
   *   - processTemplate("{{actor.id}}", ctx) resolves to ctx.actor.id
   *   - processTemplate("staticValue", ctx) resolves to "staticValue"
   *
   * @param pathOrValue Template string or literal value
   * @param ctx Current policy context
   * @returns Resolved value from context or the literal input
   */
  protected async processTemplate(
    pathOrValue: unknown,
    context: IPolicyContext<TActor, TResource, TAction>,
    transform?: (value: any, context: IPolicyContext<TActor, TResource, TAction>) => any | Promise<any>,
  ): Promise<any> {
    const value = this.isTemplate(pathOrValue) ? this.resolveTemplateValue(pathOrValue, context) : pathOrValue;

    return transform ? await transform(value, context) : value;
  }

  protected resolveTemplateValue(template: string, context: IPolicyContext<TActor, TResource, TAction>): any {
    const fieldPath = this.resolveTemplatePath(template);
    const value = get(context, fieldPath);

    if (!has(context, fieldPath)) {
      this.logger.error(this.formatErrorMessage(fieldPath, context));
    }

    return value;
  }

  protected formatErrorMessage(fieldPath: string, context: IPolicyContext<TActor, TResource, TAction>): string {
    const recordFields = Object.keys(context.record || {}).join(', ');
    const metadataFields = Object.keys(context.metadata || {}).join(', ');
    const action = context.record?._vanguard_abac_action || 'unknown';

    return [
      `ABAC condition failure: field "${fieldPath}" not found in context.`,
      `Available record fields: [${recordFields}]`,
      `Metadata fields: [${metadataFields}]`,
      `Action: "${action}"`,
    ].join('\n');
  }

  /**
   * Checks if the provided value is a template string.
   * Template strings follow the format: {{path.to.value}}.
   *
   * Examples:
   *   - "{{actor.id}}" = true
   *   - "user.id"      = false
   *
   * @param path Value to check
   * @returns True if the value is a template string, false otherwise
   */
  protected isTemplate(path: unknown): path is string {
    return typeof path === 'string' && startsWith(path, '{{') && endsWith(path, '}}');
  }

  /**
   * Extracts a raw field path from a template string.
   * Expected template format: {{path.to.value}}
   * @param template Template containing a context path
   * @returns Cleaned path string usable for property access
   */
  protected resolveTemplatePath(template: string): string {
    const res = template.replace(/{{|}}/g, '').trim();
    console.log(`resolving path from ${template} to ${res}`);
    return res;
  }

  /**
   * Apply comparison operator to values.
   *
   * Supported operators:
   * - eq: equality
   * - neq: inequality
   * - gt/gte: greater than (or equal)
   * - lt/lte: less than (or equal)
   * - in/notIn: array membership
   * - contains: substring/array contains
   * - startsWith/endsWith: string prefix/suffix
   * - exists/notExists: null/undefined check
   * - between: range check [min, max]
   * - matches: regex pattern match
   *
   * @param recordValue - Value from record
   * @param operator - Comparison operator
   * @param compareValue - Value to compare against
   * @returns true if comparison succeeds
   */
  // TODO: test all operators
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  protected applyOperator(recordValue: any, operator: EConditionOperator, compareValue: any): boolean {
    switch (operator) {
      case EConditionOperator.Eq:
        return recordValue === compareValue;

      case EConditionOperator.Neq:
        return recordValue !== compareValue;

      case EConditionOperator.Gt:
        return recordValue > compareValue;

      case EConditionOperator.Gte:
        return recordValue >= compareValue;

      case EConditionOperator.Lt:
        return recordValue < compareValue;

      case EConditionOperator.Lte:
        return recordValue <= compareValue;

      case EConditionOperator.In:
        if (isArray(compareValue)) return compareValue.includes(recordValue);
        if (isArray(recordValue)) return compareValue.some((v: any) => recordValue.includes(v));
        return false;

      case EConditionOperator.NotIn:
        if (isArray(compareValue)) return !compareValue.includes(recordValue);
        if (isArray(recordValue)) return !compareValue.some((v: any) => recordValue.includes(v));
        return false;

      case EConditionOperator.Contains:
        if (isArray(recordValue)) return recordValue.includes(compareValue);
        return String(recordValue).includes(String(compareValue));

      case EConditionOperator.StartsWith:
        return String(recordValue).startsWith(String(compareValue));

      case EConditionOperator.EndsWith:
        return String(recordValue).endsWith(String(compareValue));

      case EConditionOperator.Exists:
        return recordValue !== undefined && recordValue !== null;

      case EConditionOperator.NotExists:
        return recordValue === undefined || recordValue === null;

      case EConditionOperator.Between:
        return (
          isArray(compareValue) &&
          // eslint-disable-next-line @typescript-eslint/no-magic-numbers
          compareValue.length === 2 &&
          recordValue >= compareValue[0] &&
          recordValue <= compareValue[1]
        );

      case EConditionOperator.Matches:
        if (typeof compareValue === 'string') {
          try {
            const regex = new RegExp(compareValue);
            return regex.test(String(recordValue));
          } catch {
            return false;
          }
        }
        return false;
    }
  }

  /**
   * Get all possible actions in the system.
   * Typically returns all values from a domain-specific action enum.
   * Used by getAllowedActions() to enumerate permissions.
   *
   * @returns Array of all possible actions
   */
  protected abstract getAllActions(): TAction[];

  /**
   * Register and return all policies for this ABAC instance.
   * Called during constructor initialization.
   * Subclasses define their rules here.
   *
   * @returns Array of policies to enforce
   */
  protected abstract registerPolicies(): Array<IPolicy<TActor, TResource, TAction>>;
}
