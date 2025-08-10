import { IMappingMetadata } from './i-mapping-metadata';

export interface IValidationResult {
  /**
   * Array of mappable field metadata.
   */
  readonly mappableFields: IMappingMetadata[];

  /**
   * Array of ignored field names.
   */
  readonly ignoredFields: string[];
}
