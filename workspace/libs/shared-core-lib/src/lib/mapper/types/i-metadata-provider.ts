import { Dictionary } from './common';
import { IMappingMetadata } from './i-mapping-metadata';

export interface IMetadataProvider<TModel extends Dictionary<TModel>> {
  getMetadata?(): IMappingMetadata[];
}
