import { PropertyKeyExtractionException } from './exceptions';
import { Logger } from './logger';
import { MappingEntry } from './mapping-entry';
import { Dictionary, ITransmute } from './types';

/**
 * Represents a mapping configuration between source and target classes.
 * @typeParam TSource - Source type extending Dictionary.
 * @typeParam TDestination - Destination type extending Dictionary.
 */
export class MappingConfiguration<TSource extends Dictionary<TSource>, TDestination extends Dictionary<TDestination>> {
  /**
   * Creates a new MappingConfiguration instance.
   * @param {MappingEntry} entry - The mapping entry
   * @param {ITransmute} mapper - The ObjectMapper instance
   */
  constructor(private readonly entry: MappingEntry, private readonly mapper: ITransmute) {}

  /**
   * Configures a custom mapping for a destination member.
   * @param {function(TDestination): any} destinationMember - Function to select the destination property
   * @param {Object} mapping - Mapping configuration object
   * @param {function(TSource): any} mapping.mapFrom - Function to map from source
   * @returns {MappingConfiguration<TSource, TDestination>} This configuration instance for chaining
   */
  public forMember(destinationMember: (dest: TDestination) => any, mapping: { mapFrom: (source: TSource) => any }): this {
    const destinationKey = this.getPropertyKey(destinationMember);
    Logger.log(`[MappingConfiguration] Custom mapping configured for member: ${destinationKey}`);
    this.mapper.addCustomMapping(this.entry.sourceSymbol, destinationKey, mapping.mapFrom);
    return this;
  }

  /**
   * [BETA] Ignores a destination member during mapping. Not implemented yet.
   * @param {function(TDestination): any} destinationMember - Function to select the destination property to ignore
   * @returns {MappingConfiguration<TSource, TDestination>} This configuration instance for chaining
   */
  public ignoreMember(destinationMember: (dest: TDestination) => any): this {
    Logger.log(`[MappingConfiguration] [METHOD_NOT_IMPLEMENTED_YET] Ignoring member: ${this.getPropertyKey(destinationMember)}`);
    return this;
  }

  /**
   * Extracts the property key from a member function.
   * @param {function(TDestination): any} destinationMember - Function to select the destination property
   * @returns {string} The extracted property name
   * @throws {PropertyKeyExtractionException} If the property name cannot be extracted
   * @private
   */
  private getPropertyKey(destinationMember: (dest: TDestination) => any): string {
    const propName = destinationMember.toString().match(/\.(\w+)/)?.[1];
    if (!propName) throw new PropertyKeyExtractionException(`Could not extract property name from ${destinationMember}`);
    return propName;
  }
}
