import { Constructor, Dictionary, IMappingMetadata, ITransformationStrategy, ITransmute } from './types';
import { Logger } from './logger';

/**
 * Handles the actual transformation of objects between classes with caching.
 */
export class ObjectTransformer {
  /**
   * Cache for transformation strategies based on source constructor + target constructor + field metadata.
   * Key: source constructor, Value: Map<target constructor, ITransformationStrategy>
   * Using WeakMap allows constructors to be garbage collected.
   */
  private static readonly transformationCache = new WeakMap<Constructor, Map<Constructor, ITransformationStrategy>>();

  /**
   * Cached transformation strategy containing pre-computed field operations.
   */

  /**
   * Transforms a source object to target class instance with caching optimization.
   * Caches transformation strategies to avoid recomputing field mapping logic.
   * @template TSource - Source type extending Dictionary
   * @template TDestination - Destination type extending Dictionary
   * @param {TSource} source - Source object to transform
   * @param {Constructor<TDestination>} targetConstructor - Target class constructor
   * @param {IMappingMetadata[]} mappableFields - Array of mappable field metadata
   * @param {Map<string, function(any): any>} [customMappings] - Optional custom mapping functions
   * @param {ITransmute} [mapper] - Optional ObjectMapper for nested mappings
   * @returns {TDestination} Transformed target object
   */
  public static transform<TSource extends Dictionary<TSource>, TDestination extends Dictionary<TDestination>>(
    source: TSource,
    targetConstructor: Constructor<TDestination>,
    mappableFields: IMappingMetadata[],
    customMappings?: Map<string, (source: any) => any>,
    mapper?: ITransmute,
  ): TDestination {
    const sourceConstructor = source.constructor as Constructor;

    let strategy = this.getTransformationStrategy(sourceConstructor, targetConstructor);

    if (!strategy) {
      Logger.log(`[ObjectTransformer] Cache miss: ${sourceConstructor.name} -> ${targetConstructor.name}, computing strategy`);
      strategy = this.computeTransformationStrategy(mappableFields, customMappings);
      this.cacheTransformationStrategy(sourceConstructor, targetConstructor, strategy);
      Logger.log(`[ObjectTransformer] Cached strategy for ${sourceConstructor.name} -> ${targetConstructor.name}`);
    } else {
      Logger.log(`[ObjectTransformer] Cache hit: ${sourceConstructor.name} -> ${targetConstructor.name}`);
    }

    return this.executeTransformation(source, targetConstructor, strategy, mapper);
  }

  /**
   * Retrieves cached transformation strategy if available.
   * @param {Constructor} sourceConstructor - Source class constructor
   * @param {Constructor} targetConstructor - Target class constructor
   * @returns {ITransformationStrategy | undefined} Cached strategy or undefined
   */
  private static getTransformationStrategy(sourceConstructor: Constructor, targetConstructor: Constructor): ITransformationStrategy | undefined {
    const sourceCache = this.transformationCache.get(sourceConstructor);
    return sourceCache?.get(targetConstructor);
  }

  /**
   * Caches transformation strategy for future use.
   * @param {Constructor} sourceConstructor - Source class constructor
   * @param {Constructor} targetConstructor - Target class constructor
   * @param {ITransformationStrategy} strategy - Computed transformation strategy
   */
  private static cacheTransformationStrategy(sourceConstructor: Constructor, targetConstructor: Constructor, strategy: ITransformationStrategy): void {
    if (!this.transformationCache.has(sourceConstructor)) {
      this.transformationCache.set(sourceConstructor, new Map());
    }
    this.transformationCache.get(sourceConstructor)!.set(targetConstructor, strategy);
  }

  /**
   * Computes transformation strategy by analyzing field metadata.
   * Pre-categorizes fields by transformation type for efficient execution.
   * @param {IMappingMetadata[]} mappableFields - Array of mappable field metadata
   * @param {Map<string, function(any): any>} [customMappings] - Optional custom mapping functions
   * @returns {ITransformationStrategy} Computed transformation strategy
   */
  private static computeTransformationStrategy(mappableFields: IMappingMetadata[], customMappings?: Map<string, (source: any) => any>): ITransformationStrategy {
    const strategy: ITransformationStrategy = {
      customFields: new Map(),
      nestedArrayFields: [],
      nestedObjectFields: [],
      directCopyFields: [],
    };

    for (const { propertyKey: fieldName, sourceType, targetType } of mappableFields) {
      if (customMappings?.has(fieldName)) {
        strategy.customFields.set(fieldName, customMappings.get(fieldName)!);
        continue;
      }

      if (sourceType && Array.isArray(targetType) && targetType.length === 1) {
        strategy.nestedArrayFields.push({
          fieldName,
          elementType: targetType[0],
        });
        continue;
      }

      if (sourceType && targetType && !Array.isArray(targetType)) {
        strategy.nestedObjectFields.push({
          fieldName,
          targetType: targetType,
        });
        continue;
      }

      strategy.directCopyFields.push(fieldName);
    }

    return strategy;
  }

  /**
   * Executes transformation using pre-computed strategy.
   * @template TSource - Source type extending Dictionary
   * @template TDestination - Destination type extending Dictionary
   * @param {TSource} source - Source object to transform
   * @param {Constructor<TDestination>} targetConstructor - Target class constructor
   * @param {ITransformationStrategy} strategy - Pre-computed transformation strategy
   * @param {ITransmute} [mapper] - Optional ObjectMapper for nested mappings
   * @returns {TDestination} Transformed target object
   */
  private static executeTransformation<TSource extends Dictionary<TSource>, TDestination extends Dictionary<TDestination>>(
    source: TSource,
    targetConstructor: Constructor<TDestination>,
    strategy: ITransformationStrategy,
    mapper?: ITransmute,
  ): TDestination {
    const target = new targetConstructor();
    Logger.log(`[ObjectTransformer] Executing cached transformation to ${targetConstructor.name}...`);

    let transformedCount = 0;

    // Process custom mapping fields
    for (const [fieldName, mappingFunction] of strategy.customFields) {
      const value = mappingFunction(source);
      (target as any)[fieldName] = value;
      Logger.log(`[ObjectTransformer] Applied custom mapping for '${fieldName}'`);
      transformedCount++;
    }

    // Process nested array fields
    if (mapper) {
      for (const { fieldName, elementType } of strategy.nestedArrayFields) {
        if (fieldName in source) {
          const sourceValue = (source as any)[fieldName];

          if (Array.isArray(sourceValue)) {
            (target as any)[fieldName] = sourceValue.map((item) => mapper.map(item, item.constructor, elementType));
            Logger.log(`[ObjectTransformer] Mapped array field '${fieldName}' with ${sourceValue.length} elements`);
          } else if (sourceValue) {
            (target as any)[fieldName] = [mapper.map(sourceValue, sourceValue.constructor, elementType)];
            Logger.log(`[ObjectTransformer] Wrapped single object in array for field '${fieldName}'`);
          }
          transformedCount++;
        }
      }

      // Process nested object fields
      for (const { fieldName, targetType } of strategy.nestedObjectFields) {
        if (fieldName in source) {
          const sourceValue = (source as any)[fieldName];
          if (sourceValue) {
            (target as any)[fieldName] = mapper.map(sourceValue, sourceValue.constructor, targetType);
            Logger.log(`[ObjectTransformer] Mapped nested field '${fieldName}' from ${sourceValue.constructor?.name} to ${targetType.name}`);
            transformedCount++;
          }
        }
      }
    }

    // Process direct copy fields
    for (const fieldName of strategy.directCopyFields) {
      if (fieldName in source) {
        const value = (source as any)[fieldName];
        (target as any)[fieldName] = value;
        Logger.log(`[ObjectTransformer] Mapped '${fieldName}'`);
        transformedCount++;
      } else {
        Logger.log(`[ObjectTransformer] Field '${fieldName}' not found in source - skipping`);
      }
    }

    Logger.log(`[ObjectTransformer] Completed cached transformation. Transformed ${transformedCount} fields.`);
    return target;
  }
}
