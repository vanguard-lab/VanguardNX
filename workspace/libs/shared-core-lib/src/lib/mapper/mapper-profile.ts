import { ClassIdentifier, Dictionary, IMapper } from './types';
import { Logger } from './logger';
import { MappingConfiguration } from './mapping-configuration';

/**
 * Abstract base class for defining mapping profiles.
 */
export abstract class MapperProfile {
  /**
   * Creates a new MapperProfile instance.
   * @param {IMapper} mapper - The ObjectMapper instance
   */
  constructor(protected readonly mapper: IMapper) {
    this.configure();
  }

  /**
   * Creates a mapping between source and target classes with optional configuration.
   * @template TSource - Source type extending Dictionary
   * @template TDestination - Destination type extending Dictionary
   * @param {ClassIdentifier<TSource>} sourceClass - Source class identifier
   * @param {ClassIdentifier<TDestination>} destinationClass - Destination class identifier
   * @param {function(MappingConfiguration<TSource, TDestination>): void} [configuration] - Optional configuration callback
   * @returns {MappingConfiguration<TSource, TDestination>} The mapping configuration
   * @protected
   */
  protected createMap<TSource extends Dictionary<TSource>, TDestination extends Dictionary<TDestination>>(
    sourceClass: ClassIdentifier<TSource>,
    destinationClass: ClassIdentifier<TDestination>,
    configuration?: (config: MappingConfiguration<TSource, TDestination>) => void,
  ): MappingConfiguration<TSource, TDestination> {
    const entry = this.mapper.createMapping(sourceClass, destinationClass);
    Logger.log(`[MapperProfile] Created mapping in ${this.constructor.name}: ${entry.sourceConstructor.name} -> ${entry.targetConstructor.name}`);
    const config = new MappingConfiguration<TSource, TDestination>(entry, this.mapper);
    configuration?.(config);
    return config;
  }

  /**
   * Abstract method to configure mappings. Must be implemented by subclasses.
   * @abstract
   * @protected
   */
  protected abstract configure(): void;
}

/**
 * Creates a member mapping configuration function.
 * @template TSource - Source type
 * @template TDestination - Destination type
 * @param {function(TDestination): any} destinationMember - Function to select destination property
 * @param {Object} mapping - Mapping configuration object
 * @param {function(TSource): any} mapping.mapFrom - Function to map from source
 * @returns {function(MappingConfiguration<TSource, TDestination>): MappingConfiguration<TSource, TDestination>} Configuration function
 */
export function forMember<TSource, TDestination>(
  destinationMember: (dest: TDestination) => any,
  mapping: { mapFrom: (source: TSource) => any },
): (config: MappingConfiguration<TSource, TDestination>) => MappingConfiguration<TSource, TDestination> {
  return (config) => config.forMember(destinationMember, mapping);
}

/**
 * Creates a mapping function configuration.
 * @template TSource - Source type
 * @param {function(TSource): any} mappingFunction - Function to extract value from source
 * @returns {Object} Mapping configuration object with mapFrom property
 */
export function mapFrom<TSource>(mappingFunction: (source: TSource) => any): { mapFrom: (source: TSource) => any } {
  return { mapFrom: mappingFunction };
}
