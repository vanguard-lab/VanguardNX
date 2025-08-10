import { Constructor } from './types';
import { Logger } from './logger';
import { IMappingMetadata } from './types/i-mapping-metadata';

/**
 * Central registry for field mapping metadata between constructors.
 * Stores per-class property mapping metadata and provides cached access
 * to resolved (flattened and deduplicated) field lists including inherited properties.
 */
export class MetadataStore {
  /**
   * Maps a class constructor to its directly-declared field metadata.
   * WeakMap ensures entries are garbage-collected when constructors are no longer referenced.
   */
  private static fieldRegistry = new WeakMap<Constructor, IMappingMetadata[]>();

  /**
   * Caches prototype chains for each constructor to avoid recomputing
   * inheritance hierarchies during field resolution.
   */
  private static prototypeChainCache = new WeakMap<Constructor, Constructor[]>();

  /**
   * Caches resolved (flattened + deduplicated) field lists for each constructor.
   * This is the primary optimization for repeated getFields() calls.
   */
  private static resolvedFieldsCache = new WeakMap<Constructor, IMappingMetadata[]>();

  /**
   * Registers a field mapping for a given class constructor.
   * If the field already exists, overwrites its type.
   *
   * @param {Constructor} constructor - Target class constructor to register against.
   * @param {string} propertyKey - Field name to register.
   * @param {Constructor | Constructor[]} [sourceType] - Optional source type(s) for the field.
   */
  public static addField(constructor: Constructor, propertyKey: string, sourceType?: Constructor | Constructor[]): void {
    let arr = this.fieldRegistry.get(constructor);
    if (!arr) {
      arr = [];
      this.fieldRegistry.set(constructor, arr);
    }

    // Overwrite if the property already exists
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].propertyKey === propertyKey) {
        arr[i] = { propertyKey, type: sourceType };
        Logger.log(`[MetadataStore] Updated field '${propertyKey}' on ${constructor.name}`);
        return;
      }
    }

    arr.push({ propertyKey, type: sourceType });
    Logger.log(`[MetadataStore] Registered field '${propertyKey}' on ${constructor.name}`);
  }

  /**
   * Retrieves all mapped fields for a constructor, including inherited ones.
   * Results are deduplicated by property key (child class overrides parent).
   * Uses caching to avoid repeated resolution for the same constructor.
   *
   * @param {Constructor} constructor - Class constructor to retrieve metadata for.
   * @returns {IMappingMetadata[]} Array of field metadata for the class hierarchy.
   */
  public static getFields(constructor: Constructor): IMappingMetadata[] {
    const cached = this.resolvedFieldsCache.get(constructor);
    if (cached) {
      Logger.log(`[MetadataStore] Cache hit for fields of ${constructor.name}`);
      return cached;
    }

    const chain = this.getPrototypeChain(constructor);
    const fields: IMappingMetadata[] = [];
    const seen = new Set<string>();

    for (const cls of chain) {
      const classFields = this.fieldRegistry.get(cls);
      if (!classFields) continue;
      for (const f of classFields) {
        if (!seen.has(f.propertyKey)) {
          fields.push(f);
          seen.add(f.propertyKey);
        }
      }
    }

    this.resolvedFieldsCache.set(constructor, fields);
    Logger.log(`[MetadataStore] Cached ${fields.length} fields for ${constructor.name}`);
    return fields;
  }

  /**
   * Checks if a given constructor (or any of its parents) has registered fields.
   * Uses cached field resolution internally.
   *
   * @param {Constructor} constructor - Class constructor to check.
   * @returns {boolean} True if the constructor or any parent defines mapped fields.
   */
  public static hasFields(constructor: Constructor): boolean {
    return this.getFields(constructor).length > 0;
  }

  /**
   * Builds or retrieves the cached prototype chain for a given constructor.
   * The chain is ordered from the class itself up to (but excluding) Object.
   *
   * @param {Constructor} constructor - Class constructor to analyze.
   * @returns {Constructor[]} Ordered array of constructors in the prototype chain.
   * @private
   */
  private static getPrototypeChain(constructor: Constructor): Constructor[] {
    let chain = this.prototypeChainCache.get(constructor);
    if (!chain) {
      chain = [];
      let current: Constructor | null = constructor;
      while (current && current !== Object) {
        chain.push(current);
        const proto = Object.getPrototypeOf(current.prototype);
        current = proto ? (proto.constructor as Constructor) : null;
      }
      this.prototypeChainCache.set(constructor, chain);
      Logger.log(`[MetadataStore] Cached prototype chain for ${constructor.name}`, chain.length);
    }
    return chain;
  }
}
