import { map } from '@vanguard-nx/utils';
import { InvalidConstructorException } from './exceptions';
import { Logger } from './logger';
import { MappingEntry } from './mapping-entry';
import { SymbolRegistry } from './symbol-registry';
import { ClassIdentifier, Constructor, Dictionary, IMappingRegistry } from './types';

/**
 * Manages mappings between source and target classes.
 */
export class MappingRegistry implements IMappingRegistry {
  private readonly symbolRegistry = new SymbolRegistry();

  private readonly classMappings = new Map<symbol, Set<symbol>>();

  private readonly customMappings = new Map<symbol, Map<string, (source: any) => any>>();

  public register<TSource extends Dictionary<TSource>, TDestination extends Dictionary<TDestination>>(
    sourceClass: ClassIdentifier<TSource>,
    targetClass: ClassIdentifier<TDestination>,
  ): MappingEntry {
    const sourceConstructor = this.ensureConstructor(sourceClass);
    const targetConstructor = this.ensureConstructor(targetClass);

    const sourceSymbol = this.symbolRegistry.getSymbol(sourceConstructor);
    const targetSymbol = this.symbolRegistry.getSymbol(targetConstructor);

    const targetSet = this.classMappings.get(sourceSymbol) ?? new Set();
    targetSet.add(targetSymbol);
    this.classMappings.set(sourceSymbol, targetSet);
    Logger.log(`[MappingRegistry] Registered mapping: ${sourceConstructor.name} -> ${targetConstructor.name}`);

    return new MappingEntry(sourceSymbol, targetSymbol, sourceConstructor, targetConstructor);
  }

  public addCustomMapping(sourceSymbol: symbol, destinationMember: string, mappingFunction: (source: any) => any): void {
    const mappings = this.customMappings.get(sourceSymbol) ?? new Map();
    mappings.set(destinationMember, mappingFunction);
    this.customMappings.set(sourceSymbol, mappings);
    Logger.log(`[MappingRegistry] Added custom mapping for ${destinationMember}`);
  }

  public getCustomMappings(sourceSymbol: symbol): Map<string, (source: any) => any> | undefined {
    return this.customMappings.get(sourceSymbol);
  }

  public findConstructor(symbol: symbol): Constructor | undefined {
    return this.symbolRegistry.getConstructor(symbol);
  }

  public findSymbol(constructor: Constructor): symbol | undefined {
    return this.symbolRegistry.findSymbol(constructor);
  }

  public hasMapping(sourceSymbol: symbol, targetSymbol: symbol): boolean {
    const targetSet = this.classMappings.get(sourceSymbol);
    const hasMapping = targetSet?.has(targetSymbol) ?? false;

    if (!hasMapping) {
      const sourceStr = sourceSymbol.toString();
      const targetStr = targetSymbol.toString();
      const found = targetSet ? map(Array.from(targetSet), (s) => s.toString()).join(', ') : 'undefined';

      Logger.log(`[MappingRegistry] Mapping check failed: ${sourceStr} -> ${targetStr}, found: ${found}`);
    }
    return hasMapping;
  }

  public debug(): void {
    this.symbolRegistry.debug();

    const mappings = map(Array.from(this.classMappings), ([src, targets]) => {
      const srcStr = src.toString();
      const targetsStr = map(Array.from(targets), (t) => t.toString()).join(', ');
      return `${srcStr} -> [${targetsStr}]`;
    });

    const customMappings = map(Array.from(this.customMappings), ([src, mappings]) => {
      const srcStr = src.toString();
      const keysStr = Array.from(mappings.keys()).join(', ');
      return `${srcStr} -> {${keysStr}}`;
    });

    Logger.log('[MappingRegistry] Mappings:', mappings);
    Logger.log('[MappingRegistry] Custom Mappings:', customMappings);
  }

  public ensureConstructor<T>(identifier: ClassIdentifier<T>): Constructor<T> {
    if (typeof identifier !== 'function') {
      throw new InvalidConstructorException(`Invalid identifier type: ${typeof identifier}. Only constructors supported.`);
    }
    return identifier;
  }
}
