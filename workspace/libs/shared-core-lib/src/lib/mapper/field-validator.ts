import { isNilOrEmpty } from '@vanguard-nx/utils';
import { AutoMapNotFoundException } from './exceptions';
import { Logger } from './logger';
import { MappingRegistry } from './mapping-registry';
import { MetadataStore } from './metadata-store';
import { Constructor, IMappingMetadata, IValidationResult } from './types';
import { find, map } from '@vanguard-nx/utils';

export class ValidationResult implements IValidationResult {
  /**
   * Creates a new ValidationResult instance.
   * @param {IMappingMetadata[]} mappableFields - Array of mappable field metadata
   * @param {string[]} ignoredFields - Array of ignored field names
   */
  constructor(public readonly mappableFields: IMappingMetadata[], public readonly ignoredFields: string[]) {}
}

/**
 * Validates mappable fields between source and target classes.
 */
export class FieldValidator {
  /**
   * WeakMap-based cache for validation results.
   * Key: source constructor, Value: Map<target constructor, ValidationResult>
   * Using WeakMap allows constructors to be garbage collected when no longer referenced.
   */
  private static readonly validationCache = new WeakMap<Constructor, Map<Constructor, ValidationResult>>();

  /**
   * Validates mapped fields between source and target constructors with caching.
   * Caches results to prevent redundant computation during server boot/initialization.
   * @param {Constructor} sourceConstructor - Source class constructor
   * @param {Constructor} targetConstructor - Target class constructor
   * @param {MappingRegistry} registry - Mapping registry instance
   * @returns {ValidationResult} Validation result containing mappable and ignored fields
   * @throws {AutoMapNotFoundException} When no @AutoMap fields are found on either constructor
   */
  public static validateMappedFields(sourceConstructor: Constructor, targetConstructor: Constructor, registry: MappingRegistry): ValidationResult {
    // Attempt cache lookup for O(1) retrieval
    const sourceCache = this.validationCache.get(sourceConstructor);
    if (sourceCache?.has(targetConstructor)) {
      const cachedResult = sourceCache.get(targetConstructor)!;
      Logger.log(`[FieldValidator] Cache hit: ${sourceConstructor.name} -> ${targetConstructor.name}`);
      return cachedResult;
    }

    Logger.log(`[FieldValidator] Cache miss: ${sourceConstructor.name} -> ${targetConstructor.name}, computing validation`);

    // Compute validation result for new source-target pair
    const result = this.computeValidation(sourceConstructor, targetConstructor, registry);

    // Store result in cache for future lookups
    if (!this.validationCache.has(sourceConstructor)) {
      this.validationCache.set(sourceConstructor, new Map());
    }
    this.validationCache.get(sourceConstructor)!.set(targetConstructor, result);

    Logger.log(`[FieldValidator] Cached result for ${sourceConstructor.name} -> ${targetConstructor.name}`);
    return result;
  }

  /**
   * Performs the actual validation computation without caching.
   * Separated to maintain clear distinction between cached and computed operations.
   * @param {Constructor} sourceConstructor - Source class constructor
   * @param {Constructor} targetConstructor - Target class constructor
   * @param {MappingRegistry} registry - Mapping registry for custom mappings
   * @returns {ValidationResult} Computed validation result
   * @throws {AutoMapNotFoundException} When @AutoMap fields are missing
   */
  private static computeValidation(sourceConstructor: Constructor, targetConstructor: Constructor, registry: MappingRegistry): ValidationResult {
    // Retrieve metadata for both source and target classes
    const sourceFields: IMappingMetadata[] = MetadataStore.getFields(sourceConstructor);
    const targetFields: IMappingMetadata[] = MetadataStore.getFields(targetConstructor);

    // Validate that both classes have @AutoMap decorated fields
    if (isNilOrEmpty(sourceFields) || isNilOrEmpty(targetFields)) {
      throw new AutoMapNotFoundException(`@AutoMap fields missing in ${(isNilOrEmpty(sourceFields) ? sourceConstructor : targetConstructor).name}`);
    }

    // Retrieve custom mappings for source class if available
    const sourceSymbol = registry.findSymbol(sourceConstructor);
    const customMappings = sourceSymbol ? registry.getCustomMappings(sourceSymbol) : undefined;

    const mappableFields: IMappingMetadata[] = [];
    const ignoredFields: string[] = [];

    // Process each source field to determine mapping viability
    for (const sourceField of sourceFields) {
      // Look for matching target field by property name
      const targetField = find(targetFields, (tf) => tf.propertyKey === sourceField.propertyKey);

      // Field is mappable if target field exists OR custom mapping is defined
      if (targetField || customMappings?.has(sourceField.propertyKey)) {
        // Merge source and target metadata, preserving type information

        const mappingMeta: IMappingMetadata = {
          propertyKey: targetField?.propertyKey || sourceField.propertyKey, // fallback to source propertyKey as there will be case for custom mapping
          sourceType: sourceField?.type,
          targetType: targetField?.type,
        };

        mappableFields.push(mappingMeta);
      } else {
        // Field cannot be mapped - add to ignored list
        ignoredFields.push(sourceField.propertyKey);
      }
    }

    // Generate detailed logging for validation results
    const mappableKeys = map(mappableFields, 'propertyKey');
    const ignoredCount = ignoredFields.length;

    Logger.log(`[FieldValidator] ${sourceConstructor.name} -> ${targetConstructor.name}:`);
    Logger.log(`  - Mappable fields (${mappableFields.length}):`, mappableKeys);
    if (ignoredCount) Logger.log(`  - Ignored fields (${ignoredCount}):`, ignoredFields);

    return new ValidationResult(mappableFields, ignoredFields);
  }
}
