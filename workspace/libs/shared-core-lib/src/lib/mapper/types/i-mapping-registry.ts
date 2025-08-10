import { Dictionary } from 'lodash';
import { ClassIdentifier, Constructor } from './common';
import { IMappingEntry } from './i-mapping-entry';

export interface IMappingRegistry {
  /**
   * Registers a mapping between source and target classes.
   * @template TSource - Source type extending Dictionary
   * @template TDestination - Destination type extending Dictionary
   * @param sourceClass - Source class identifier
   * @param targetClass - Target class identifier
   * @returns The created mapping entry
   */
  register<TSource extends Dictionary<TSource>, TDestination extends Dictionary<TDestination>>(
    sourceClass: ClassIdentifier<TSource>,
    targetClass: ClassIdentifier<TDestination>,
  ): IMappingEntry;

  /**
   * Adds a custom mapping function for a specific destination member.
   * @param sourceSymbol - Symbol representing the source class
   * @param destinationMember - Name of the destination member
   * @param mappingFunction - Function to transform the source value
   */
  addCustomMapping(sourceSymbol: symbol, destinationMember: string, mappingFunction: (source: any) => any): void;

  /**
   * Retrieves custom mappings for a source symbol.
   * @param sourceSymbol - Symbol representing the source class
   * @returns Map of custom mappings or undefined
   */
  getCustomMappings(sourceSymbol: symbol): Map<string, (source: any) => any> | undefined;

  /**
   * Finds a constructor by its symbol.
   * @param symbol - The symbol to search for
   * @returns The constructor or undefined if not found
   */
  findConstructor(symbol: symbol): Constructor | undefined;

  /**
   * Finds a symbol by its constructor.
   * @param constructor - The constructor to search for
   * @returns The symbol or undefined if not found
   */
  findSymbol(constructor: Constructor): symbol | undefined;

  /**
   * Checks if a mapping exists between source and target symbols.
   * @param sourceSymbol - Source class symbol
   * @param targetSymbol - Target class symbol
   * @returns True if mapping exists, false otherwise
   */
  hasMapping(sourceSymbol: symbol, targetSymbol: symbol): boolean;

  /**
   * Outputs debug information about the registry state.
   */
  debug(): void;

  /**
   * Ensures the identifier is a valid constructor.
   * @template T
   * @param identifier - Class identifier to validate
   * @returns The validated constructor
   * @throws InvalidConstructorException if identifier is not a function
   */
  ensureConstructor<T>(identifier: ClassIdentifier<T>): Constructor<T>;
}
