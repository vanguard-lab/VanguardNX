import { Injectable } from '@nestjs/common';
import { FieldValidator } from './field-validator';
import { Logger } from './logger';
import { MappingEntry } from './mapping-entry';
import { MappingRegistry } from './mapping-registry';
import { ObjectTransformer } from './object-transformer';
import { ClassIdentifier, Constructor, Dictionary, IMapper } from './types';
import { isArray } from '@vanguard-nx/utils';
import { AutoMapNotFoundException, InvalidArrayInputException } from './exceptions';

/**
 * Main ObjectMapper service for managing class mappings and transformations.
 * @injectable
 */
@Injectable()
export class Mapper implements IMapper {
  private readonly registry: MappingRegistry;

  /**
   * Creates a new ObjectMapper instance.
   */
  constructor() {
    this.registry = new MappingRegistry();
    Logger.log('[ObjectMapper] Service initialized');
  }

  public mutate<TSource extends Dictionary<TSource>, TDestination extends Dictionary<TDestination>>(
    source: TSource,
    target: TDestination,
    sourceClass: ClassIdentifier<TSource>,
    targetClass: ClassIdentifier<TDestination>,
  ): TDestination {
    Logger.log(`[ObjectMapper] Starting mutation... from ${sourceClass.name}[${sourceClass}] to ${targetClass.name}[${targetClass}]`);

    const { sourceConstructor, targetConstructor, validation, customMappings } = this.prepareMutation(sourceClass, targetClass);

    return ObjectTransformer.mutate(source, target, sourceConstructor, targetConstructor, validation.mappableFields, customMappings, this);
  }

  /**
   * Creates a mapping between source and target classes.
   * @template TSource - Source type extending Dictionary
   * @template TDestination - Destination type extending Dictionary
   * @param {ClassIdentifier<TSource>} sourceClass - Source class identifier
   * @param {ClassIdentifier<TDestination>} targetClass - Target class identifier
   * @returns {MappingEntry} The created mapping entry
   */
  public createMapping<TSource extends Dictionary<TSource>, TDestination extends Dictionary<TDestination>>(
    sourceClass: ClassIdentifier<TSource>,
    targetClass: ClassIdentifier<TDestination>,
  ): MappingEntry {
    return this.registry.register(sourceClass, targetClass);
  }

  /**
   * Maps a single source object to target class.
   * @template TSource - Source type extending Dictionary
   * @template TDestination - Destination type extending Dictionary
   * @param {TSource} source - Source object to map
   * @param {ClassIdentifier<TSource>} sourceClass - Source class identifier
   * @param {ClassIdentifier<TDestination>} targetClass - Target class identifier
   * @returns {TDestination} Mapped target object
   */
  public map<TSource extends Dictionary<TSource>, TDestination extends Dictionary<TDestination>>(
    source: TSource,
    sourceClass: ClassIdentifier<TSource>,
    targetClass: ClassIdentifier<TDestination>,
  ): TDestination {
    Logger.log(`[ObjectMapper] Starting transformation... from ${sourceClass.name}[${sourceClass}] to ${targetClass.name}[${targetClass}]`);

    const { targetConstructor, validation, customMappings } = this.prepareMapping(sourceClass, targetClass);

    return ObjectTransformer.transform(source, targetConstructor, validation.mappableFields, customMappings, this);
  }

  /**
   * Maps an array of source objects to target class.
   * @template TSource - Source type extending Dictionary
   * @template TDestination - Destination type extending Dictionary
   * @param {TSource[]} sources - Array of source objects to map
   * @param {ClassIdentifier<TSource>} sourceClass - Source class identifier
   * @param {ClassIdentifier<TDestination>} targetClass - Target class identifier
   * @returns {TDestination[]} Array of mapped target objects
   * @throws {InvalidArrayInputException} If sources is not an array
   */
  public mapArray<TSource extends Dictionary<TSource>, TDestination extends Dictionary<TDestination>>(
    sources: TSource[],
    sourceClass: ClassIdentifier<TSource>,
    targetClass: ClassIdentifier<TDestination>,
  ): TDestination[] {
    Logger.log(`[ObjectMapper] Starting array transformation...`);
    if (!isArray(sources)) throw new InvalidArrayInputException(`[ObjectMapper] Invalid input: sources must be an array`);
    const { targetConstructor, validation, customMappings } = this.prepareMapping(sourceClass, targetClass);
    return sources.map((source) => ObjectTransformer.transform(source, targetConstructor, validation.mappableFields, customMappings, this));
  }

  /**
   * Outputs debug information about the mapper state.
   */
  public debug(): void {
    this.registry.debug();
  }

  /**
   * Adds a custom mapping function for a specific destination member.
   * @param {symbol} sourceSymbol - Symbol representing the source class
   * @param {string} destinationMember - Name of the destination member
   * @param {function(any): any} mappingFunction - Function to transform the source value
   */
  public addCustomMapping(sourceSymbol: symbol, destinationMember: string, mappingFunction: (source: any) => any): void {
    this.registry.addCustomMapping(sourceSymbol, destinationMember, mappingFunction);
  }

  /**
   * Retrieves custom mappings for a source symbol.
   * @param {symbol} sourceSymbol - Symbol representing the source class
   * @returns {Map<string, function(any): any>|undefined} Map of custom mappings or undefined
   */
  public getCustomMappings(sourceSymbol: symbol): Map<string, (source: any) => any> | undefined {
    return this.registry.getCustomMappings(sourceSymbol);
  }

  /**
   * Core preparation logic shared between mapping and mutation operations.
   * @template TSource
   * @template TDestination
   * @param {ClassIdentifier<TSource>} sourceClass - Source class identifier
   * @param {ClassIdentifier<TDestination>} targetClass - Target class identifier
   * @returns {Object} Object containing all preparation data
   * @throws {Error} If classes are not registered or no mapping exists
   * @private
   */
  private prepareMaps<TSource, TDestination>(
    sourceClass: ClassIdentifier<TSource>,
    targetClass: ClassIdentifier<TDestination>,
  ): {
    sourceConstructor: Constructor<TSource>;
    targetConstructor: Constructor<TDestination>;
    validation: ReturnType<typeof FieldValidator.validateMappedFields>;
    customMappings: Map<string, (source: any) => any> | undefined;
  } {
    const sourceConstructor = this.registry.ensureConstructor(sourceClass);
    const targetConstructor = this.registry.ensureConstructor(targetClass);
    const sourceSymbol = this.registry.findSymbol(sourceConstructor);
    const targetSymbol = this.registry.findSymbol(targetConstructor);

    if (!sourceSymbol || !targetSymbol) {
      throw new AutoMapNotFoundException(`Source or target class not registered: ${sourceConstructor.name} -> ${targetConstructor.name}`);
    }

    if (!this.registry.hasMapping(sourceSymbol, targetSymbol)) {
      throw new AutoMapNotFoundException(`No mapping exists: ${sourceConstructor.name} -> ${targetConstructor.name}`, 'Internal Server Error');
    }

    const validation = FieldValidator.validateMappedFields(sourceConstructor, targetConstructor, this.registry);
    const customMappings = this.registry.getCustomMappings(sourceSymbol);

    return { sourceConstructor, targetConstructor, validation, customMappings };
  }

  /**
   * Prepares mapping data for mutation operations.
   * @template TSource
   * @template TDestination
   * @param {ClassIdentifier<TSource>} sourceClass - Source class identifier
   * @param {ClassIdentifier<TDestination>} targetClass - Target class identifier
   * @returns {Object} Object containing sourceConstructor, targetConstructor, validation, and customMappings
   * @throws {Error} If classes are not registered or no mapping exists
   * @private
   */
  private prepareMutation<TSource, TDestination>(
    sourceClass: ClassIdentifier<TSource>,
    targetClass: ClassIdentifier<TDestination>,
  ): {
    sourceConstructor: Constructor<TSource>;
    targetConstructor: Constructor<TDestination>;
    validation: ReturnType<typeof FieldValidator.validateMappedFields>;
    customMappings: Map<string, (source: any) => any> | undefined;
  } {
    return this.prepareMaps(sourceClass, targetClass);
  }

  /* Prepares mapping data for transformation.
   * @template TSource
   * @template TDestination
   * @param {ClassIdentifier<TSource>} sourceClass - Source class identifier
   * @param {ClassIdentifier<TDestination>} targetClass - Target class identifier
   * @returns {Object} Object containing targetConstructor, validation, and customMappings
   * @throws {Error} If classes are not registered or no mapping exists
   * @private
   */
  private prepareMapping<TSource, TDestination>(
    sourceClass: ClassIdentifier<TSource>,
    targetClass: ClassIdentifier<TDestination>,
  ): {
    targetConstructor: new () => TDestination;
    validation: ReturnType<typeof FieldValidator.validateMappedFields>;
    customMappings: Map<string, (source: any) => any> | undefined;
  } {
    const { targetConstructor, validation, customMappings } = this.prepareMaps(sourceClass, targetClass);
    return { targetConstructor, validation, customMappings };
  }
}
