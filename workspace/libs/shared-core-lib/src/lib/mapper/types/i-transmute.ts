import { ClassIdentifier, Constructor, Dictionary } from './common';
import { IMappingEntry } from './i-mapping-entry';

export interface IMapper {
  /**
   * Creates a mapping between source and target classes in the registry.
   * Establishes the relationship required for subsequent transformations.
   *
   * @template TSource - Source type extending Dictionary interface
   * @template TDestination - Destination type extending Dictionary interface
   * @param sourceClass - Source class identifier for mapping registration
   * @param targetClass - Target class identifier for mapping registration
   * @returns MappingEntry representing the created mapping relationship
   */
  createMapping<TSource extends Dictionary<TSource>, TDestination extends Dictionary<TDestination>>(
    sourceClass: ClassIdentifier<TSource>,
    targetClass: ClassIdentifier<TDestination>,
  ): IMappingEntry;

  /**
   * Transforms a single source object to target class instance.
   * Applies field mappings, validations, and custom transformations.
   *
   * @template TSource - Source type extending Dictionary interface
   * @template TDestination - Destination type extending Dictionary interface
   * @param source - Source object instance to transform
   * @param sourceClass - Source class identifier for transformation context
   * @param targetClass - Target class identifier for result instantiation
   * @returns Fully transformed target class instance
   * @throws AutoMapNotFoundException when mapping not found or classes not registered
   */
  map<TSource extends Dictionary<TSource>, TDestination extends Dictionary<TDestination>>(
    source: TSource,
    sourceClass: ClassIdentifier<TSource>,
    targetClass: ClassIdentifier<TDestination>,
  ): TDestination;

  /**
   * Mutates target object instance with values from source object.
   * @template TSourceClass - Source class type
   * @template TDestinationClass - Destination class type
   * @param {InstanceType<TSourceClass>} source - Source object to read values from
   * @param {InstanceType<TDestinationClass>} target - Target object to mutate
   * @param {TSourceClass} sourceClass - Source class identifier
   * @param {TDestinationClass} targetClass - Target class identifier
   * @returns {InstanceType<TDestinationClass>} The mutated target object (same reference)
   */
  mutate<TSourceClass extends Constructor, TDestinationClass extends Constructor>(
    source: InstanceType<TSourceClass>,
    target: InstanceType<TDestinationClass>,
    sourceClass: TSourceClass,
    targetClass: TDestinationClass,
  ): InstanceType<TDestinationClass>;
  /**
   * Transforms an array of source objects to target class instances.
   * Optimizes batch transformations by reusing validation and mapping data.
   *
   * @template TSource - Source type extending Dictionary interface
   * @template TDestination - Destination type extending Dictionary interface
   * @param sources - Array of source objects to transform
   * @param sourceClass - Source class identifier for transformation context
   * @param targetClass - Target class identifier for result instantiation
   * @returns Array of transformed target class instances
   * @throws InvalidArrayInputException when sources parameter is not an array
   * @throws AutoMapNotFoundException when mapping not found or classes not registered
   */
  mapArray<TSource extends Dictionary<TSource>, TDestination extends Dictionary<TDestination>>(
    sources: TSource[],
    sourceClass: ClassIdentifier<TSource>,
    targetClass: ClassIdentifier<TDestination>,
  ): TDestination[];

  /**
   * Registers a custom transformation function for specific destination member.
   * Enables complex field transformations beyond direct property copying.
   *
   * @param sourceSymbol - Unique symbol identifying the source class in registry
   * @param destinationMember - Target property name for custom transformation
   * @param mappingFunction - Function accepting source value and returning transformed result
   */
  addCustomMapping(sourceSymbol: symbol, destinationMember: string, mappingFunction: (source: any) => any): void;

  /**
   * Retrieves all custom mapping functions registered for source class.
   * Used internally during transformation to apply custom field logic.
   *
   * @param sourceSymbol - Unique symbol identifying the source class in registry
   * @returns Map of destination member names to transformation functions, or undefined if none exist
   */
  getCustomMappings(sourceSymbol: symbol): Map<string, (source: any) => any> | undefined;

  /**
   * Outputs comprehensive debug information about mapper internal state.
   * Includes registered mappings, cached validations, and transformation statistics.
   */
  debug(): void;
}
