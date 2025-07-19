/* eslint-disable @typescript-eslint/member-ordering */
export type Dictionary<T> = {
  [key in keyof T]?: unknown;
};

export type Constructor<T = any> = new (...args: any[]) => T;

export interface MappingMetadata {
  propertyKey: string;
  type: Constructor | Constructor[];
  depth?: number;
  isGetterOnly?: boolean;
}

export interface MetadataProvider<TModel extends Dictionary<TModel>> {
  getMetadata?(): MappingMetadata[];
}

export type ClassIdentifier<T = any> = string | symbol | Constructor<T>;

// Metadata Storage Service
class MetadataStore {
  private static readonly fieldRegistry = new WeakMap<Function, Set<string>>();

  public static addField(constructor: Function, propertyKey: string): void {
    if (!this.fieldRegistry.has(constructor)) {
      this.fieldRegistry.set(constructor, new Set());
    }
    this.fieldRegistry.get(constructor)!.add(propertyKey);

    console.log(`[MetadataStore] Registered field '${propertyKey}' on ${constructor.name}`);
  }

  public static getFields(constructor: Function): string[] {
    const fields = Array.from(this.fieldRegistry.get(constructor) || []);
    console.log(`[MetadataStore] Retrieved ${fields.length} fields for ${constructor.name}:`, fields);
    return fields;
  }

  public static hasFields(constructor: Function): boolean {
    return this.fieldRegistry.has(constructor) && this.fieldRegistry.get(constructor)!.size > 0;
  }
}

// Field Decorator
export function AutoMap() {
  return function (target: any, propertyKey: string): void {
    MetadataStore.addField(target.constructor, propertyKey);
  };
}

// Mapping Entry
class MappingEntry {
  constructor(
    public readonly sourceSymbol: symbol,
    public readonly targetSymbol: symbol,
    public readonly sourceConstructor: Constructor,
    public readonly targetConstructor: Constructor,
  ) {}
}
// Registry Service
class MappingRegistry {
  private readonly classSymbols = new Map<symbol, Constructor>();

  private readonly classMappings = new Map<symbol, symbol>();

  public register<TSource extends Dictionary<TSource>, TDestination extends Dictionary<TDestination>>(
    sourceClass: ClassIdentifier<TSource>,
    targetClass: ClassIdentifier<TDestination>,
  ): MappingEntry {
    const sourceConstructor = this.resolveConstructor(sourceClass);
    const targetConstructor = this.resolveConstructor(targetClass);

    const sourceSymbol = Symbol(sourceConstructor.name);
    const targetSymbol = Symbol(targetConstructor.name);

    this.classSymbols.set(sourceSymbol, sourceConstructor);
    this.classSymbols.set(targetSymbol, targetConstructor);
    this.classMappings.set(sourceSymbol, targetSymbol);

    console.log(`[MappingRegistry] Registered mapping: ${sourceConstructor.name} -> ${targetConstructor.name}`);

    return new MappingEntry(sourceSymbol, targetSymbol, sourceConstructor, targetConstructor);
  }

  public findConstructor(symbol: symbol): Constructor | undefined {
    return this.classSymbols.get(symbol);
  }

  public findSymbol(constructor: Constructor): symbol | undefined {
    for (const [symbol, registeredConstructor] of this.classSymbols) {
      if (registeredConstructor === constructor) {
        return symbol;
      }
    }
    return undefined;
  }

  public hasMapping(sourceSymbol: symbol, targetSymbol: symbol): boolean {
    return this.classMappings.get(sourceSymbol) === targetSymbol;
  }

  private resolveConstructor<T>(identifier: ClassIdentifier<T>): Constructor<T> {
    if (typeof identifier === 'function') {
      return identifier;
    }
    throw new Error(`[MappingRegistry] Invalid identifier type: ${typeof identifier}. Only constructors supported.`);
  }

  public debug(): void {
    console.log(
      '[MappingRegistry] Class Symbols:',
      Array.from(this.classSymbols.entries()).map(([sym, ctor]) => `${sym.toString()} -> ${ctor.name}`),
    );
    console.log(
      '[MappingRegistry] Mappings:',
      Array.from(this.classMappings.entries()).map(([src, dest]) => `${src.toString()} -> ${dest.toString()}`),
    );
  }
}

// Validation Result
class ValidationResult {
  constructor(public readonly mappableFields: string[], public readonly ignoredFields: string[]) {}
}
// Field Validator
class FieldValidator {
  public static validateMappedFields(sourceConstructor: Constructor, targetConstructor: Constructor): ValidationResult {
    const sourceFields = MetadataStore.getFields(sourceConstructor);
    const targetFields = MetadataStore.getFields(targetConstructor);

    if (sourceFields.length === 0) {
      throw new Error(`[FieldValidator] No @AutoMap fields found on ${sourceConstructor.name}`);
    }

    if (targetFields.length === 0) {
      throw new Error(`[FieldValidator] No @AutoMap fields found on ${targetConstructor.name}`);
    }

    const mappableFields = sourceFields.filter((field) => targetFields.includes(field));
    const ignoredFields = sourceFields.filter((field) => !targetFields.includes(field));

    console.log(`[FieldValidator] ${sourceConstructor.name} -> ${targetConstructor.name}:`);
    console.log(`  - Mappable fields (${mappableFields.length}):`, mappableFields);

    if (ignoredFields.length > 0) {
      console.log(`  - Ignored fields (${ignoredFields.length}):`, ignoredFields);
    }

    return new ValidationResult(mappableFields, ignoredFields);
  }
}

// Object Transformer
class ObjectTransformer {
  public static transform<TSource extends Dictionary<TSource>, TDestination extends Dictionary<TDestination>>(
    source: TSource,
    targetConstructor: Constructor<TDestination>,
    mappableFields: string[],
  ): TDestination {
    const target = new targetConstructor();

    console.log(`[ObjectTransformer] Transforming to ${targetConstructor.name}...`);

    let transformedCount = 0;
    mappableFields.forEach((field) => {
      console.log(`[ObjectTransformer] Processing field: '${field}'`);

      if (field in source) {
        const sourceValue = (source as any)[field];
        console.log(`[ObjectTransformer] Found field '${field}' in source with value:`, sourceValue);

        (target as any)[field] = sourceValue;
        transformedCount++;

        console.log(`[ObjectTransformer] Successfully mapped '${field}' to target`);
      } else {
        console.log(`[ObjectTransformer] Field '${field}' not found in source object - skipping`);
      }
    });

    console.log(`[ObjectTransformer] Completed. Transformed ${transformedCount}/${mappableFields.length} fields.`);

    return target;
  }
}

// Main Mapper Class
export class ObjectMapper {
  private readonly registry = new MappingRegistry();

  public createMapping<TSource extends Dictionary<TSource>, TDestination extends Dictionary<TDestination>>(
    sourceClass: ClassIdentifier<TSource>,
    targetClass: ClassIdentifier<TDestination>,
  ): MappingEntry {
    return this.registry.register(sourceClass, targetClass);
  }

  public map<TSource extends Dictionary<TSource>, TDestination extends Dictionary<TDestination>>(
    source: TSource,
    sourceClass: ClassIdentifier<TSource>,
    targetClass: ClassIdentifier<TDestination>,
  ): TDestination {
    console.log(`[ObjectMapper] Starting transformation...`);

    const sourceConstructor = this.resolveConstructor(sourceClass);
    const targetConstructor = this.resolveConstructor(targetClass);

    const sourceSymbol = this.registry.findSymbol(sourceConstructor);
    const targetSymbol = this.registry.findSymbol(targetConstructor);

    if (!sourceSymbol || !targetSymbol) {
      throw new Error(`[ObjectMapper] Classes not registered. Source: ${!!sourceSymbol}, Target: ${!!targetSymbol}`);
    }

    if (!this.registry.hasMapping(sourceSymbol, targetSymbol)) {
      throw new Error(`[ObjectMapper] No mapping exists: ${sourceConstructor.name} -> ${targetConstructor.name}`);
    }

    const validation = FieldValidator.validateMappedFields(sourceConstructor, targetConstructor);

    return ObjectTransformer.transform(source, targetConstructor, validation.mappableFields);
  }

  private resolveConstructor<T>(identifier: ClassIdentifier<T>): Constructor<T> {
    if (typeof identifier === 'function') {
      return identifier;
    }
    throw new Error(`[ObjectMapper] Invalid identifier: ${typeof identifier}`);
  }

  public debug(): void {
    this.registry.debug();
  }
}

// Usage Example:
/*
class Source {
  @AutoMap()
  name: string = '';

  @AutoMap()
  age: number = 0;

  unmappedField: string = '';
}

class Target {
  @AutoMap()
  name: string = '';

  @AutoMap()
  age: number = 0;
}

const mapper = new ObjectMapper();
mapper.createMapping(Source, Target);

const source = new Source();
source.name = 'John';
source.age = 30;

const result = mapper.map(source, Source, Target);
*/
